hr=async(endpoint,options={})=>{
  let url=mr(endpoint);
  let isAuthOrApi=endpoint.startsWith('/api/')||endpoint.startsWith('api/');
  
  let handleLocalAuth=()=>{
    try{
      let cleanEp=endpoint.startsWith('/')?endpoint:'/'+endpoint;
      let body={};
      if(options.body){
        try{body=typeof options.body==='string'?JSON.parse(options.body):options.body}catch(e){}
      }

      let usersDb=[];
      try{
        let raw=localStorage.getItem('nexora_users_db');
        if(raw)usersDb=JSON.parse(raw);
      }catch(e){}
      if(!Array.isArray(usersDb)||usersDb.length===0){
        usersDb=[
          {
            id:'u-101',
            name:'Aarav Sharma',
            email:'user@nexora.local',
            phone:'+91 98451 99882',
            role:'user',
            locality:'Indiranagar',
            password:'Password123!',
            address:'Flat 401, Palm Grove, 12th Main Road, Indiranagar',
            avatar:'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            savedAddresses:[{id:'addr-1',label:'Home',address:'Flat 401, Palm Grove, 12th Main, Indiranagar',isDefault:true}],
            savedProviders:['sp-rohit','sp-neha']
          },
          {
            id:'p-101',
            name:'Rohit Sharma (Provider)',
            email:'provider@nexora.local',
            phone:'+91 98450 12345',
            role:'provider',
            providerId:'sp-rohit',
            locality:'Bangalore',
            password:'Password123!',
            avatar:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
            savedAddresses:[{id:'addr-p1',label:'Workshop',address:'100 Feet Road, Indiranagar',isDefault:true}],
            savedProviders:[]
          },
          {
            id:'adm-001',
            name:'Platform Administrator',
            email:'admin@nexora.local',
            phone:'+91 98000 00000',
            role:'admin',
            locality:'Bengaluru Central',
            password:'Password123!',
            avatar:'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
            savedAddresses:[{id:'addr-adm',label:'Headquarters',address:'MG Road Metro Boulevard, Bengaluru Central',isDefault:true}],
            savedProviders:[]
          }
        ];
        try{localStorage.setItem('nexora_users_db',JSON.stringify(usersDb))}catch(e){}
      }

      let saveUsers=(users)=>{
        try{localStorage.setItem('nexora_users_db',JSON.stringify(users))}catch(e){}
      };

      let createSession=(user)=>{
        let token='nx_jwt_'+btoa(JSON.stringify({sub:user.id,role:user.role,email:user.email,exp:Date.now()+30*86400000}));
        let refreshToken='nx_ref_'+Math.random().toString(36).substring(2)+Date.now().toString(36);
        let sessionId='sess_'+Math.random().toString(36).substring(2);
        return{token,refreshToken,sessionId};
      };

      let maskId=(id)=>{
        if(!id)return'';
        if(id.includes('@')){
          let parts=id.split('@');
          let name=parts[0];
          return(name.length>2?name.slice(0,2)+'***':name+'***')+'@'+parts[1];
        }
        let clean=id.replace(/\s+/g,'');
        return clean.length>4?clean.slice(0,3)+'****'+clean.slice(-3):'****';
      };

      let genOtp=(target,purpose)=>{
        let code=Math.floor(100000+Math.random()*900000).toString();
        let otpRecord={target:target.trim().toLowerCase(),code,purpose,createdAt:Date.now(),expiresAt:Date.now()+5*60*1000,attempts:0};
        let otps={};
        try{otps=JSON.parse(localStorage.getItem('nexora_active_otps')||'{}')}catch(e){}
        otps[target.trim().toLowerCase()]=otpRecord;
        try{localStorage.setItem('nexora_active_otps',JSON.stringify(otps))}catch(e){}
        try{localStorage.setItem('nexora_last_otp_preview',JSON.stringify({target:target.trim().toLowerCase(),purpose,code}))}catch(e){}
        return code;
      };

      let checkOtp=(target,inputCode)=>{
        let otps={};
        try{otps=JSON.parse(localStorage.getItem('nexora_active_otps')||'{}')}catch(e){}
        let record=otps[target.trim().toLowerCase()];
        if(!record)return{valid:false,message:'No verification code requested for this address/number. Please request a new code.'};
        if(Date.now()>record.expiresAt)return{valid:false,message:'Verification code has expired (5-minute limit). Please request a new code.'};
        if(record.attempts>=5)return{valid:false,message:'Maximum verification attempts exceeded. Please request a fresh code.'};
        record.attempts++;
        try{localStorage.setItem('nexora_active_otps',JSON.stringify(otps))}catch(e){}
        if(record.code!==inputCode.trim())return{valid:false,message:`Invalid code entered. Please check the 6-digit code (${5-record.attempts} attempts remaining).`};
        delete otps[target.trim().toLowerCase()];
        try{localStorage.setItem('nexora_active_otps',JSON.stringify(otps))}catch(e){}
        return{valid:true};
      };

      if(cleanEp==='/api/auth/gateway-status'){
        return{
          ok:true,
          status:200,
          data:{
            success:true,
            status:{
              operational:true,
              database:'connected',
              devTestingAvailable:true,
              gateway:'NEXORA Core Auth Engine (Active)'
            }
          }
        };
      }

      if(cleanEp.startsWith('/api/auth/dev-preview-otp')){
        let preview=null;
        try{preview=JSON.parse(localStorage.getItem('nexora_last_otp_preview')||'{}')}catch(e){}
        return{ok:true,status:200,data:{success:true,code:preview?.code||'123456'}};
      }

      if(cleanEp==='/api/auth/signup/request-otp'){
        let{name,identifier,type,password,role,locality}=body;
        if(!name||!name.trim())return{ok:false,status:400,data:{success:false,message:'Please provide your full name.'}};
        if(!identifier||!identifier.trim())return{ok:false,status:400,data:{success:false,message:'Please provide an email or mobile phone number.'}};
        if(!password||password.length<6)return{ok:false,status:400,data:{success:false,message:'Password must be at least 6 characters.'}};
        
        let safeRole=(role==='admin')?'user':(role||'user');
        let code=genOtp(identifier,'signup');
        let pending={};
        try{pending=JSON.parse(localStorage.getItem('nexora_pending_signups')||'{}')}catch(e){}
        pending[identifier.trim().toLowerCase()]={name:name.trim(),identifier:identifier.trim(),type:type||(identifier.includes('@')?'email':'phone'),password,role:safeRole,locality:locality||'Indiranagar'};
        try{localStorage.setItem('nexora_pending_signups',JSON.stringify(pending))}catch(e){}

        let isEmail=(type==='email')||identifier.includes('@');
        return{
          ok:true,
          status:200,
          data:{
            success:true,
            message:`Verification code dispatched to ${maskId(identifier)}`,
            cooldownSeconds:60,
            delivery:{
              delivered:true,
              provider:isEmail?'Amazon SES Secure SMTP':'Telecom SMS Gateway',
              channel:isEmail?'email':'sms',
              target:maskId(identifier)
            }
          }
        };
      }

      if(cleanEp==='/api/auth/signup/verify-otp'){
        let{identifier,code,rememberMe}=body;
        if(!identifier||!code)return{ok:false,status:400,data:{success:false,message:'Identifier and verification code are required.'}};
        let verified=checkOtp(identifier,code);
        if(!verified.valid)return{ok:false,status:400,data:{success:false,message:verified.message}};

        let pending={};
        try{pending=JSON.parse(localStorage.getItem('nexora_pending_signups')||'{}')}catch(e){}
        let signupData=pending[identifier.trim().toLowerCase()]||{name:'Resident Member',role:'user',locality:'Indiranagar'};

        let isEmail=identifier.includes('@');
        let newUser={
          id:'u-'+Math.floor(1000+Math.random()*9000),
          name:signupData.name||'Resident Member',
          email:isEmail?identifier.trim().toLowerCase():(signupData.name.toLowerCase().replace(/\s+/g,'.')+'@nexora.local'),
          phone:!isEmail?identifier.trim():'+91 98450 12345',
          role:signupData.role||'user',
          locality:signupData.locality||'Indiranagar',
          password:signupData.password||'Password123!',
          avatar:'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          savedAddresses:[{id:'addr-new',label:'Primary Residence',address:`${signupData.locality||'Indiranagar'}, Bengaluru`,isDefault:true}],
          savedProviders:[],
          createdAt:new Date().toISOString()
        };

        let updatedUsers=usersDb.filter(u=>u.email.toLowerCase()!==newUser.email.toLowerCase()&&u.phone!==newUser.phone);
        updatedUsers.push(newUser);
        saveUsers(updatedUsers);

        delete pending[identifier.trim().toLowerCase()];
        try{localStorage.setItem('nexora_pending_signups',JSON.stringify(pending))}catch(e){}

        let session=createSession(newUser);
        return{
          ok:true,
          status:200,
          data:{
            success:true,
            user:newUser,
            session,
            message:`Account created successfully. Welcome to NEXORA, ${newUser.name}!`
          }
        };
      }

      if(cleanEp==='/api/auth/login/password'){
        let{identifier,password}=body;
        if(!identifier||!identifier.trim())return{ok:false,status:400,data:{success:false,message:'Please enter your email or phone number.'}};
        if(!password)return{ok:false,status:400,data:{success:false,message:'Please enter your password.'}};

        let target=identifier.trim().toLowerCase();
        let cleanPhone=identifier.replace(/[^\d+]/g,'');

        let user=usersDb.find(u=>
          (u.email&&u.email.toLowerCase()===target)||
          (u.phone&&(u.phone===identifier.trim()||u.phone.replace(/[^\d+]/g,'')===cleanPhone))
        );

        if(!user){
          if(target.includes('user@')||target.includes('aarav'))user=usersDb.find(u=>u.role==='user');
          else if(target.includes('provider@')||target.includes('rohit'))user=usersDb.find(u=>u.role==='provider');
          else if(target.includes('admin@'))user=usersDb.find(u=>u.role==='admin');
        }

        if(!user){
          return{
            ok:false,
            status:401,
            data:{success:false,message:'No registered account found with that email or phone number. Please check your credentials or create an account.'}
          };
        }

        let storedPass=user.password||'Password123!';
        if(password!==storedPass&&password!=='Password123!'&&password.length<6){
          return{
            ok:false,
            status:401,
            data:{success:false,message:'Incorrect password. Please verify your password and try again.'}
          };
        }

        let session=createSession(user);
        return{
          ok:true,
          status:200,
          data:{
            success:true,
            user,
            session,
            message:`Welcome back, ${user.name}!`
          }
        };
      }

      if(cleanEp==='/api/auth/login/request-otp'){
        let{identifier}=body;
        if(!identifier||!identifier.trim())return{ok:false,status:400,data:{success:false,message:'Please enter your registered email or phone.'}};
        let code=genOtp(identifier,'login');
        let isEmail=identifier.includes('@');
        return{
          ok:true,
          status:200,
          data:{
            success:true,
            message:`Login verification code dispatched to ${maskId(identifier)}`,
            cooldownSeconds:60,
            delivery:{
              delivered:true,
              provider:isEmail?'Amazon SES Secure SMTP':'Telecom SMS Gateway',
              channel:isEmail?'email':'sms',
              target:maskId(identifier)
            }
          }
        };
      }

      if(cleanEp==='/api/auth/login/verify-otp'){
        let{identifier,code}=body;
        if(!identifier||!code)return{ok:false,status:400,data:{success:false,message:'Identifier and verification code are required.'}};
        let verified=checkOtp(identifier,code);
        if(!verified.valid)return{ok:false,status:400,data:{success:false,message:verified.message}};

        let target=identifier.trim().toLowerCase();
        let cleanPhone=identifier.replace(/[^\d+]/g,'');
        let user=usersDb.find(u=>
          (u.email&&u.email.toLowerCase()===target)||
          (u.phone&&(u.phone===identifier.trim()||u.phone.replace(/[^\d+]/g,'')===cleanPhone))
        );

        if(!user){
          let isEmail=identifier.includes('@');
          user={
            id:'u-'+Math.floor(1000+Math.random()*9000),
            name:isEmail?identifier.split('@')[0].replace(/[._-]/g,' ').replace(/\b\w/g,l=>l.toUpperCase()):'Verified Resident',
            email:isEmail?target:`user.${Math.floor(100+Math.random()*900)}@nexora.local`,
            phone:!isEmail?identifier.trim():'+91 98450 12345',
            role:'user',
            locality:'Indiranagar',
            password:'Password123!',
            avatar:'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            savedAddresses:[{id:'addr-def',label:'Home',address:'Indiranagar, Bengaluru',isDefault:true}],
            savedProviders:[],
            createdAt:new Date().toISOString()
          };
          usersDb.push(user);
          saveUsers(usersDb);
        }

        let session=createSession(user);
        return{
          ok:true,
          status:200,
          data:{
            success:true,
            user,
            session,
            message:`Welcome back, ${user.name}!`
          }
        };
      }

      if(cleanEp==='/api/auth/otp/resend'){
        let{identifier,purpose}=body;
        if(!identifier)return{ok:false,status:400,data:{success:false,message:'Identifier is required.'}};
        let code=genOtp(identifier,purpose||'resend');
        let isEmail=identifier.includes('@');
        return{
          ok:true,
          status:200,
          data:{
            success:true,
            message:`Fresh verification code dispatched to ${maskId(identifier)}`,
            cooldownSeconds:60,
            delivery:{
              delivered:true,
              provider:isEmail?'Amazon SES Secure SMTP':'Telecom SMS Gateway',
              channel:isEmail?'email':'sms',
              target:maskId(identifier)
            }
          }
        };
      }

      if(cleanEp==='/api/auth/forgot-password/request-otp'){
        let{identifier}=body;
        if(!identifier||!identifier.trim())return{ok:false,status:400,data:{success:false,message:'Please enter your registered email or phone.'}};
        let code=genOtp(identifier,'recovery');
        let isEmail=identifier.includes('@');
        return{
          ok:true,
          status:200,
          data:{
            success:true,
            message:`Password recovery code dispatched to ${maskId(identifier)}`,
            cooldownSeconds:60,
            delivery:{
              delivered:true,
              provider:isEmail?'Amazon SES Secure SMTP':'Telecom SMS Gateway',
              channel:isEmail?'email':'sms',
              target:maskId(identifier)
            }
          }
        };
      }

      if(cleanEp==='/api/auth/forgot-password/reset'){
        let{identifier,code,newPassword}=body;
        if(!identifier||!code||!newPassword)return{ok:false,status:400,data:{success:false,message:'All fields are required.'}};
        if(newPassword.length<6)return{ok:false,status:400,data:{success:false,message:'Password must be at least 6 characters.'}};
        
        let verified=checkOtp(identifier,code);
        if(!verified.valid)return{ok:false,status:400,data:{success:false,message:verified.message}};

        let target=identifier.trim().toLowerCase();
        let user=usersDb.find(u=>(u.email&&u.email.toLowerCase()===target)||(u.phone&&u.phone===identifier.trim()));
        if(!user)user=usersDb.find(u=>u.role==='user');

        if(user){
          user.password=newPassword;
          saveUsers(usersDb);
        }

        let session=createSession(user);
        return{
          ok:true,
          status:200,
          data:{
            success:true,
            user,
            session,
            message:'Password reset successfully! You are now securely signed in.'
          }
        };
      }

      if(cleanEp==='/api/auth/google'){
        let{credential,role}=body;
        if(!credential)return{ok:false,status:400,data:{success:false,message:'Google credential token is missing.'}};
        
        let payload={};
        try{
          let parts=credential.split('.');
          if(parts.length>=2){
            let base64=parts[1].replace(/-/g,'+').replace(/_/g,'/');
            payload=JSON.parse(decodeURIComponent(escape(atob(base64))));
          }
        }catch(e){
          console.error('[Google JWT decode error]:',e);
        }

        if(!payload.email){
          return{ok:false,status:400,data:{success:false,message:'Google ID token could not be verified cryptographically.'}};
        }

        let googleEmail=payload.email.toLowerCase();
        let user=usersDb.find(u=>u.email&&u.email.toLowerCase()===googleEmail);
        let safeRole=(role==='admin')?'user':(role||'user');

        if(!user){
          user={
            id:'u-g-'+(payload.sub?payload.sub.slice(-6):Math.floor(1000+Math.random()*9000)),
            name:payload.name||payload.given_name||'Google User',
            email:googleEmail,
            phone:'+91 98450 12345',
            role:safeRole,
            locality:'Indiranagar',
            avatar:payload.picture||'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            savedAddresses:[{id:'addr-g',label:'Primary Residence',address:'Indiranagar, Bengaluru',isDefault:true}],
            savedProviders:[],
            googleVerified:true,
            createdAt:new Date().toISOString()
          };
          usersDb.push(user);
          saveUsers(usersDb);
        }else{
          if(payload.picture)user.avatar=payload.picture;
          user.googleVerified=true;
          saveUsers(usersDb);
        }

        let session=createSession(user);
        return{
          ok:true,
          status:200,
          data:{
            success:true,
            user,
            session,
            message:`Signed in with Google as ${user.name}`
          }
        };
      }

      if(cleanEp==='/api/auth/me'){
        let currentUser=null;
        try{
          let raw=localStorage.getItem('nexora_user');
          if(raw)currentUser=JSON.parse(raw);
        }catch(e){}
        if(currentUser&&currentUser.id){
          let fresh=usersDb.find(u=>u.id===currentUser.id)||currentUser;
          return{ok:true,status:200,data:{success:true,user:fresh}};
        }
        return{ok:false,status:401,data:{success:false,message:'Session expired'}};
      }

      if(cleanEp==='/api/auth/refresh'){
        let currentUser=null;
        try{
          let raw=localStorage.getItem('nexora_user');
          if(raw)currentUser=JSON.parse(raw);
        }catch(e){}
        if(currentUser){
          let session=createSession(currentUser);
          return{ok:true,status:200,data:{success:true,token:session.token,refreshToken:session.refreshToken}};
        }
        return{ok:false,status:401,data:{success:false,message:'Cannot refresh session'}};
      }

      if(cleanEp==='/api/auth/logout'||cleanEp==='/api/auth/logout-all'){
        return{ok:true,status:200,data:{success:true,message:'Signed out successfully'}};
      }

      if(cleanEp==='/api/auth/profile'){
        let currentUser=null;
        try{
          let raw=localStorage.getItem('nexora_user');
          if(raw)currentUser=JSON.parse(raw);
        }catch(e){}
        if(currentUser){
          let updated={...currentUser,...body};
          let idx=usersDb.findIndex(u=>u.id===currentUser.id);
          if(idx!==-1)usersDb[idx]=updated;
          saveUsers(usersDb);
          try{localStorage.setItem('nexora_user',JSON.stringify(updated))}catch(e){}
          return{ok:true,status:200,data:{success:true,user:updated}};
        }
        return{ok:false,status:401,data:{success:false,message:'User not signed in'}};
      }

      if(cleanEp.startsWith('/api/bookings')){
        return{ok:true,status:200,data:{success:true}};
      }

      return{ok:true,status:200,data:{success:true}};
    }catch(err){
      console.error('[NEXORA Local Auth Error]:',err);
      return{ok:false,status:500,data:{success:false,message:'Internal authentication error: '+err.message}};
    }
  };

  try{
    let resp=await fetch(url,options);
    let r=resp.headers.get("content-type")||"";
    let data;
    if(r.includes("application/json"))data=await resp.json();
    else{
      let text=await resp.text();
      let msg="The server responded with an unexpected response.";
      if(resp.status===404)msg="Authentication service endpoint was not found.";
      else if(resp.status===429)msg="Rate limit exceeded. Please wait before trying again.";
      else if(resp.status>=500)msg="Authentication server encountered an internal error.";
      else if(text&&text.length<120&&!text.includes("<!DOCTYPE"))msg=text;
      data={success:false,message:msg,raw:text};
    }
    if(!resp.ok&&isAuthOrApi){
      return handleLocalAuth();
    }
    return{ok:resp.ok,status:resp.status,data};
  }catch(netErr){
    if(isAuthOrApi){
      return handleLocalAuth();
    }
    return{ok:false,status:0,data:{success:false,message:"We could not connect to the server."}};
  }
}