# X-Hausted Autos — Secure Car Booking Web Application

A full-stack web application for managing automotive service bookings, built with security integrated at every layer of development. Developed as part of the Secure Web Development module at National College of Ireland.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Security Implementations](#security-implementations)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Testing](#testing)
- [References](#references)

---

## Overview

X-Hausted Autos is a booking platform for a car modification and servicing business.
Customers can register, log in, and book services including starlight ceiling installation,
ambient lighting, CarPlay kit fitting, valet, diagnostics, and general modifications.
Administrators have full control over bookings, services, and user accounts.

The application was built following a Secure Software Development Life Cycle (SSDLC),
meaning security was treated as a core requirement from the design phase rather than
added after the fact.

---

## Features

### User
- Register and log in securely
- View available services
- Create, view, and cancel bookings
- Session-based authentication with automatic expiry

### Admin
- View and manage all bookings
- Update booking status (pending / confirmed / completed / cancelled)
- Create bookings on behalf of users
- View and delete user accounts
- Full service CRUD management

---

## Security Implementations

| Feature | Implementation | Purpose |
|---|---|---|
| Password Hashing | bcrypt (salt rounds: 10) | Passwords never stored in plaintext |
| Session Management | express-session (httpOnly, sameSite, 2hr expiry) | Secure server-side authentication state |
| Role-Based Access Control | Custom middleware (isAuthenticated, isAdmin) | Prevents privilege escalation |
| Input Validation | express-validator (routes + schema level) | Blocks malformed and malicious input |
| NoSQL Injection Prevention | express-mongo-sanitize | Strips MongoDB operators from requests |
| Rate Limiting | express-rate-limit (login: 20/15min, register: 10/hr) | Defends against brute-force attacks |
| Security Headers | helmet.js (CSP, X-Frame-Options, noSniff) | Mitigates XSS, clickjacking, MIME sniffing |
| Error Handling | Global error handler, no stack traces in production | Prevents information leakage |
| Request Size Limit | express.json limit 10kb | Prevents payload-based attacks |

---

## Project Structure



---

## Setup and Installation

### Prerequisites

- Node.js v18 or higher
- MongoDB (local instance or MongoDB Atlas)
- npm

### Steps

1. Clone the repository

```bash
git clone https://github.com/thumbiko/Secure_Web_App_Proj.git
cd Secure_Web_App_Proj
```

2. Install backend dependencies

```bash
cd backend
npm install
```

3. Create your environment file in the backend directory

4. Install frontend dependencies

```bash
cd ../frontend
npm install
```

5. Start the backend server

```bash
cd ../backend
npm start
```

6. Start the frontend

```bash
cd ../frontend
npm start
```

The application will be available at `http://localhost:3000`  
The API runs at `http://localhost:5000/api`

### Creating an Admin Account

Register a normal user account through the application, then run:

```bash
cd backend
node scripts/makeAdmin.js your@email.com
```

---

## Usage

### As a User
- Navigate to `/register` to create an account
- Log in at `/login`
- Browse services on the home page
- Create and manage your bookings from the Bookings page

### As an Admin
- Log in with an admin account
- Access the Admin Dashboard to manage all bookings, services, and users
- Update booking statuses, create bookings for users, or remove accounts

---

## Testing

### Tools Used
- **Thunder Client Extension tool in VS code** — manual API testing for all endpoints
- **Npm Audit** — static application security testing (SAST) and dependency vulnerability scanning


### Security Tests Performed

**Input Validation**  
Submitted registration requests with weak passwords, invalid emails, and special characters in name fields.  
All rejected with HTTP 400 before reaching the database.

**NoSQL Injection**  
Sent `{ "$gt": "" }` as email and password values to the login endpoint.  
express-mongo-sanitize stripped the operators — request returned HTTP 400 as a normal failed login.

**Brute Force / Rate Limiting**  
Sent 25 consecutive login requests via script.  
Requests 21 onwards returned HTTP 429 — Too Many Requests.

**Access Control**  
Attempted to access `/api/bookings/admin/all` as a regular user session.  
Returned HTTP 403 Forbidden.

---

## Security Improvements Summary

- Replaced plaintext password storage with bcrypt hashing
- Moved from no session expiry to a 2-hour rolling session with secure cookie flags
- Added validation middleware layer between routes and controllers
- Added schema-level constraints as a secondary enforcement layer in Mongoose
- Configured helmet.js for full HTTP security header coverage
- Applied rate limiting to authentication endpoints
- Implemented global error handler that suppresses stack traces in production

---

## References

- OWASP (2021) *OWASP Top Ten*. Available at: https://owasp.org/www-project-top-ten/
- OWASP (2023) *Password Storage Cheat Sheet*. Available at: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- Helmetjs (2024) *Helmet documentation*. Available at: https://helmetjs.github.io/
- express-rate-limit (2024) Available at: https://express-rate-limit.mintlify.app/
