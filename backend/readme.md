# Smart Reply Backend

A lightweight Node.js/Express server that provides an API for generating AI-powered reply suggestions, integrated with OpenRouter. Designed for use with a Chrome extension like "Smart Reply Assistant".

## Features
- Generates 4 reply suggestions based on input message and style (e.g., "professional").
- Rate limiting: 30 requests per 15 minutes per IP.
- CORS enabled for cross-origin requests.
- Health check endpoint.

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/mahmud-r-farhan/smart-reply
   cd smart-reply
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and add your OpenRouter API key:
   ```
   OPENROUTER_API_KEY=your_api_key_here
   ```

## Running the Server
Start the server:
```
node src/index.js
```
The server runs on `http://localhost:5006` (or your specified `PORT`).

## API Endpoints
- **GET /health**: Returns `{ status: "ok" }` for health checks.
- **POST /api/suggest-reply**: Generates reply suggestions.
  - Request body: `{ "message": "Your input message", "style": "professional" }` (style is optional, defaults to "professional").
  - Response: `{ "suggestions": ["reply1", "reply2", "reply3", "reply4"] }`.

---