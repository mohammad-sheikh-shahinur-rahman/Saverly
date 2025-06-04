# 💰 Saverly – Your Smart Financial Companion

> Personal finance just got smarter with AI, Firebase & Next.js

🌐 **Live Site**: [https://saverly-lake.vercel.app](https://saverly-lake.vercel.app)
🧑‍💻 **Author**: মোহাম্মদ শেখ শাহিনুর রহমান
🛠 **License**: See bottom of README
📌 **Last Update**: June 2025

---

## ✨ Overview

**Saverly** is a modern PWA-enabled finance tracking app powered by **Next.js**, **Firebase**, and **AI integration via Genkit**. It helps users manage expenses, income, and get AI-driven financial advice — all in a beautiful, fast and mobile-first web app.

> "Think of it as your pocket financial assistant – always available, always learning."

---

## 🚀 Features

* ✅ Firebase Authentication (Phone OTP, Google Sign-In)
* ✅ Expense, Income & Saving Tracker
* ✅ Realtime Database with Firestore
* ✅ AI Financial Advisor with Genkit
* ✅ Responsive, Mobile-first UI (Tailwind CSS)
* ✅ Deployed on Vercel with SSR & SSG
* ✅ Full PWA support – installable app
* ✅ Uses OpenTelemetry for logging/tracing
* ✅ Clean Folder Structure + Modular Codebase

---

## 🧰 Tech Stack

| Purpose            | Stack                     |
| ------------------ | ------------------------- |
| Frontend Framework | Next.js 15 + React 18     |
| Language           | TypeScript                |
| Backend            | Firebase Auth + Firestore |
| AI Integration     | Genkit                    |
| Deployment         | Vercel                    |
| Tracing            | OpenTelemetry             |
| Styling            | Tailwind CSS, Heroicons   |
| PWA                | `next-pwa` Plugin         |

---

## ⚙️ Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/saverly.git
cd saverly
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Firebase

Create a project in Firebase Console, enable:

* Firebase Authentication (Phone, Google)
* Firestore Database

### 4. Add Environment Variables

Create a `.env.local` file in root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Run the Dev Server

```bash
npm run dev
```

Navigate to: `http://localhost:3000`

---

## 🛠️ Scripts

```bash
npm run dev         # Start local development
npm run build       # Build for production
npm run start       # Start production server
```

---

## 🌐 Deployment on Vercel

This project is optimized for Vercel. Just connect your GitHub repo and hit deploy.

* No custom `vercel.json` required.
* Supports SSR, SSG and API routes out of the box.

---

## 🧠 AI Feature – Financial Advisor

**Located in:**
`src/ai/flows/financial-advisor-flow.ts`

### 🔮 How it works

* Uses Genkit flow to receive financial questions
* Logs interactions via OpenTelemetry
* Returns personalized advice using AI prompt engineering

---

## ⚠️ Common Issues

### ❌ `useSearchParams()` error

You'll get the following error if not handled properly:

```bash
Error: useSearchParams() can only be used in a Client Component.
```

### ✅ Fix: Wrap component in `<Suspense>`

```tsx
import { Suspense } from "react";

export default function SignInPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PhoneSignIn />
    </Suspense>
  );
}
```

---

## 🗂 Folder Structure

```
/src
├── ai
│   └── flows
│       └── financial-advisor-flow.ts
├── app
│   └── auth
│       └── phone-signin
│           └── page.tsx
├── components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── TransactionList.tsx
├── lib
│   ├── firebase.ts
│   └── utils.ts
├── styles
│   └── globals.css
└── pages
    └── index.tsx
```

---

## 📲 PWA Configuration

Uses `next-pwa`:

```js
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  reactStrictMode: true,
});
```

### ✔️ Works on Android, iOS Safari, and desktop browsers.

---

## ✅ To Do (Planned Features)

* [ ] Budget categories (Food, Rent, Transport)
* [ ] Notifications for bill reminders
* [ ] Dark Mode Toggle
* [ ] Export CSV/Excel
* [ ] Language Localization (BN, EN)

---

## 🧑‍🏫 Author

**মোহাম্মদ শেখ শাহিনুর রহমান**
CTO, IT AMADERSOMAJ INC
📧 Email: `itamadersomaj@gmail.com`
🌐 Website: [https://it.amadersomaj.com](https://it.amadersomaj.com)

---

## 📄 License & Notice

© মোহাম্মদ শেখ শাহিনুর রহমান
লেখক নিবন্ধন নম্বর: **6383805489940**
এই প্রজেক্ট বাংলাদেশ সরকারের সংস্কৃতি বিষয়ক মন্ত্রণালয়ের আওতাধীন আর্কাইভস ও গ্রন্থাগার অধিপ্তরে নিবন্ধিত।

🚩 এই কোড, ডিজাইন বা কনটেন্টের যেকোনো অংশ লেখকের লিখিত অনুমতি ব্যাতিতেরে ব্যবহার আইনত দণ্ডনীযো।

> **সৃজনশীলতাকে সম্মান করুন।**

---

## 💬 Contribute or Feedback?

Feel free to **fork**, **star ⭐**, or raise issues.
**Pull requests welcome!**

\#কাব্য | #Saverly | #Nextjs | #Firebase | #Fintech | #AI
