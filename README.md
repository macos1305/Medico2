# Medico2 - Healthcare Appointment & Consultation Platform

Medico2 is a full-stack, production-quality healthcare scheduling platform built with Node.js, Express, MongoDB, Mongoose, React, and Vite.

## Architecture & Tech Stack

- **Frontend**: React 18, Vite, React Router 6, Axios, custom CSS design system.
- **Backend**: Node.js, Express, REST APIs, JWT, bcryptjs, express-validator.
- **Database**: MongoDB with Mongoose ODM (Data modeling: `User` credentials + linked `Patient` and `Doctor` profile models).
- **Architecture**: Strict layered architecture (`Routes` → `Middleware` → `Controller` → `Service` → `Model` → `MongoDB`).

## Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally on port `27017`

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Run Development Servers
To run both backend API (`http://localhost:5001`) and frontend app (`http://localhost:5173`) concurrently:
```bash
npm run dev
```

Or run individually:
```bash
npm run server  # Backend on port 5001
npm run client  # Frontend on port 5173
```

## Seed Credentials for Testing

| Role | Email | Password | Gated Dashboard |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@medico.com` | `Admin@12345` | `/admin/dashboard` |
| **Doctor** | `doctor@test.com` | `Doctor123` | `/doctor/dashboard` |
| **Patient** | `jane@example.com` | `Password123` | `/patient/dashboard` |

*(Quick-fill buttons for these credentials are built right into the login page at `/login` for seamless testing).*

## API Response Format

```json
// Success
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}

// Error
{
  "success": false,
  "message": "Error description",
  "error": {}
}
```

## Project Structure

```
medico/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   └── common/
│       ├── context/
│       ├── pages/
│       │   ├── admin/
│       │   ├── auth/
│       │   ├── doctor/
│       │   ├── patient/
│       │   └── public/
│       ├── routes/
│       ├── services/
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   └── package.json
├── package.json
└── README.md
```

## Deployment Guide

### Backend Deployment (Render / Railway / Heroku / AWS)
1. Set the root directory or working directory to `server` (or run from root with `npm run start`).
2. Set Build Command: `npm install`
3. Set Start Command: `npm start`
4. Set Environment Variables:
   - `PORT`: `5001` (or let the host assign one automatically via `process.env.PORT`)
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster.mongodb.net/medico_db?retryWrites=true&w=majority`
   - `JWT_SECRET`: Secure random string
   - `JWT_EXPIRES_IN`: `7d`
   - `CLIENT_URL`: `https://your-frontend.vercel.app` (or comma-separated list of allowed origins)
   - `ADMIN_EMAIL`: `admin@medico.com`
   - `ADMIN_PASSWORD`: Strong admin password

### Frontend Deployment (Vercel / Netlify / Render Static)
1. Set the root directory or working directory to `client`.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. SPA routing redirects are preconfigured via `client/public/_redirects` and `client/vercel.json`.
5. Set Environment Variable:
   - `VITE_API_URL`: `https://your-backend-api.onrender.com/api`

