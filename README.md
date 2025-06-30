
# 🧠 MERN Whiteboard App

A real-time collaborative whiteboard tool built using the MERN stack and WebSockets. Draw, undo, redo, clear, and sync drawings across multiple users instantly — perfect for collaborative sketching, brainstorming, and online teaching.

---

## 🚀 Features

- 🖌️ Live real-time drawing with multiple users
- 🔄 Undo / Redo support
- 🧽 Clear canvas for everyone
- 🎨 Custom stroke color and width
- 📥 Download canvas as an image
- 🔗 Socket.IO-based real-time sync

---

## 🛠 Tech Stack

**Frontend**  
- React  
- Tailwind CSS  
- Vite  
- Socket.IO Client

**Backend**  
- Node.js  
- Express.js  
- Socket.IO Server  
- CORS

---

## 🧩 Folder Structure

```
mern-whiteboard-app/
├── client/           # React frontend (whiteboard UI)
│   └── src/
│   └── vite.config.js
│   └── package.json
├── server/           # Node.js + Express backend
│   └── index.js
│   └── package.json
├── README.md
└── .gitignore
```

---

## 💻 How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/MaulikGupta27/mern-whiteboard-app.git
cd mern-whiteboard-app
```

---

### 2. Setup the backend

```bash
cd server
npm install
node index.js
```

Server will run on: `http://localhost:3000`

---

### 3. Setup the frontend

```bash
cd client
npm install
npm run dev
```

Frontend will run on: `http://localhost:5173`

---


## 📸 Screenshots
![image](https://github.com/user-attachments/assets/f22cd9fc-5dba-4766-8a60-f7d3f0845560)
