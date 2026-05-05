# 🏠 Online House Rental & Tenant Management System

A full-stack web application that connects property owners and tenants — owners can list and manage rental properties, tenants can search, view, and book them. Built as a team academic capstone project.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 20, Angular Material |
| Backend | Node.js, TypeScript, Express.js |
| Database | MySQL 8.x |
| Authentication | JWT (JSON Web Tokens) + bcryptjs |
| File Uploads | Multer |
| Validation | express-validator |

---

## ✨ Features

### 🏠 Property Owner
- Register and log in as a property owner
- Add new rental property listings with images
- Edit and delete existing listings
- View all incoming tenant booking requests
- Approve or reject booking requests
- View tenant contact details for approved bookings

### 👤 Tenant
- Register and log in as a tenant
- Browse all available rental properties
- Filter properties by city, rent range, type, bedrooms, and amenities
- View full property details with images and amenities
- Submit booking requests with preferred move-in date and message
- Track booking request status (Pending / Approved / Rejected / Cancelled)

### 🔐 Authentication & Security
- Role-based access control (Owner / Tenant / Admin)
- JWT token authentication with expiry
- Protected routes via Angular route guards
- Passwords hashed with bcryptjs

---

## 📁 Project Structure
```
├── backend/
│   └── src/
│       ├── config/         # Database connection pool
│       ├── controllers/    # Route handler logic
│       ├── middleware/     # Auth, error handling, file upload
│       ├── models/         # MySQL query methods
│       ├── routes/         # API route definitions
│       └── server.ts       # Express app entry point
├── frontend/
│   └── src/app/
│       ├── components/     # Standalone Angular components
│       ├── guards/         # Route guards (auth, owner, tenant)
│       ├── interceptors/   # HTTP interceptor for JWT headers
│       ├── models/         # TypeScript interfaces
│       ├── modules/        # Lazy-loaded owner and tenant modules
│       └── services/       # API service layer
└── README.md
```

---

## ⚙️ Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [MySQL](https://www.mysql.com/) 8.x
- [Angular CLI](https://angular.io/cli) v20

```bash
npm install -g @angular/cli
```

---

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Online-House-Rental-Tenant-Management-System.git
cd Online-House-Rental-Tenant-Management-System
```

### 2. Set up the database

Open MySQL and run the schema file:

```bash
mysql -u root -p < backend/src/database/schema.sql
```

This will create the database, all tables, default amenities, and a default admin user.

> **Default Admin Credentials**
> Email: `admin@ohrtms.com`
> Password: `admin123`

### 3. Configure backend environment

```bash
cd backend
cp .env.example .env
```

Edit `.env` and fill in your MySQL credentials and a strong JWT secret:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=rental_property_db
JWT_SECRET=your_strong_secret_key_here
```

### 4. Install backend dependencies

```bash
cd backend
npm install
```

### 5. Install frontend dependencies

```bash
cd frontend
npm install
```

---

## ▶️ Running the Project

### Start the backend server

```bash
cd backend
npm run dev
```

Backend runs at: `http://localhost:5000`

### Start the frontend

```bash
cd frontend
npm start
```

Frontend runs at: `http://localhost:4200`

> Make sure both are running at the same time.

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/profile` | Get current user profile |
| PUT | `/api/auth/profile` | Update profile |

### Properties
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | Get all available properties |
| GET | `/api/properties/:id` | Get property by ID |
| GET | `/api/properties/my/properties` | Get owner's listings |
| POST | `/api/properties` | Create new property (owner) |
| PUT | `/api/properties/:id` | Update property (owner) |
| DELETE | `/api/properties/:id` | Delete property (owner) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking request (tenant) |
| GET | `/api/bookings/my-bookings` | Tenant's own bookings |
| GET | `/api/bookings/received` | Owner's received bookings |
| PUT | `/api/bookings/:id/status` | Approve / reject / cancel |
| DELETE | `/api/bookings/:id` | Delete booking |

---

## 📸 Screenshots

> Screenshots are located in `Project Documentation/Screenshot/`

| Page | Description |
|------|-------------|
| Home | Landing page with property search |
| Property Listing | Browse all available properties |
| Property Details | Full details with images and booking option |
| Owner Dashboard | Manage listings and booking requests |
| Tenant Dashboard | Track booking statuses |

---

## 👥 Contributors

| Name | GitHub | Role |
|------|--------|------|
| Contributor 1 | — | Backend & Database |
| Romeshwar K | [@romesh45](https://github.com/romesh45) | Backend fixes, security improvements, documentation |
| Contributor 3 | — | Frontend Development |
| Contributor 4 | — | UI/UX & Testing |

---

## 📄 License

This project was developed as an academic capstone project at K. Ramakrishnan College of Engineering.
