# Smart Reply App (Flutter)

A Flutter-based Android application for the Smart Reply project, mirroring the functionality of the React web frontend.

## 📱 Features

- **Smart Reply**: Generate AI-suggested replies for messages.
- **Smart Enhance**: Enhance and improve your own text (grammar, tone, clarity).
- **Dark Mode UI**: Beautiful glassmorphic design matching the web application.
- **Custom Styles**: Professional, Friendly, Humorous, and Concise tones.

## 🛠 Setup & Running

### Prerequisites

- Flutter SDK
- Android Studio / Android SDK
- Backend Server running

### 1. Start the Backend

Ensure your backend server is running. If you are running it locally on port 5006:

```bash
cd backend
npm start
```

### 2. Configure API Endpoint

For Android Emulators, `localhost` refers to the emulator itself. To access your computer's localhost, use `10.0.2.2`.

The app is pre-configured to use `http://10.0.2.2:5006/api`.

If you are running on a physical device, you must change the `baseUrl` in `lib/utils/constants.dart` to your computer's local IP address (e.g., `http://192.168.1.X:5006/api`).

### 3. Run the App

```bash
cd smart_reply_app
flutter pub get
flutter run
```

## 🧩 Project Structure

- `lib/main.dart`: Entry point using Provider for state management.
- `lib/screens`: UI screens (HomeScreen).
- `lib/widgets`: Reusable UI components (InputSection, ResultsSection, etc.).
- `lib/providers`: State management logic (ChatProvider).
- `lib/services`: API communication (ApiService).
- `lib/utils`: Constants and Theme configuration.

## 🎨 Design

The app uses a custom `AppTheme` with `GoogleFonts` and linear gradients to replicate the premium feel of the web version.
