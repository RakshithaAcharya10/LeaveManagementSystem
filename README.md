# Leave Management System

## Live Application

- **Frontend:** https://leave-management-system-three-zeta.vercel.app/
- **Backend API:** https://leave-management-api-pu58.onrender.com/
- **GitHub Repository:** https://github.com/RakshithaAcharya10/LeaveManagementSystem

## Project Overview

The Leave Management System is a web-based application developed using the MERN stack. It allows employees to apply for leave, track their leave requests, and check their leave balances. Administrators can view employee leave requests and approve or reject them with remarks.

## Technologies Used

### Frontend
- React.js
- Material UI
- Axios
- React Router DOM
- HTML and CSS
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

### Deployment and Services
- GitHub – Source code management
- Vercel – Frontend hosting
- Render – Backend hosting
- MongoDB Atlas – Cloud database

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

## Application Architecture

The application follows a client-server architecture:

1. React frontend is hosted on Vercel.
2. Axios sends HTTP requests from the frontend to the Express backend.
3. Node.js and Express handle authentication and leave management operations.
4. Mongoose communicates with MongoDB Atlas.
5. JWT authentication protects authorized API operations.

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
│   ├── createAdmin.js
│   └── server.js
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js and npm
- MongoDB (local installation or MongoDB Atlas)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/RakshithaAcharya10/LeaveManagementSystem.git
cd LeaveManagementSystem
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Backend Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/LeaveManagementSystem
JWT_SECRET=your_private_secret_key
```

Use your own MongoDB connection string and a strong private JWT secret. Never commit `.env` files or share their contents.

### 4. Start the Backend

```bash
npm run dev
```

If the development script is not available, use:

```bash
node server.js
```

### 5. Install Frontend Dependencies

Open another terminal from the project root:

```bash
cd client
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

Open the application at:

http://localhost:5173/

## Database

- **Database:** LeaveManagementSystem
- **Database service:** MongoDB / MongoDB Atlas

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

## Deployment

The application is deployed using GitHub, Render, Vercel, and MongoDB Atlas.

### Hosting Platforms

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas
- **Source Code:** GitHub

### Deployment Approach

1. The project source code is maintained in GitHub.
2. The backend repository is connected to Render.
3. Render installs backend dependencies using `npm install` and starts the application using `node server.js`.
4. MongoDB Atlas stores application data in the cloud.
5. The React frontend is connected to the GitHub repository and deployed through Vercel.
6. The frontend uses the `VITE_API_URL` environment variable to communicate with the deployed backend.
7. The backend CORS configuration allows requests from the deployed frontend.

### Environment Variables

**Backend – Render**

| Variable | Description |
|---|---|
| `PORT` | Server port provided by Render |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Private JWT signing secret |
| `CLIENT_URL` | Deployed frontend URL, if configured |

**Frontend – Vercel**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Deployed backend URL |

### Updating the Deployment

1. Make the required changes to the source code.
2. Commit and push the changes to the GitHub `main` branch.
3. Render automatically deploys backend changes.
4. Vercel automatically builds and deploys frontend changes.
5. Verify the live application after deployment.

## Conclusion

The Leave Management System provides a simple solution for employee leave applications and administrative leave approvals. It includes authentication, role-based access, leave balance tracking, request management, and cloud deployment using the MERN stack.