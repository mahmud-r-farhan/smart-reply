# Smart Reply & Enhance

> **AI-powered Smart Reply & Enhance Assistant:** Instantly generate smart, context-aware replies or enhance your own text for your workflow: messages, emails, chats, and more directly from your browser or web app!

![Smart Reply Logo](./extension/images/icon-16.png)![Smart Reply Logo](./extension/images/icon-48.png)

---

## 🚀 Overview

**Smart Reply & Enhance** is a comprehensive AI tool suite consisting of a Chrome extension, a React-based web application, and a shared backend service. It uses LLMs (via [OpenRouter](https://openrouter.ai)) to suggest replies intelligently based on the context of your communication or to improve and refine your own text.

It helps boost productivity for anyone who writes repetitive messages or needs quick text improvements as freelancers, support agents, or busy professionals. The Chrome extension provides on-the-go access directly in your browser, while the web app offers a full-featured interface for deeper interactions.

---

## ✨ Features

- 💬 **Four AI Reply Suggestions per Message** – Get up to 4 context-aware replies instantly for any message in Smart Reply mode (available in both extension and web).  
- ✍️ **Four AI Text Enhancements** – Improve your own text with 4 variations focusing on grammar, clarity, conciseness, structure, and effectiveness in Smart Enhance mode (like Grammarly; available in both extension and web).  
- 🎨 **Customizable Style** – Choose from Professional, Friendly, Humorous, or Concise styles with tooltips for descriptions.  
- 🔄 **Mode Switching** – Easily toggle between Smart Reply and Smart Enhance in the extension popup or web interface.  
- ⚙️ **LLM Agnostic** – Works with any OpenRouter-supported model (free or paid).  
- 🔐 **Custom API Keys** – Bring your own API key for privacy & flexibility.  
- 🐳 **Docker Support** – Run the backend instantly using Docker.  
- **Extension-Specific**: Insert suggestions directly into text fields (e.g., emails, chats); auto-detect selected text.  
- **Web-Specific**: Auto-resizing textarea, animated UI with Framer Motion, developer info panel, keyboard shortcuts (Ctrl/Cmd + Enter), and accessibility features.

---

## 🧩 Tech Stack

- **Frontend (Extension):** Chrome Manifest V3, JavaScript, HTML, CSS  
- **Frontend (Web):** React, Zustand for state management, Framer Motion for animations, Lucide React for icons, Tailwind CSS for styling  
- **Backend:** Node.js + Express  
- **AI Integration:** OpenRouter API  

---

## ⚙️ Setup Instructions

### 1 Clone the Repository
```bash
git clone https://github.com/mahmud-r-farhan/smart-reply.git
cd smart-reply
```

---

### 2 Backend Setup

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

### 3 Install the Chrome Extension

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

### 4 Set Up the Web Frontend

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```
2. Set up environment: Add `VITE_API_ENDPOINT` in `.env` for the backend API base URL (e.g., `VITE_API_ENDPOINT=http://localhost:5006/api`).
3. Run locally:

   ```bash
   npm run dev
   ```

---

### 5 Connect Backend

- **For Extension**: Click on the extension icon → **Settings**. Paste your backend base URL (e.g., `http://localhost:5006/api`). Save.
- **For Web**: The `.env` handles the connection automatically.

> Note: The tools automatically append `/suggest-reply` or `/enhance-text` based on the selected mode.

---

## 📡 API Highlights (Backend)

* **POST /api/suggest-reply** – Generate multiple reply suggestions (Smart Reply mode)

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

* **POST /api/enhance-text** – Generate multiple enhanced versions of text (Smart Enhance mode)

  ```json
  {
    "text": "We need to reschedul the meeting because of conflict.",
    "style": "professional"
  }
  ```

  Response:

  ```json
  {
    "enhancements": [
      "We need to reschedule the meeting due to a scheduling conflict.",
      "Due to a conflict, let's reschedule the meeting at your earliest convenience.",
      "I apologize, but a conflict has arisen—could we reschedule the meeting?",
      "There's a scheduling conflict; please suggest alternative times for the meeting."
    ]
  }
  ```

* **GET /health** – Health check endpoint returning `{ "status": "ok" }`.


---

## ☁️ Deploy Backend on the Cloud

You can deploy using **Render**, **VPS**, **Fly.io**, or **Railway.app**.
Set `OPENROUTER_API_KEY` in environment variables, then share the endpoint with your Chrome extension or web app.

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