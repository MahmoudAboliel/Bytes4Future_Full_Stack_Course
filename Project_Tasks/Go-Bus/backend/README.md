# Pullman Booking System - Backend API

A robust, enterprise-grade RESTful API built with **Node.js**, **Express**, and **MongoDB (Mongoose)** for managing an advanced bus transportation and reservation network (Pullman Booking System). 

---

## 📋 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Architecture & Features](#-key-architecture--features)
3. [Tech Stack](#-tech-stack)
4. [Project Directory Structure](#-project-directory-structure)
5. [Data Models Schema](#-data-models-schema)
6. [API Endpoints Reference](#-api-endpoints-reference)
7. [Installation & Setup](#-installation--setup)
8. [Environment Variables](#-environment-variables)
9. [Scripts & Testing](#-scripts--testing)
10. [License](#-license)

---

## 🚀 Project Overview

The **Pullman Backend API** provides a comprehensive backend infrastructure for passenger transport companies, bus operators, and booking agents. It handles end-to-end operations including secure authentication, role-based access control, bus fleet modeling, automated trip scheduling (daily, weekly, monthly, and manual), and real-time seat reservation concurrency checks.

---

## 🌟 Key Architecture & Features

### 1. Authentication & Role-Based Access Control (RBAC)
- **JWT-Based Authentication**: Secure token generation and verification middleware.
- **Password Encryption**: Secure password hashing using `bcrypt`.
- **User Roles**:
  - `admin`: Full system control, fleet management, trip oversight, and user administration.
  - `secretary`: Operational management, booking tracking, and schedule updates.
  - `customer`: User account management, trip search, and seat booking/reservations.

### 2. Bus Model & Fleet Management
- **Categories**: First Class, Business Class, Economy Class.
- **Sizes**: Large, Medium.
- **Fleet Counting**: Tracks total bus counts (`totalBusesCount`) with negative-value prevention validators.
- **Layout & Capacity**: Detailed seating layout specifications and total passenger capacity.
- **Seeding Script**: Automated database seeding utility for initial bus models.

### 3. Automated Trip Scheduling
- **Route Management**: Source and destination tracking with pricing.
- **Flexible Scheduling Types**:
  - `manual`: One-off custom trips.
  - `daily`: Recurring daily trips.
  - `weekly`: Recurring weekly trips.
  - `monthly`: Recurring monthly trips.
- **Trip Statuses**: Scheduled, Active, Completed.

### 4. Secure Booking & Seat Reservations
- **Concurrency & Validation**: Prevents double-booking of seats with strict uniqueness and integer validation.
- **Booking Statuses**: Reserved, Confirmed, Cancelled.
- **Follow-ups & Notifications**: Tracks schedule changes and booking follow-up records.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcrypt`
- **Configuration**: `dotenv`

---

## 📂 Project Directory Structure

```text
pullman-backend-api/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection setup
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication logic
│   │   ├── booking.controller.js # Booking & reservation operations
│   │   ├── busModel.controller.js# Bus model management
│   │   ├── trip.controller.js    # Trip scheduling & management
│   │   └── user.controller.js    # User management
│   ├── middleware/
│   │   ├── authenticate.js       # JWT token verification
│   │   ├── authorize.js          # Role-based authorization
│   │   └── auth.middleware.js    # Additional auth helpers
│   ├── models/
│   │   ├── Booking.model.js        # Booking schema
│   │   ├── BookingFollowUp.model.js# Booking follow-up schema
│   │   ├── BusModel.model.js     # Bus model schema
│   │   ├── Notification.model.js # Notifications schema
│   │   ├── Trip.model.js         # Trip schema
│   │   ├── TripScheduleChange.model.js # Schedule change audit
│   │   └── User.model.js         # User schema
│   ├── routes/
│   │   ├── auth.routes.js        # Auth endpoints
│   │   ├── booking.routes.js     # Booking endpoints
│   │   ├── busModel.routes.js    # Bus model endpoints
│   │   ├── index.js              # Central router aggregator
│   │   ├── trip.routes.js        # Trip endpoints
│   │   └── user.routes.js        # User endpoints
│   ├── scripts/
│   │   └── seedBusModels.js      # Database seed script for bus models
│   ├── services/
│   │   ├── auth.service.js       # Auth business logic
│   │   ├── booking.service.js    # Booking business logic
│   │   ├── busModel.service.js   # Bus model business logic
│   │   ├── Notifications.service.js # Notification service
│   │   ├── trip.service.js       # Trip service
│   │   └── user.service.js       # User service
│   ├── tests/
│   │   ├── busModel.test.js      # Bus model unit/integration tests
│   │   └── trip.test.js          # Trip unit/integration tests
│   ├── utils/
│   │   └── token.util.js         # JWT generation & verification utility
│   ├── app.js                    # Express application configuration
│   └── server.js                 # HTTP server bootstrap
├── .env                          # Environment variables
├── .env.example                  # Environment variables template
├── package.json                  # Project dependencies & scripts
└── README.md                     # Project documentation (this file)
```

---

## 📊 Data Models Schema Summary

1. **User**: `name`, `phone`, `username`, `password`, `role` (`admin`, `secretary`, `customer`).
2. **BusModel**: `title`, `category` (`first_class`, `business_class`, `economy_class`), `size` (`large`, `medium`), `capacity`, `totalBusesCount`, `layoutDetails`.
3. **Trip**: `source`, `destination`, `busModelId` (Ref), `price`, `tripDate`, `tripTime`, `scheduleType` (`manual`, `daily`, `weekly`, `monthly`), `status` (`scheduled`, `active`, `completed`).
4. **Booking**: `tripId` (Ref), `customerId` (Ref), `seatNumbers` (Array of unique integers), `status` (`reserved`, `confirmed`, `cancelled`), `bookingDate`.
5. **Notification & Audit Models**: Tracks schedule changes (`TripScheduleChange`), follow-ups (`BookingFollowUp`), and system notifications (`Notification`).

---

## 🔌 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and receive JWT

### 👥 Users (`/api/users`)
- `GET /api/users` - Get all users (Admin/Secretary)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user details
- `DELETE /api/users/:id` - Delete user

### 🚌 Bus Models (`/api/bus-models`)
- `GET /api/bus-models` - List all bus models
- `POST /api/bus-models` - Create a new bus model (Admin)
- `GET /api/bus-models/:id` - Get bus model details
- `PUT /api/bus-models/:id` - Update bus model (Admin)
- `DELETE /api/bus-models/:id` - Delete bus model (Admin)

### 🗺️ Trips (`/api/trips`)
- `GET /api/trips` - Search and list trips
- `POST /api/trips` - Schedule a new trip (Admin/Secretary)
- `GET /api/trips/:id` - Get trip details
- `PUT /api/trips/:id` - Update trip schedule/status
- `DELETE /api/trips/:id` - Cancel or remove trip

### 🎟️ Bookings (`/api/bookings`)
- `GET /api/bookings` - List all bookings
- `POST /api/bookings` - Create a seat reservation / booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking status (`confirmed`, `cancelled`, etc.)
- `DELETE /api/bookings/:id` - Cancel booking

---

## ⚙️ Installation & Setup

### Prerequisites
- **Node.js** (v18+ recommended)
- **MongoDB** instance (Local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/ahmad26123/pullman-backend-api.git
cd pullman-backend-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory based on `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pullman_db
JWT_SECRET=your_super_secret_jwt_key
```

### 4. Seed Database (Optional)
Populate initial bus models:
```bash
npm run seed
```

To replace all database data except users and bus models with 20 demo trips
(five for each schedule type) and two bookings per trip, run:
```bash
npm run seed:demo
```
This operation is destructive and runs without a confirmation prompt. It
requires at least one existing customer and one bus model with capacity for
four or more seats.

### 5. Run the Server
- **Development mode** (with auto-reload):
  ```bash
  npm run dev
  ```
- **Production mode**:
  ```bash
  npm start
  ```

---

## 🧪 Scripts & Testing

- **Start Server**: `npm start`
- **Development Mode**: `npm run dev`
- **Seed Database**: `npm run seed`
- **Replace data with demo trips and bookings**: `npm run seed:demo`
- **Run Test Suite**: `npm test`

---

## 📝 License

This project is licensed under the **ISC License**.
