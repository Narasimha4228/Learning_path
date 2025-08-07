# Learning Path

A full-stack learning management platform for students and instructors.

## Features
- User authentication (register/login)
- Role-based dashboards (student, instructor, admin)
- Course listing and progress tracking
- Profile management
- Chatbot assistant (Gemini/Deepseek AI)
- MongoDB Atlas integration
- Responsive frontend (HTML/CSS/JS)

## Project Structure
```
Backend/
  app.js
  server.js
  config/
    db.js
  models/
  routes/
Frontend/
  index.html
  home.html
  login.html
  register.html
  profile.html
  ...
```

## Getting Started

### Prerequisites
- Node.js & npm
- Python 3 (for AI/accuracy scripts)
- MongoDB Atlas account
- (Optional) Google API key or Deepseek API key for chatbot

### Backend Setup
1. Install dependencies:
   ```bash
   cd Backend
   npm install
   ```
2. Configure `.env` with your MongoDB URI and JWT secret.
3. Start the backend:
   ```bash
   npm start
   ```

### Frontend Setup
1. Open `Frontend/index.html` or run with Live Server/VS Code extension.
2. For chatbot, install Python dependencies:
   ```bash
   pip install streamlit google-generativeai python-dotenv requests
   ```
3. Run chatbot:
   ```bash
   streamlit run chatbot.py
   ```

## Git & Deployment
- Main branch: `main`
- Remote: https://github.com/Narasimha4228/Learning_path.git
- To push changes:
  ```bash
  git add .
  git commit -m "Your message"
  git push origin main
  ```

## License
MIT
