# 💕 Dating Web Application – MERN Full Stack

[![Built with MERN Stack](https://img.shields.io/badge/MERN%20Stack-MongoDB%20Express%20React%20Node-61DAFB?style=flat-square&logo=react)](https://mern.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)

---

## 📖 Overview

A **modern, scalable dating web application** built with **MERN Stack (MongoDB, Express, React, Node.js) and TypeScript**. This full-stack application features real-time chat, user authentication, advanced filtering, and admin dashboard for content moderation.

---

## ✨ Key Features

### 🔐 **Authentication & Security**
- JWT-based authentication
- Role-based access control (User / Admin)
- Protected routes for both frontend and backend
- Secure password management

### 💬 **Real-Time Chat**
- Firebase-powered messaging
- Chat request management (Accept / Reject / Block / Unblock)
- Real-time message delivery
- User blocking functionality

### 👤 **User Features**
- Complete profile management
- Create and manage dating posts
- Like system and interactions
- Advanced filtering and search
- User discovery algorithm

### 🛠️ **Admin Dashboard**
- User management
- Post moderation
- Website configuration
- Analytics and reporting

### ⚙️ **Backend Infrastructure**
- 30+ RESTful APIs
- Service layer architecture
- Advanced Mongoose schemas
- Email notifications (Nodemailer)
- Image storage (Cloudinary)

### 🎨 **Frontend**
- React with TypeScript
- Redux Toolkit state management
- RTK Query for server state
- Tailwind CSS responsive design
- Mobile-first UI

---

## 🛠️ Tech Stack

**Frontend:**
- React, TypeScript, Redux Toolkit, RTK Query, Tailwind CSS, React Router DOM

**Backend:**
- Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt

**Services:**
- Firebase (real-time chat)
- Cloudinary (image storage)
- Nodemailer (email notifications)

---

## 📁 Project Structure

### Backend
```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth & error middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   ├── types/           # TypeScript types
│   ├── utils/           # Helper functions
│   └── server.ts
├── .env
├── package.json
└── tsconfig.json
```

### Frontend
```
frontend/
├── src/
│   ├── assets/          # Images, icons
│   ├── components/      # Reusable components
│   ├── context/         # React context
│   ├── firebase/        # Firebase config
│   ├── hooks/           # Custom hooks
│   ├── pages/           # Page components
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── public/
│   │   └── user/
│   ├── redux/           # Redux store & slices
│   │   ├── adminAuth
│   │   ├── chatRequests
│   │   ├── image
│   │   ├── post
│   │   ├── postLike
│   │   ├── userAuth
│   │   ├── store.ts
│   │   └── router
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   ├── utils/           # Utilities
│   ├── App.tsx
│   └── main.tsx
├── .env.local
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- Firebase account
- Cloudinary account

### Installation

#### Backend
```bash
cd backend
npm install
cp .env.example .env  # Add your environment variables
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local  # Add your environment variables
npm run dev
```

---

## ⚙️ Environment Variables

### Backend `.env`
```
PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_API_KEY=xxx
FIREBASE_CONFIG=xxx
EMAIL_USER=xxx
EMAIL_PASS=xxx
```

### Frontend `.env.local`
```
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=xxx
...
```

---

## 📊 API Overview

**Authentication**
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/logout`

**Users**
- GET `/api/users` (admin)
- GET `/api/users/:id`
- PUT `/api/users/:id`

**Posts**
- GET `/api/posts`
- POST `/api/posts`
- PUT `/api/posts/:id`
- DELETE `/api/posts/:id`

**Chat**
- GET `/api/chat/requests`
- POST `/api/chat/requests`
- POST `/api/chat/block`
- POST `/api/chat/messages`

**Admin**
- GET `/api/admin/users`
- GET `/api/admin/posts`

---

## 🎯 Features Breakdown

| Feature | Status |
|---------|--------|
| User Authentication | ✅ |
| Real-Time Chat | ✅ |
| Post Management | ✅ |
| Like System | ✅ |
| Admin Dashboard | ✅ |
| User Filtering | ✅ |
| Image Upload | ✅ |
| Email Notifications | ✅ |
| Role-Based Access | ✅ |
| Mobile Responsive | ✅ |

---

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS enabled
- Input validation
- Role-based middleware
- Protected API endpoints

---

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS breakpoints
- Touch-friendly UI
- Optimized performance

---



## 👨‍💻 Getting Help

- Check documentation
- Review API endpoints in Postman
- Check Firebase console for real-time issues
- Review MongoDB Atlas for database issues

---

## 📝 License

MIT License - feel free to use this project.

---

**Made with ❤️ | Ready for Production**
