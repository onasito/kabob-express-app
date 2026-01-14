# ⭐ **Kabob Express App — Full-Stack Restaurant Ordering Platform**

A full-stack mobile ordering system built for a local restaurant, designed to give customers a smooth, modern way to browse the menu, place orders, and track their order status. The platform includes a React Native mobile app (iOS/Android) and a Node.js/Express backend powered by PostgreSQL and Prisma ORM.

This project showcases real-world development skills including API design, database modeling, mobile UI/UX, authentication, secure data handling, and deployment.

---

## 🚀 **Key Features**

### **Customer Mobile App (React Native + Expo)**

* Browse menu categories and items
* Add items to cart & customize quantities
* Submit pickup or dine-in orders
* View real-time order status
* Clean, mobile-first UI optimized for restaurants

### **Backend API (Node.js + Express + PostgreSQL)**

* RESTful API for menu, orders, and admin actions
* Prisma ORM for schema modeling and database queries
* Order processing logic with totals, items, and status management
* Modular controllers, routes, and middleware for scalable architecture
* Secure environment variable handling with JWT-ready structure
* Centralized error handling for consistent API responses

### **Admin Tools**

* Add, edit, or remove menu items
* Manage categories
* View incoming orders
* Update order status (Pending → In Progress → Ready → Completed)

---

## 🧱 **Tech Stack**

### **Frontend (Mobile)**

* React Native
* Expo
* React Navigation
* Axios

### **Backend**

* Node.js
* Express
* PostgreSQL
* Prisma
* JWT Auth (planned)
* Docker (optional)

### **Dev Tools**

* Nodemon
* ESLint/Prettier
* Prisma Studio
* Postman / REST Client for API testing

---

## 📐 **Architecture Overview**

* **Mobile App → Backend API → PostgreSQL**
* Backend structured with:

  * `routes/` – API endpoints
  * `controllers/` – business logic
  * `models/` (Prisma schema)
  * `middlewares/` – validation & error handling
  * `utils/` – helpers for responses and formatting

---

## 🛠️ **Getting Started**

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL
- Expo Go app (for mobile testing)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables (create `.env` file):
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/kabob_express"
JWT_SECRET="your-secret-key"
PORT=5000
```

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000/api`

### Mobile App Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure your backend URL in `.env`:
```bash
# Find your IP using: ipconfig (Windows) or ifconfig (Mac/Linux)
EXPO_PUBLIC_API_URL=http://YOUR_IP_ADDRESS:5000/api
```

5. Start Expo:
```bash
npm start
```

6. Scan QR code with Expo Go app or press `a` for Android emulator / `i` for iOS simulator

See [mobile/README.md](mobile/README.md) for detailed mobile setup instructions.

---

## 🎯 **Project Goals**

* Build a production-ready restaurant ordering platform
* Learn modern full-stack mobile development
* Work with real stakeholders and real requirements
* Showcase a complex, meaningful project on a software engineering resume

---

