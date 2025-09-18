# 📚 School Payments Dashboard (Frontend)

<p align="center">
  <img src="https://vitejs.dev/logo.svg" width="120" alt="Vite Logo" />
</p>

<p align="center">
  A <strong>React-based frontend</strong> for the <strong>School Payments and Dashboard Application</strong>, designed to be <strong>responsive, user-friendly</strong>, and integrated with the backend (NestJS).
  <br>
  This app allows schools to view, filter, and check the status of payment transactions.
</p>

<p align="center">
  <a href="https://school-payments-frontend-qidx.onrender.com" target="_blank"><img src="https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen?style=for-the-badge" alt="Live Demo"></a>
  <a href="https://github.com/nabilaqureshi23/school-payments-frontend/actions"><img src="https://img.shields.io/github/actions/workflow/status/your-username/school-payments-frontend/ci.yml?branch=main" alt="Build Status"></a>
  <a href="https://github.com/nabilaqureshi23/school-payments-frontend/blob/main/LICENSE"><img src="https://img.shields.io/github/license/your-username/school-payments-frontend.svg" alt="License"></a>
  <img src="https://img.shields.io/badge/React-18%2B-blue" alt="React Version">
  <img src="https://img.shields.io/badge/Deployed%20on-Render-46E3B7" alt="Deployed on Render">
</p>

## ✨ Features

### 🔐 Authentication
* Login with JWT token
* Logout functionality

### 📊 Dashboard Pages

#### 1. **Transactions Overview**
* Paginated and searchable transactions list
* Columns: `collect_id`, `school_id`, `gateway`, `order_amount`, `transaction_amount`, `status`, `custom_order_id`
* Filters: status, school IDs, date range
* Sorting: ascending/descending
* Persist filters in URL (shareable/reload-safe)

#### 2. **Transaction Details by School**
* View all transactions filtered by a specific `school_id`
* Selectable via dropdown or search

#### 3. **Transaction Status Check**
* Input `custom_order_id` and fetch current payment status

### 🎨 UI/UX
* Built with **React + Vite**
* Styled using **CSS** 
* Dark mode toggle
* Fully responsive across devices

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [React.js](https://reactjs.org/) (Vite) | Frontend Framework |
| [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS) | Styling |
| [React Router](https://reactrouter.com/) | Routing |
| [Axios](https://axios-http.com/) | API Calls |
| [Lucide React](https://lucide.dev/) | Icons |

## 🚀 Live Demo

👉 **Frontend (Render):** [School Payments Dashboard](https://school-payments-frontend-qidx.onrender.com)

👉 **Backend (Render):** [School Payments Backend](https://school-paymnet-backend.onrender.com)

## 📂 Project Setup (Local)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/nabilaqureshi23/school-payments-frontend.git
cd school-payments-frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file at the root:

```env
VITE_API_URL=https://school-paymnet-backend.onrender.com
```

### 4️⃣ Run Locally

```bash
npm run dev
```

Frontend will start at → `http://localhost:5173`

## 🌍 Deployment (Render)

This project is already deployed at 👉 [Live Demo](https://school-payments-frontend-qidx.onrender.com).


## 📸 Screenshots

* Login Page
  <img width="1871" height="857" alt="image" src="https://github.com/user-attachments/assets/f8c17a3b-2737-4f34-9eda-7080ef889a0c" />

* Overview Page
  <img width="1875" height="873" alt="image" src="https://github.com/user-attachments/assets/57a48267-e700-46af-9e87-1270927ade96" />
  <img width="1889" height="883" alt="image" src="https://github.com/user-attachments/assets/ab6199e2-5840-4507-b25b-6afa2f6b85de" />
  <img width="1898" height="868" alt="image" src="https://github.com/user-attachments/assets/47068f1d-375c-4b61-b5a5-314019e68115" />
  <img width="1885" height="875" alt="image" src="https://github.com/user-attachments/assets/ea636d9b-9ff5-4ebf-873d-f3c1e026663c" />

* Transactions by School
  <img width="1891" height="879" alt="image" src="https://github.com/user-attachments/assets/bd61854c-3397-4a8d-b17d-e189ec0126e0" />

* Check Status
  <img width="1899" height="873" alt="image" src="https://github.com/user-attachments/assets/db817a77-4885-4fa1-bd6b-3ae84c88578d" />
  <img width="1871" height="866" alt="image" src="https://github.com/user-attachments/assets/a8cea40d-11da-480e-ba4f-ff4148bda2dd" />

## 📑 Pages

| Route | Page | Description |
|-------|------|-------------|
| `/login` | User Login | Authentication page |
| `/` | Transactions Overview | Main dashboard with all transactions |
| `/school` | Transactions by School | Filter transactions by specific school |
| `/status` | Transaction Status Check | Check individual transaction status |

## 🔗 Submission

* **Hosted Frontend (Render):** https://school-payments-frontend-qidx.onrender.com
* **Hosted Backend (Render):** https://school-paymnet-backend.onrender.com
* **Frontend GitHub Repo:** `https://github.com/nabilaqureshi23/school-payments-frontend`
* **Backend GitHub Repo:** `https://github.com/nabilaqureshi23/school_paymnet_backend`


---



<p align="center">
  <a href="https://github.com/your-username/school-payments-frontend">⭐ Star this repo if you found it helpful!</a>
</p>
