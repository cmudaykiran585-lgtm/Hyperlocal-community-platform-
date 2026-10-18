# NEXORA — Hyperlocal Services & Smart Person-Booking Marketplace

[![Production Status](https://img.shields.io/badge/Production-Live-00C2B8.svg?style=flat-square)](https://nexora-live.surge.sh/)
[![Tech Stack](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-2563EB.svg?style=flat-square)](https://vitejs.dev/)
[![Design System](https://img.shields.io/badge/Design%20System-NEXORA%20Tokens-101B33.svg?style=flat-square)](https://nexora-live.surge.sh/)

> **Live Deployment:** [https://nexora-live.surge.sh/](https://nexora-live.surge.sh/)

---

## 🌟 Overview

**NEXORA** is a next-generation hyperlocal community platform and real-world person-booking marketplace. It connects residents with verified neighborhood specialists, skilled trade professionals, and real people available for tasks like ticket queue standing, elderly accompaniment, document filing, and localized guidance.

---

## 🚀 Key Features

### 1. Smart Person Booking Engine
- Book dependable local individuals for physical real-world errands and tasks.
- Specialized scenarios including:
  - **Queue & Waiting**: Stand in government, hospital, and ticket token lines.
  - **Hospital & Clinic Companion**: Accompany seniors and patients to healthcare appointments.
  - **Administrative Assistance**: Physical submission of documents at RTO, municipal, and bank offices.
  - **Neighborhood Mentors**: Hands-on local guidance and personalized errands.

### 2. AI Hyperlocal Assistant
- Voice and text-driven conversational intelligence assistant.
- Translates natural language prompts (e.g., *"I need an electrician in Indiranagar within 2 hours"*) into filtered specialist recommendations and direct booking triggers.

### 3. Hyperlocal Directory & Discovery
- Neighborhood-level filtering across Indiranagar, Koramangala, Whitefield, HSR Layout, Jayanagar, and more.
- Verified service specialist profiles featuring certifications, hourly pricing, customer ratings, and response times.

### 4. Community Hub & Civic Reporting
- Neighborhood forums for civic discussions, localized announcements, and community alerts.
- Transparent reporting channels with real-time status updates.

### 5. Multi-Channel Authentication Engine
- **Google OAuth Integration**: Google One-Tap and Identity Services SDK client.
- **Email & Mobile SMS OTP**: Secure one-time password verification flow with 10-minute expiry and resend limits.
- **Account Profiles**: Role-based access for Customers and Verified Service Specialists.
- **Session Security**: Persistent sessions and role-switching.

### 6. Comprehensive Help & Support Center
- Searchable troubleshooting database for login, signup, OTP delivery, booking modifications, and cancellations.
- Functional support ticket submission channel with instant ticket tracking IDs (`NX-XXXXXX`).

---

## 🎨 Design System & Color Palette

The interface is built upon a balanced 9-token palette designed for trust, clarity, and accessibility:

| Token Name | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Deep Navy** | `#101B33` | Top information strip, primary brand identity, modal headers |
| **Rich Midnight Blue** | `#172541` | Smart Person Booking highlighted pill, secondary dark surfaces |
| **Teal Accent** | `#00C2B8` | Active navigation states, meaningful highlights, AI Assistant icon |
| **Bright Blue** | `#2563EB` | Primary action buttons (*Join NEXORA*, ticket submissions) |
| **Soft White** | `#F7F9FC` | Search bar background, location pill, card backgrounds |
| **White Surfaces** | `#FFFFFF` | Main navigation bar surface, dropdown menus, modals |
| **Main Text** | `#182338` | High-contrast headings and readable labels |
| **Secondary Text** | `#66748B` | Quiet navigation links, placeholders, helper text |
| **Borders** | `#E2E8F0` | Navigation lower border, input borders, structural dividers |

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Routing**: React Router 7 (Single Page Application architecture)
- **Icons**: Lucide React
- **Hosting**: Surge CDN (`nexora-live.surge.sh`)

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/cmudaykiran585-lgtm/Hyperlocal-community-platform.git
   cd Hyperlocal-community-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📄 License

This project is licensed under the MIT License.
