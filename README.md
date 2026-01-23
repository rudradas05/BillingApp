# InvoiceMaster

This is a full-stack web application for managing billing, customers, and products. It features a React frontend and a Node.js (Express) backend.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)

## Features

- User authentication (login, signup)
- Customer management (add, update, view)
- Product/Item management (add, view)
- Bill generation
- View all bills

## Tech Stack

**Frontend:**

- React.js
- Tailwind CSS
- Axios

**Backend:**

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT) for authentication

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm
- MongoDB (local or a cloud-based instance like MongoDB Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/rudradas05/InvoiceMaster.git
    cd InvoiceMaster
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

4.  **Configure environment variables:**

    Create a `.env` file in the `backend` directory and add the following variables:

    ```env
    CORS_ALLOWED_ORIGINS=
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    SENDER_EMAIL=Resend no-reply mail
    RESEND_API_KEY=Resend api key
    ```

## Running the Application

1.  **Start the backend server:**
    ```bash
    cd backend
    npm start
    ```
    The server will run on `http://localhost:4000`.

2.  **Start the frontend development server:**
    Open a new terminal, navigate to the `frontend` directory, and run:
    ```bash
    cd frontend
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Project Structure

```
BillingApp/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── middlewares/      # Express middlewares
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── config/           # DB, nodemailer, etc.
│   ├── server.js         # Backend entry point
│   └── package.json
└── frontend/
    ├── src/
    │   ├── assets/       # Images, icons, etc.
    │   ├── components/   # Reusable React components
    │   ├── context/      # React context for state management
    │   ├── pages/        # Page components
    │   ├── App.jsx       # Main App component
    │   └── main.jsx      # Frontend entry point
    ├── public/
    └── package.json
```
