# 🚨 CrisisDesk AI

> **Next-Generation Emergency Response & Triage API powered by Google Gemini AI.**

## 📖 The Problem
In high-stress disaster situations, emergency reporting is often fragmented, chaotic, and overwhelming. First responders face a deluge of unverified, duplicate, and unclassified incident reports, causing critical delays in deployment and resource allocation. 

## 🚀 The Solution
**CrisisDesk AI** is an intelligent, scalable backend API designed to automatically ingest, classify, and triage emergency reports in real-time. By leveraging cutting-edge LLMs (Google Gemini 1.5 Flash), the system instantly categorizes incidents, predicts urgency, generates actionable summaries, and flags potential duplicates—drastically reducing manual triage time and saving lives.

---

## ✨ Key Features

- 🧠 **AI-Powered Triage (Gemini AI)**: Automatically extracts `category`, `urgency`, `summary`, and `suggestedAction` from unstructured incident descriptions.
- 👯 **Advanced Duplicate Detection**: Utilizes `string-similarity` to cross-reference new reports against the database (within a 24-hour window) to intelligently flag duplicates.
- 📊 **Aggregation Analytics**: High-performance MongoDB Aggregation Pipelines to instantly generate complex statistical breakdowns (by status, category, and urgency) for real-time dashboards.
- 🔒 **Enterprise-Grade Security**: Global rate limiting configured via `express-rate-limit` to protect the API from DDoS attacks and abuse.
- 🐳 **Fully Dockerized**: Seamless setup and deployment using Docker and Docker Compose.
- 📚 **Interactive Documentation**: Beautiful, auto-generated OpenAPI 3.0 specs available via Swagger UI.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose
- **AI & NLP**: Google Gemini 1.5 Flash SDK, `string-similarity`
- **Security & Validation**: `express-validator`, `express-rate-limit`
- **Containerization**: Docker, Docker Compose
- **Documentation**: Swagger UI (`swagger-ui-express`, `yamljs`)

---

## ⚙️ Environment Variables

To run the application, you will need to create a `.env` file in the root directory. Here is the exact structure needed:

```env
# Application Port
PORT=3000

# MongoDB Atlas Credentials
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password

# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🚀 Quick Start / Setup Guide

Follow these instructions to get the backend up and running locally.

### Step 1: Clone the Repo
```bash
git clone https://github.com/alhasandhali/crisis-desk-ai.git
cd crisis-desk-ai
```

### Step 2: Set up `.env`
Create a `.env` file in the root directory using the environment variables layout provided above, and populate it with your valid credentials.

### Step 3: Run using Docker (Primary Method)
Spin up the Node.js application and a local MongoDB instance effortlessly using Docker Compose:
```bash
docker compose up --build
```

### Step 4: Run locally without Docker
If you prefer running it natively on your machine:
```bash
# Install dependencies
npm install

# Start the server (or use node server.js)
npm start
```

---

## 📚 API Documentation

Once the server is running, full **OpenAPI 3.0 documentation** is available interactively at:  
👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

### Core Endpoints Overview
- `POST /api/reports` - Submit a new incident report (AI Classification & Duplicate Check).
- `GET /api/reports/stats/summary` - Fetch analytical breakdowns of all reports.
- `GET /api/reports` - Fetch a list of reports with powerful filtering and search.
- `GET /api/reports/:id` - Fetch a single report by ID.
- `PATCH /api/reports/:id/status` - Update the status of a specific report.
- `DELETE /api/reports/:id` - Delete a report by ID.

---

## 🏆 Hackathon Deliverables

- **Live Deployment URL**: **[Insert Live Deployment URL Here]**
- **Pitch Video & Architecture**: **[Insert YouTube Video Pitch / Architecture Diagram Link Here]**

---

<p align="center">
  <i>Built with ❤️ for rapid emergency response.</i>
</p>
