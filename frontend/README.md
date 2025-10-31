# Smart Reply Web

Smart Reply Web is a React-based web application that generates AI-powered reply suggestions for incoming messages. Users can input a message, select a response style (e.g., professional, friendly), and receive multiple tailored suggestions. It's designed for quick, context-aware responses and is also available as a Chrome extension.

Built with:
- React (with Hooks)
- Zustand for state management
- Framer Motion for animations
- Lucide React for icons
- Tailwind CSS for styling (implied from class names)

## Features
- **Message Input**: Auto-resizing textarea for pasting received messages.
- **Style Selection**: Choose from Professional, Friendly, Humorous, or Concise styles with tooltips.
- **AI Suggestions**: Generates 4 reply options via API (mocked in demo; replace with real endpoint).
- **Copy & Regenerate**: Easy copy to clipboard and regenerate buttons.
- **Loading & Error Handling**: Spinner during generation, error messages.
- **Dark Mode UI**: Gradient background with animated effects for modern look.
- **Accessibility**: Keyboard shortcuts (Ctrl/Cmd + Enter to generate), ARIA labels.

## Installation
1. Clone the repo: `git clone https://github.com/mahmud-r-farhan/smart-reply`
2. Install dependencies: `cd frontend/npm install`
3. Set up environment: Add `VITE_API_ENDPOINT` in `.env` for the backend API.
4. Run locally: `npm run dev`

## Usage
- Paste a message into the textarea.
- Select a style.
- Click "Generate Replies" or use shortcut.
- View suggestions, copy, or regenerate.

## Components
- **Header**: App title and description.
- **StyleSelector**: Buttons for style choices with info toggle.
- **InputSection**: Message input, submit/clear buttons.
- **SuggestionsSection**: Displays generated replies with copy functionality.
- **EmptyState**: Placeholder when no input.
- **Footer**: Credits and notes.
- **TextareaAutoResize**: Custom auto-resizing textarea.

## API Integration
The app fetches suggestions from `VITE_API_ENDPOINT` via POST with `{ message, style }`. Update `useChatStore` for production.

---