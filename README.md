<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=250&section=header&text=Pearl%20Hotel%20Management&fontSize=80&animation=fadeIn&fontAlignY=35" alt="Header" />
  
  <br />
  <br />

  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=24&pause=1000&color=2563EB&center=true&vCenter=true&width=600&lines=Welcome+to+Pearl+Hotel+Management;A+Modern+MERN+Stack+Application;Manage+Bookings,+Rooms,+Spa,+and+More!" alt="Typing SVG" />

  <p align="center">
    <strong>A fully-featured, beautifully designed Hotel Management System built with the MERN stack.</strong>
  </p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  </p>
</div>

<br />

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" />

## 🌟 Introduction

**Pearl Hotel MERN** is a comprehensive solution designed to automate and streamline the daily operations of a luxury hotel. From managing room bookings and spa reservations to processing payments securely, this platform offers a seamless experience for both guests and administrators.

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" />

## ✨ Key Features

### 🤵 For Guests
- 🏨 **Room Browsing & Booking:** View available rooms with high-quality images, descriptions, and dynamic pricing.
- 💳 **Secure Payments:** Integrated with **Razorpay** for safe and instant transactions.
- 🎟️ **Coupons & Discounts:** Apply promo codes during checkout.
- 💆‍♀️ **Spa Reservations:** Browse and book spa treatments directly from the app.
- 🍽️ **Restaurant Menu:** View the hotel's dining options.
- 📅 **Event Management:** Book hotel halls for conferences and parties.
- ⭐ **Reviews & Ratings:** Share your experience and read reviews from other guests.

### 🛡️ For Administrators (Admin Dashboard)
- 📊 **Real-time Analytics:** Track revenue, bookings, and occupancy rates via Interactive Charts (Recharts).
- 🛏️ **Room Management:** Add, update, or remove rooms and categories.
- 🧑‍🤝‍🧑 **User & Staff Management:** Manage accounts and privileges securely.
- 🧾 **Invoicing:** Auto-generate beautiful PDF invoices for guests.

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" />

## 🛠️ Tech Stack & Technologies

### 💻 Frontend (Client)
- **Framework:** React.js
- **Styling:** Tailwind CSS (Utility-first styling)
- **Animations:** Framer Motion & Swiper.js
- **Maps:** React Leaflet
- **Data Visualization:** Recharts
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Notifications:** React Toastify

### ⚙️ Backend (Server)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Payment Gateway:** Razorpay
- **PDF Generation:** PDFKit
- **SMS Notifications:** Twilio

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" />

## 🚀 Getting Started

Follow these steps to set up the project locally on your machine.

### 1️⃣ Prerequisites
Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or MongoDB Atlas)
- [Git](https://git-scm.com/)

### 2️⃣ Clone the Repository
```bash
git clone https://github.com/itsfraz/Pearl-Hotel.git
cd Pearl-Hotel
```

### 3️⃣ Backend Setup (Server)
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add the following variables:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
PORT=5000
ADMIN_EMAIL=admin@pearlhotel.com
ADMIN_PASSWORD=your_secure_admin_password
```

Start the backend server:
```bash
npm run dev
```

### 4️⃣ Frontend Setup (Client)
Open a new terminal, navigate to the client directory, and install dependencies:
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend application:
```bash
npm start
```

### 🎉 You're all set! 
The app should now be running at `http://localhost:3000`.

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" />

## 🛡️ Security Measures
- **Password Hashing:** All user passwords are encrypted using `bcryptjs`.
- **Protected Routes:** Administrative and protected routes verify tokens via custom JWT middleware.
- **Environment Variables:** Sensitive API keys (MongoDB, Razorpay) are kept strictly in `.env` files and ignored from Git.

<img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%" />

## 📬 Contact & Support
If you have any questions, feedback, or issues, please feel free to open an issue or reach out to the maintainer.

<div align="center">
  <p>Made with ❤️ using the MERN Stack</p>
  <img src="https://capsule-render.vercel.app/api?type=waving&color=timeGradient&height=100&section=footer" width="100%"/>
</div>