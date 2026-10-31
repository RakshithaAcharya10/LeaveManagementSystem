# Leave Management System

## Project Overview

The Leave Management System is a web-based application developed using the MERN stack. It allows employees to apply for leave and track their leave requests. Administrators can view leave requests and approve or reject them.

## Technologies Used

### Frontend
- React.js
- Material UI
- Axios
- React Router DOM
- HTML and CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Features

### Employee
- Employee registration and login
- Apply for leave
- View leave history
- Check leave balances
- View leave request status

### Admin
- Admin login
- View all employee leave requests
- Approve or reject leave requests
- Add remarks to leave requests
- View leave request summaries

### Security
- JWT-based authentication
- Password hashing
- Role-based access control
- Protected frontend routes
- Protected backend API routes

## Project Structure

```text
LeaveManagementSystem/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
└── README.md
```

## Installation and Setup

### 1. Install Backend Dependencies

Open a terminal:

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Create a `.env` file inside the server folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/LeaveManagementSystem
JWT_SECRET=your_secret_key
```

### 3. Start the Backend

```bash
npm run dev
```

### 4. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

### 5. Start the Frontend

```bash
npm run dev
```

Open the application at:

http://localhost:5173/

## Database

Database name: `LeaveManagementSystem`

Collections:
- users
- leaves

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register employee |
| POST | `/api/auth/login` | Login |
| POST | `/api/leaves` | Apply for leave |
| GET | `/api/leaves/my-leaves` | View employee leave history |
| GET | `/api/leaves` | View all leave requests (Admin) |
| PATCH | `/api/leaves/:id/status` | Approve or reject leave (Admin) |

## Conclusion

This project provides a simple leave management solution with employee and administrator functionalities, authentication, leave tracking, and leave approval workflows.