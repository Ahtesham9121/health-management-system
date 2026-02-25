# Health Management System

A full-stack web application designed to manage patient records, appointments, medical history, and administrative operations efficiently within a healthcare environment.

This system demonstrates a structured backend architecture, REST API integration, and a responsive frontend interface.

---

## Project Overview

The Health Management System (HMS) is built using a modern full-stack architecture:

Frontend (React / HTML / CSS / JS)  
↓  
REST API (Java - Spring Boot)  
↓  
Database (MySQL / Relational Database)

The system is designed to simulate real-world healthcare workflows including patient management, appointment scheduling, and data handling.

---

## Tech Stack

### Backend
- Java
- Spring Boot
- RESTful APIs
- JPA / Hibernate
- Maven

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript (ES6+)
- Axios (API integration)

### Database
- MySQL (Relational Database)

### Version Control
- Git
- GitHub

---

## Features

- Patient registration and management
- Doctor management
- Appointment scheduling
- Medical history tracking
- REST API integration
- Modular backend architecture
- Structured and responsive frontend UI

---

## Project Structure

Health Management System/
│
├── backend/            # Spring Boot backend application
│   ├── src/
│   ├── pom.xml
│
├── frontend/           # React frontend application
│   ├── src/
│   ├── package.json
│
├── .gitignore
├── README.md

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Ahtesham9121/health-management-system.git
cd health-management-system
```

---

## Running the Backend

### Step 1: Navigate to Backend Folder

```bash
cd backend
```

### Step 2: Configure Database

Update the `application.properties` file:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_database
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### Step 3: Run the Application

```bash
mvn spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

---

## Running the Frontend

### Step 1: Navigate to Frontend Folder

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the Application

```bash
npm start
```

Frontend runs on:

```
http://localhost:3000
```

---

## API Endpoints (Sample)

```
GET    /api/patients
POST   /api/appointments
PUT    /api/patient/{id}
DELETE /api/patient/{id}
```

---

## Design Principles

- Layered Architecture
- Separation of Concerns
- RESTful API Design
- Clean Code Structure
- Modular Development Approach

---

## Future Improvements

- Role-based authentication (Admin / Doctor / Patient)
- JWT security implementation
- Docker containerization
- Cloud deployment (AWS / Azure / Render)
- CI/CD integration using GitHub Actions

---

## Author

MD Ahtesham Raza  
Full Stack Java Developer  
GitHub: https://github.com/Ahtesham9121

---

## License

This project is developed for educational and demonstration purposes.
