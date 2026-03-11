Clinic Management System (MERN)

A role-based Clinic Management System built with the MERN stack.
The system allows administrators, doctors, and receptionists to manage clinic operations such as patients, doctors, appointment scheduling, and audit logging.

This project demonstrates secure authentication, role-based access control, slot-based appointment booking, and modern React state management using Zustand.

Features
Authentication

Secure login with JWT authentication

HTTP-only cookie based sessions

Role-based access control

Protected API routes

User Roles
Super Admin

Create and manage users

Add doctors and receptionists

View audit logs

Access system statistics

Receptionist

Register patients

Book appointments

View doctors

View available appointment slots

Doctor

View personal appointments

Access patient details for their appointments

Tech Stack
Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

Cookie-based sessions

Frontend

React

Zustand (state management)

TailwindCSS

Axios

React Hot Toast

Lucide React Icons

Project Structure
client/
 ├─ src/
 │  ├─ pages/
 │  ├─ components/
 │  ├─ store/
 │  ├─ routes/
 │  └─ lib/

server/
 ├─ src/
 │  ├─ controllers/
 │  ├─ models/
 │  ├─ routes/
 │  ├─ middlewares/
 │  ├─ services/
 │  └─ utils/
Core System Modules
User Management

Role-based user creation

Doctor profile creation with working hours

Password hashing using bcrypt

Patient Management

Create and manage patient records

Pagination support for large patient lists

Search functionality

Appointment System

Slot-based appointment scheduling

Dynamic slot generation based on doctor working hours

Prevents double booking

Slot Generation Logic

Slots are dynamically generated based on:

Doctor working hours

Slot duration

Existing appointments

Example:

Doctor Working Hours: 09:00 – 12:00
Slot Duration: 15 minutes

Generated Slots:
09:00
09:15
09:30
09:45
10:00
...

Booked slots are marked accordingly.

API Response Format

All API responses follow a consistent structure:

{
  "message": "Operation successful",
  "data": {}
}
Demo Credentials

Use the following accounts to test different roles.

Super Admin
Email: john@gmail.com
Password: 12345678
Doctor
Email: jane@gmail.com
Password: 12345678
Receptionist
Email: mike@gmail.com
Password: 12345678

Key Backend Endpoints
Authentication
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/check-auth
Users
GET    /api/superadmin/users
POST   /api/superadmin/users
DELETE /api/superadmin/user/:id
Patients
GET    /api/patients
POST   /api/patients
PUT    /api/patients/:id
DELETE /api/patients/:id
Doctors
GET /api/doctors
Slots
GET /api/slots?doctorId=...&date=...
Appointments
POST /api/appointments
GET  /api/appointments
PUT  /api/appointments/:id
Security Features

Password hashing using bcrypt

HTTP-only cookies for JWT storage

Role-based middleware authorization

Input validation

Duplicate slot booking prevention
NOTE
This project was developed as part of a technical assessment within a limited time frame.
Due to time constraints, some enhancements such as advanced UI refinements, extended validation,
and additional features were not fully implemented.
