# Online House Rental & Tenant Management System

## 📌 Project Overview

The **Online House Rental & Tenant Management System** is a full-stack web application that provides a digital platform for property owners to list rental houses and for tenants to search, view, and request bookings for available properties. The system streamlines the rental process by automating property management, booking workflows, and tenant–owner interactions.

This project is developed as an academic capstone and follows real-world full-stack application architecture.

---

## 🎯 Objective

To develop a secure, scalable, and user-friendly rental management system where:

* Property owners can manage rental listings and tenant requests
* Tenants can search and book rental properties efficiently
* The system ensures proper validation, role-based access, and data integrity

---

## 👥 User Roles

### 🏠 Owner

* Add new property listings
* Update and manage listed properties
* View tenant booking requests
* Approve or reject booking requests
* View tenant details for approved bookings

### 👤 Tenant

* Browse available rental properties
* View detailed property information
* Search and filter properties
* Submit booking requests
* Track booking request status

### 🛡️ Admin (Optional)

* Monitor users and property listings
* View basic system analytics
* Oversee platform activities

---

## 🏘️ Property Listing & Search

### Property Details Include:

* Property photos (stored as file paths or URLs)
* Rent amount
* Location
* Amenities (AC, Wi-Fi, Parking, etc.)

### Tenant Features:

* Browse all available properties
* Search and filter properties by:

  * Location
  * Budget
  * Amenities

### UI Pages:

* **Property Listing Page** – Displays all available properties
* **Property Details Page** – Shows property details, images, and booking option

---

## 📑 Tenant Management & Booking

* Tenants can submit booking requests for selected properties
* Owners can approve or reject booking requests
* Tenants can view booking status:

  * Pending
  * Approved
  * Rejected
* Owners can view tenant details for approved bookings

### UI Pages:

* **Tenant Booking Page** – Submit booking requests
* **Owner Dashboard** – Manage properties and tenant bookings

---

## 🖥️ Frontend (Angular 18)

* Developed using **Angular 18**
* Uses **Angular Material** for UI components
* Modular and component-based architecture

### Key Components:

* `PropertyListComponent` – Display all properties
* `PropertyDetailsComponent` – Show property details and booking option
* `BookingRequestComponent` – Submit booking requests
* `OwnerDashboardComponent` – Manage properties and tenant requests

### Application Routes:

| Path                   | Component                | Description                  |
| ---------------------- | ------------------------ | ---------------------------- |
| `/properties`          | PropertyListComponent    | Browse all properties        |
| `/properties/:id`      | PropertyDetailsComponent | View property details        |
| `/properties/:id/book` | BookingRequestComponent  | Submit booking request       |
| `/owner/dashboard`     | OwnerDashboardComponent  | Manage properties & bookings |

---

## 🛠️ Backend (Node.js + TypeScript)

* Node.js with **TypeScript**
* Express.js RESTful APIs
* MySQL database integration
* Input validation and exception handling
* Role-based API access control

---

## 🗄️ Database Structure (MySQL)

### Properties Table

* `id`
* `owner_id`
* `title`
* `description`
* `rent`
* `location`
* `amenities`
* `photos`
* `created_at`

### Bookings Table

* `id`
* `property_id`
* `tenant_id`
* `status` (Pending / Approved / Rejected)
* `request_time`

> A simple relational mapping is maintained between **Properties** and **Bookings** tables.

---

## ✅ Validation Rules

* Property title and location must not be empty
* Rent amount must be greater than zero
* Booking requests must contain valid property and tenant data
* Booking status must be one of:

  * Pending
  * Approved
  * Rejected
* All validations ensure data integrity and correct workflow

---

## 🔐 Role-Based Access Control

* Implemented using **Angular Route Guards**
* Access restrictions:

  * **Tenant** → Property browsing and booking features
  * **Owner** → Property and booking management
  * **Admin** → System monitoring (if enabled)
* Unauthorized access redirects users to login or access-denied pages

---

## ⚠️ Exception Handling

* Graceful error handling in frontend and backend
* Meaningful error messages displayed in the UI
* Server-side error logging for debugging
* Proper HTTP status codes for all API responses

---

## 🔔 Notifications & Status Updates

* Success notifications on booking submission
* Real-time booking status updates for tenants upon owner action

---

## 👥 Team Contribution (Team Size: 4)

* Backend and frontend development were carried out collaboratively.
* Functional analysis, validation logic, and documentation were handled as shared responsibilities.
* UI/UX refinements, testing, and workflow verification were jointly managed.
* Deployment readiness and project review preparation were completed as a team.

---

## 📜 Conclusion

The Online House Rental & Tenant Management System provides an efficient digital solution for managing rental properties and tenant bookings. The project demonstrates practical implementation of full-stack development concepts, role-based access control, and real-world rental workflows aligned with academic and industry standards.
