### **Build and Run** (Example)

1. **Build the Docker image**

```bash
docker build -t smart-reply-backend .
```

2. **Run the container**

```bash
docker run -d -p 5006:3000 --name smart-reply \
  -e PORT=3000 \
  -e OPENROUTER_API_KEY=your_openrouter_api_key \
  smart-reply-backend
```

* This maps container port `3000` to host port `5006`.
* `OPENROUTER_API_KEY` is passed as an environment variable to the container.

3. **Verify**
   Open `http://localhost:5006/health` in your browser. You should see:

```json
{ "status": "ok" }
```

---

> Optional improvements:

* Use **`npm ci`** instead of `npm install` if you have `package-lock.json` for faster and more deterministic builds.
* Add **multi-stage builds** to reduce image size if you also need dev dependencies for build tools.

---
