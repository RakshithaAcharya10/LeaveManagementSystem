# Leave Management System

A full-stack web application developed using the MERN stack to manage employee leave applications, leave balances, and administrative approvals.

## 1. Live Application

- **Frontend:** https://leave-management-system-three-zeta.vercel.app/
- **Backend API:** https://leave-management-api-pu58.onrender.com/
- **GitHub:** https://github.com/RakshithaAcharya10/LeaveManagementSystem

## 2. Project Overview

The Leave Management System allows employees to register, log in, apply for leave, check leave balances, and track request statuses. Administrators can view leave requests, approve or reject them, and provide remarks.

## 3. Features

**Employee**
- Registration and login.
- Apply for Casual, Sick, and Earned Leave.
- View leave balances and history.
- Track leave request status.

**Admin**
- Secure admin login.
- View all employee leave requests.
- Approve or reject leave applications.
- Add remarks and view request summaries.

**Security**
- JWT authentication.
- Password hashing using bcryptjs.
- Role-based access control.
- Protected frontend routes and backend APIs.

## 4. Technology Stack

| Frontend | Backend | Database |
|---|---|---|
| React.js | Node.js | MongoDB |
| Material UI | Express.js | MongoDB Atlas |
| Axios | Mongoose | |
| React Router DOM | JWT | |
| HTML, CSS, Vite | bcryptjs | |

**Deployment:** GitHub, Vercel, Render, MongoDB Atlas.

## 5. Application Architecture

The application follows a client-server architecture.

```text
Employee / Admin
       |
       v
React.js Frontend (Vercel)
       |
       | Axios API Requests
       v
Node.js + Express.js (Render)
       |
       | Mongoose
       v
MongoDB Atlas
```

## 6. Project Structure

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

## 7. Installation and Setup

**Prerequisites:** Node.js, npm, Git, and MongoDB or MongoDB Atlas.

**Step 1: Clone the repository**

```bash
git clone https://github.com/RakshithaAcharya10/LeaveManagementSystem.git
cd LeaveManagementSystem
```

**Step 2: Install backend dependencies**

```bash
cd server
npm install
```

**Step 3: Configure `server/.env`**

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/LeaveManagementSystem
JWT_SECRET=your_private_secret_key
```

Use your own MongoDB connection string and a secure JWT secret.

**Step 4: Start the backend**

```bash
npm run dev
```

If the development script is unavailable:

```bash
node server.js
```

**Step 5: Install frontend dependencies**

Open another terminal:

```bash
cd client
npm install
```

**Step 6: Configure `client/.env`**

```env
VITE_API_URL=http://localhost:5000
```

**Step 7: Start the frontend**

```bash
npm run dev
```

Open: http://localhost:5173/

## 8. Environment Variables

| Variable | Location | Description |
|---|---|---|
| `PORT` | Backend | Server port |
| `MONGO_URI` | Backend | MongoDB connection string |
| `JWT_SECRET` | Backend | JWT signing secret |
| `CLIENT_URL` | Backend | Frontend URL for CORS, if configured |
| `VITE_API_URL` | Frontend | Backend API base URL |

**Production frontend configuration:**

```env
VITE_API_URL=https://leave-management-api-pu58.onrender.com
```

Never commit `.env` files or expose passwords and secret keys.

## 9. Database

**Database:** `LeaveManagementSystem`  
**Service:** MongoDB Atlas

| Collection | Purpose |
|---|---|
| `users` | Employee and admin details, roles, and leave balances |
| `leaves` | Leave applications, dates, statuses, and admin remarks |

## 10. API Endpoints

**Base URL:** `https://leave-management-api-pu58.onrender.com/api`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Employee registration |
| POST | `/auth/login` | Employee/admin login |
| POST | `/leaves` | Apply for leave |
| GET | `/leaves/my-leaves` | View employee leave history |
| GET | `/leaves` | View all leave requests (Admin) |
| PATCH | `/leaves/:id/status` | Approve/reject leave (Admin) |

Protected endpoints require a JWT token:

```text
Authorization: Bearer <JWT_TOKEN>
```

## 11. Deployment

The application is hosted using:

- **Vercel:** React frontend.
- **Render:** Node.js and Express backend.
- **MongoDB Atlas:** Cloud database.
- **GitHub:** Source code repository.

**Deployment Steps**

1. Push the project code to GitHub.
2. Connect the repository to Render and configure the backend root directory as `server`.
3. Set the build command to `npm install` and start command to `node server.js`.
4. Configure backend environment variables in Render.
5. Connect the repository to Vercel and set the frontend root directory to `client`.
6. Configure `VITE_API_URL` with the Render backend URL.
7. Deploy the frontend and backend.
8. Configure backend CORS to allow the deployed frontend URL.

**Updating the Application**

1. Make and test code changes locally.
2. Commit and push changes to the GitHub `main` branch.
3. Render and Vercel automatically deploy the updated backend and frontend.
4. Verify the live application.

## 12. Conclusion

The Leave Management System simplifies employee leave management through registration, authentication, leave applications, balance tracking, and administrator approvals. It demonstrates full-stack development, REST API integration, database management, and cloud deployment using the MERN stack.