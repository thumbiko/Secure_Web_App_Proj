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
