#  Smart Reply

> **AI-powered Smart Reply Assistant** — Instantly generate smart, context-aware replies for your workflow: messages, emails, chats, and more — directly from your browser!

![Smart Reply Logo](./extension/images/icon-16.png)![Smart Reply Logo](./extension/images/icon-48.png)

---

## 🚀 Overview

**Smart Reply** is a Chrome extension + backend service that uses LLMs (via [OpenRouter](https://openrouter.ai)) to suggest replies intelligently based on the context of your communication.

It helps boost productivity for anyone who writes repetitive messages — freelancers, support agents, or busy professionals.

---

## ✨ Features

- 💬 **Four AI Reply Suggestions per Message** – Get up to 4 context-aware replies instantly for any message.  
- 🎨 **Customizable Reply Style** – Specify a style like `"professional"`, `"friendly"`, or `"concise"` for your suggestions.  
- ⚙️ **LLM Agnostic** – Works with any OpenRouter-supported model (free or paid).  
- 🔐 **Custom API Keys** – Bring your own API key for privacy & flexibility.  
- 🌐 **Optional Cloud Backend** – Deploy the backend anywhere (Render, VPS, Fly.io, Railway, etc.).  
- 🐳 **Docker Support** – Run the backend instantly using Docker.  

---

## 🧩 Tech Stack

- **Frontend (Extension):** Chrome Manifest V3, JavaScript, HTML, CSS  
- **Backend:** Node.js + Express  
- **AI Integration:** OpenRouter API  

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/mahmud-r-farhan/smart-reply.git
cd smart-reply
````

---

### 2️⃣ Backend Setup

#### Option A — Local Setup

1. Create a `.env` file in the `/backend` directory:

   ```bash
   OPENROUTER_API_KEY=your_openrouter_api_key
   PORT=5006
   ```
2. Install dependencies and start the server:

   ```bash
   cd backend
   npm install
   npm start
   ```
3. The backend runs at:

   ```
   http://localhost:5006
   ```

#### Option B — Docker Setup

1. Build and run the Docker container:

   ```bash
   docker build -t smart-reply-backend ./backend
   docker run -d -p 5006:5006 --env OPENROUTER_API_KEY=your_openrouter_api_key smart-reply-backend
   ```
2. Verify the backend:

   ```
   http://localhost:5006
   ```

---

### 3️⃣ Install the Chrome Extension

1. Open Chrome and go to:

   ```
   chrome://extensions
   ```
2. Enable **Developer Mode** (top-right corner).
3. Click **Load unpacked** and select:

   ```
   smart-reply/extension
   ```
4. The extension will appear in your toolbar.

---

### 4️⃣ Connect Backend

1. Click on the extension icon → **Settings**.
2. Paste your API key with `/api/suggest-reply` (default: http://localhost:5006/api/suggest-reply).
3. Save and start enjoying **AI Smart Replies**!

---

## 📡 API Highlights (Backend)

* **POST /api/suggest-reply** – Generate multiple reply suggestions

  ```json
  {
    "message": "Can we reschedule the meeting?",
    "style": "professional"
  }
  ```

  Response:

  ```json
  {
    "suggestions": [
      "Absolutely, let’s find a new time that works for both of us.",
      "Sure, please let me know your availability.",
      "No problem, I can adjust my schedule accordingly.",
      "Of course, happy to reschedule. When would you like to meet?"
    ]
  }
  ```
* **GET /health** – Health check endpoint returning `{ "status": "ok" }`.

> For detailed API usage, rate limiting, and advanced backend setup, see [Smart Reply Backend README](./backend/README.md).

---

## ☁️ Deploy Backend on the Cloud

You can deploy using **Render**, **VPS**, **Fly.io**, or **Railway.app**.
Set `OPENROUTER_API_KEY` in environment variables, then share the endpoint with your Chrome extension.

---

## 🧭 Roadmap / To-Do

* [ ] Add user authentication for cloud backend
* [ ] Support GPT-4.1 and Claude 3.5/4.1 models
* [ ] Add context memory for thread-based replies
* [ ] Publish to Chrome Web Store

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch
3. Submit a pull request

Keep PRs clean with descriptive commits and tested changes.

---

## 💡 Credits

Built by [**Mahmud Rahman**](https://github.com/mahmud-r-farhan)
Powered by [OpenRouter](https://openrouter.ai)

> *“Automate your responses. Amplify your productivity.”*

---

### ⭐ If you find this project useful, give it a star on GitHub!
