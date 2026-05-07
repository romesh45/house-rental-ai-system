# 🏠 House Rental AI System

An AI-enhanced full-stack web application for property rental management. This project extends a team capstone system with three individual AI features — rent price prediction, smart property recommendations, and an LLM-powered chatbot.

---

## 📌 Project Background

This project was originally developed as a team academic capstone during a 6-month industrial training program at K. Ramakrishnan College of Engineering. The base system (Angular frontend + Node.js backend + MySQL database) was built collaboratively by a team of 4.

I ([@romesh45](https://github.com/romesh45)) am contributor #2 on the original team repo. In this personal repository, I have extended the base system with three original AI features as my individual contribution.

---

## 🤖 AI Features (Individual Contribution)

### Feature 1 — AI Rent Price Predictor
- Predicts fair monthly rent for any property in India
- Uses **Random Forest Regressor** (scikit-learn) trained on 1000 synthetic data points
- Inputs: city, bedrooms, bathrooms, area, furnishing status, amenities
- Outputs: predicted rent, ±₹5,000 expected range, feature importance chart
- Shows model accuracy (R² score) and RMSE in sidebar
- Built with **Streamlit**

### Feature 2 — Smart Property Recommender
- Recommends best matching properties based on tenant preferences
- Uses **Cosine Similarity** with **MinMaxScaler** normalization
- Inputs: city, property type, bedrooms, bathrooms, area, budget, amenities, furnishing
- Outputs: top 5 matching properties with match score and progress bar
- Built with **Streamlit**

### Feature 3 — AI Property Chatbot
- Conversational assistant for property queries
- Powered by **Groq API** with **LLaMA 3.3 70B** model (free tier)
- RAG-style context injection with property knowledge base
- Quick question buttons, full chat history, clear chat option
- Built with **Streamlit**

---

## 🛠️ Full Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 20, Angular Material |
| Backend | Node.js, TypeScript, Express.js |
| Database | MySQL 8.x |
| Authentication | JWT + bcryptjs |
| File Uploads | Multer |
| AI - ML Models | Python, scikit-learn, Random Forest, Cosine Similarity |
| AI - LLM | Groq API, LLaMA 3.3 70B |
| AI - Interface | Streamlit |
| Data Processing | pandas, numpy, matplotlib |

---

## 📁 Project Structure
```
house-rental-ai-system/
├── backend/                        # Node.js + TypeScript REST API
│   └── src/
│       ├── config/                 # Database connection
│       ├── controllers/            # Route handlers
│       ├── middleware/             # Auth, error, upload
│       ├── models/                 # MySQL query methods
│       └── routes/                 # API routes
├── frontend/                       # Angular 20 SPA
│   └── src/app/
│       ├── components/             # Standalone components
│       ├── guards/                 # Route guards
│       ├── interceptors/           # JWT interceptor
│       ├── models/                 # TypeScript interfaces
│       ├── modules/                # Lazy loaded modules
│       └── services/               # API services
├── ai/                             # AI features (individual contribution)
│   ├── feature1_rent_predictor/    # Random Forest rent predictor
│   │   ├── data_generator.py       # Synthetic data generation
│   │   └── app.py                  # Streamlit app
│   ├── feature2_recommender/       # Cosine similarity recommender
│   │   └── app.py                  # Streamlit app
│   ├── feature3_chatbot/           # Groq LLM chatbot
│   │   └── app.py                  # Streamlit app
│   └── requirements.txt            # Python dependencies
└── README.md
```

---

## ⚙️ Prerequisites

- Node.js v18+
- MySQL 8.x
- Python 3.10+
- Angular CLI v20
- Groq API key (free at [console.groq.com](https://console.groq.com))

---

## 🚀 Setup — Base System

### 1. Clone the repo
```bash
git clone https://github.com/romesh45/house-rental-ai-system.git
cd house-rental-ai-system
```

### 2. Set up the database
```bash
mysql -u root -p < backend/src/database/schema.sql
```

### 3. Configure backend environment
```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials and JWT secret
```

### 4. Install and run backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### 5. Install and run frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:4200
```

---

## 🤖 Setup — AI Features

### Install Python dependencies
```bash
cd ai
pip install -r requirements.txt
```

### Feature 1 — Rent Price Predictor
```bash
cd ai/feature1_rent_predictor
python data_generator.py       # generates rental_data.csv
streamlit run app.py           # runs on http://localhost:8501
```

### Feature 2 — Property Recommender
```bash
cd ai/feature2_recommender
streamlit run app.py           # runs on http://localhost:8502
```

### Feature 3 — AI Chatbot
```bash
# Add your Groq API key to ai/feature3_chatbot/.env
cd ai/feature3_chatbot
streamlit run app.py           # runs on http://localhost:8503
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/auth/profile` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Properties
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/properties` | Get all properties |
| GET | `/api/properties/:id` | Get property by ID |
| GET | `/api/properties/my/properties` | Owner's listings |
| POST | `/api/properties` | Create property |
| PUT | `/api/properties/:id` | Update property |
| DELETE | `/api/properties/:id` | Delete property |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking request |
| GET | `/api/bookings/my-bookings` | Tenant's bookings |
| GET | `/api/bookings/received` | Owner's received bookings |
| PUT | `/api/bookings/:id/status` | Update booking status |
| DELETE | `/api/bookings/:id` | Delete booking |

---

## 📸 Screenshots

> Screenshots are located in `Project Documentation/Screenshot/`

| Page | Description |
|------|-------------|
| Home | Landing page with property search |
| Property Listing | Browse all available properties |
| Property Details | Full details with images and booking |
| Owner Dashboard | Manage listings and booking requests |
| Rent Predictor | AI rent prediction with feature importance |
| Recommender | Top 5 matching properties with match score |
| Chatbot | Conversational property assistant |

---

## 👥 Contributors

| Name | GitHub | Role |
|------|--------|------|
| Team Member 1 | — | Backend & Database |
| Romeshwar K | [@romesh45](https://github.com/romesh45) | Bug fixes, security improvements, AI features, documentation |
| Team Member 3 | — | Frontend Development |
| Team Member 4 | — | UI/UX & Testing |

---

## 🧠 CV Description

> "House Rental AI System — Extended a team capstone project with three AI features: rent price prediction using Random Forest (scikit-learn), smart property recommendation using cosine similarity, and an LLM-powered chatbot using Groq API with LLaMA 3.3 70B. Individual AI contribution built on top of a full-stack Angular + Node.js + MySQL base system."

---

## 📄 License

This project was developed as part of academic training at K. Ramakrishnan College of Engineering.
