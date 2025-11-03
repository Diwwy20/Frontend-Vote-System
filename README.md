# 🧠 Quote Hub Web App

**Quote Hub** is a fun and interactive web application that allows users to create, share, and vote on various types of quotes—whether funny, inspirational, or thought-provoking. In addition to exploring quotes from other users, each user can access their **personal dashboard** to see:

- 📌 The total number of quotes they've submitted  
- 👍 How many total votes their quotes have received  
- 🏆 Their current ranking compared to other users  

---

## 🚀 Features

- ✍️ Create and submit your own quotes  
- 🌐 Browse quotes from all users or filter by most voted  
- ❤️ Vote for your favorite quotes  
- 📊 View your personalized dashboard with quote stats and rankings  
- 👤 Register and log in to manage your quotes  

---

## 🛠 Tech Stack

- **Frontend**: React + Vite + TypeScript  
- **UI**: TailwindCSS + shadcn/ui  
- **Forms**: react-hook-form   
- **Backend**: NestJS   
- **Database**: PostgreSQL (hosted on Neon)

---

## 📦 How to Run the Project

Follow the steps below to run the frontend locally:

```bash
# 1. Clone the repository
git clone https://github.com/Diwwy20/Frontend-Vote-System

# 2. Install dependencies
npm install or npm install --legacy-peer-deps

# 3. Create a `.env` file in the root directory and add the following environment variables:
VITE_API_USER_ENDPOINT=https://backend-auth-system-production.up.railway.app/api
VITE_API_QUOTE_ENDPOINT=https://backend-quote-vote-system-production.up.railway.app/api

# 4. Start the development server (http://localhost:5173)
npm run dev
```

## 🌍 Live Demo

You can try Quote Hub instantly — no setup needed!
👉 https://vote-quote.netlify.app/

The app is fully deployed and ready to explore.
You can create an account, browse quotes, and view your personal dashboard right away.
