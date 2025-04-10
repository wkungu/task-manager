# 📝 Full-Stack Task Management App (FastAPI + Next.js)

A full-stack task management system built with **FastAPI**, **Next.js 15**, and **PostgreSQL**.

## Demo Video
- **[Demo Video URL](https://vento.so/view/4d504d22-563d-4193-b38f-d6b2580cd79b?utm_medium=share)**

<img src="./frontend/dashboard.png" alt="Dashboard Page" width="100%" />


## 🚀 Features

- Authentication with **JWT (API) & NextAuth (Frontend)**
- Task management (CRUD)
- **Async SQLAlchemy with `asyncpg`** for high performance
- **Dockerized** with `docker-compose`
- **CI/CD with GitHub Actions** (optional)

---

## 📦 Tech Stack

### Backend

- **FastAPI** (Python)
- **SQLAlchemy** (Async with `asyncpg`)
- **PostgreSQL** (Dockerized)
- **JWT Authentication**

### Frontend

- **Next.js 15** (React Framework)
- **Tailwind CSS** (Styling)
- **ShadCN** (UI Components)
- **Redux Toolkit** (State Management)
- **TanStack Query** (Data Fetching)

---

## ⚙️ Setup Instructions

### 1️ Clone the Repository

```sh
git clone https://github.com/wkungu/task-manager.git
cd task-manager
```

### 2 Set Up Environment Variables  
Copy the `.env.example` file and configure your environment variables:

```sh
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Update the `.env` files for both backend and frontend with the necessary values. Make sure that the secret key on both **backend** and **frontend** are similar. e.g `NEXTAUTH_SECRET` and `SECRET_KEY`

### 3 Start the Application with Docker

```sh
docker-compose up --build
```

This will spin up:

- **PostgreSQL database**
- **FastAPI backend** (task-manager-backend) This container has an entrypoint.sh file that will first run the database migrations before starting FastAPI
- **Next.js frontend** (task-manager-frontend)

### 4 Developer Reset Script (Optional)

To completely reset the dev environment (containers, volumes, frontend image) run the following script:

```sh
./dev-reset.sh
```
This script will:
- Stop and remove containers, volumes, and networks
- Remove the frontend and the backend images
- Rebuild and start everything cleanly

## 📄 API Documentation
Once the backend is running, visit:
```sh
http://localhost:8000/docs
```
This will show an interactive OpenAPI documentation generated by FastAPI.

## 🚀 Deployment (CI/CD)
This project includes a GitHub Actions CI/CD pipeline that:

- Runs tests and checks code quality.
- Builds and pushes Docker images to a container registry.
- Deploys the application (configurable for production).

## 📌 Notes
- Ensure Docker and Docker Compose are installed.
- Update the .env files to match your setup.
- The backend runs on http://localhost:8000 (or inside Docker at http://task-manager-backend:8000).
- The frontend runs on http://localhost:3000.