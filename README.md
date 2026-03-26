# 🚀 CollabFlow

A modern **Kanban-based project management web application** inspired by tools like Trello. CollabFlow helps teams organize projects, manage tasks, and visualize workflow efficiently.

> ⚠️ *Note: This is a work-in-progress version. More features like real-time updates and collaboration tools will be added soon.*

---

## 🛠️ Tech Stack

### Frontend
- React (TypeScript)
- Next.js (App Router)
- Tailwind CSS
- ShadCN UI
- Redux Toolkit (with redux-persist)

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)

---

## ✨ Features (Current)

- 🔐 User Authentication (Login / Signup)
- 📁 Project Management
  - Create and manage projects
  - Role-based access (Owner/Admin/Member)
- 📋 Kanban Board System
  - Boards inside projects
  - Columns (To Do, In Progress, Done, etc.)
  - Drag-and-drop task movement
- 🎯 Task Management
  - Create, update, delete tasks
  - Assign tasks to members
  - Add priority, labels, and deadlines
- 🎨 Clean & Responsive UI
  - Built with Tailwind CSS and ShadCN UI
  - Dashboard with project cards

---

## 🚧 Upcoming Features

- 💬 Task Comments & Discussions  
- ⚡ Real-time updates using Socket.IO  
- 📎 File/Image Attachments (Cloudinary)  
- 🔔 Notifications system  
- 🧑‍💼 Admin dashboard enhancements  
- 🌐 Deployment (Frontend + Backend)

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/collabflow.git
cd collabflow
```
### 2. Setup Backend
```bash
cd server
npm install
```
Create a .env file in the server folder:
```bash
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
Run backend server:
```bash
npm run dev
```
### 3. Setup Frontend
```bash
cd client
npm install
```

Run frontend:
```bash
npm run dev
```
### 🤝 Contribution

This project is currently under active development. Contributions, suggestions, and feedback are welcome.
