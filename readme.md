# 🤖 Smart Reply

> **AI-powered Smart Reply Assistant** — Instantly generate smart, context-aware replies for your workflow: messages, emails, chats, and more — directly from your browser!

![Smart Reply Logo](./extension/images/icon-16.png)![Smart Reply Logo](./extension/images/icon-48.png)

---

## 🚀 Overview

**Smart Reply** is a Chrome extension + backend service that uses LLMs (via [OpenRouter](https://openrouter.ai)) to suggest replies intelligently based on the context of your communication.

It helps boost productivity for anyone who writes repetitive messages — freelancers, support agents, or busy professionals.

---

## ✨ Features

- 💬 **Multiple AI Reply Suggestions** – Smart, context-aware message completion.
- ⚙️ **LLM Agnostic** – Works with any OpenRouter-supported model (free or paid).
- 🔐 **Custom API Keys** – Bring your own API key for privacy & flexibility.
- 🌐 **Optional Cloud Backend** – Deploy the backend anywhere (Render, VPS, etc.).
- 🐳 **Docker Support** – Deploy your backend instantly with Docker.

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
2. Install dependencies and run:

   ```bash
   cd backend
   npm install
   npm start
   ```
3. The backend runs at:

   ```
   http://localhost:5006
   ```

---

#### Option B — Run with Docker

1. Build and run using the included Dockerfile:

   ```bash
   docker build -t smart-reply-backend ./backend
   docker run -d -p 5006:5006 --env OPENROUTER_API_KEY=your_openrouter_api_key smart-reply-backend
   ```
2. Verify it’s running:

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
3. Click **Load unpacked**.
4. Select the folder:

   ```
   smart-reply/extension
   ```
5. The extension will appear in your toolbar.

---

### 4️⃣ Connect Backend

1. Click on the extension icon → **Settings**.
2. Paste your API key with `/api/suggest-reply` (default: http://localhost:5006/api/suggest-reply).
3. Save and start enjoying **AI Smart Replies**!

---

## ☁️ Deploy Backend on the Cloud

You can easily deploy the backend using:

* **Render**, **VPS**, **Fly.io**, or **Railway.app**
* Set `OPENROUTER_API_KEY` in environment variables

Then, share your API endpoint with your Chrome extension.

---

## 🧭 Unfulfilled plan

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

Please keep PRs clean, with descriptive commits and tested changes.

---


## 💡 Credits

Built by [**Mahmud Rahman**](https://github.com/mahmud-r-farhan),
Thanks to [OpenRouter](https://openrouter.ai)

> *“Automate your responses. Amplify your productivity.”*

---

### ⭐ If you find this project useful, give it a star on GitHub!