# Baby Steps Assignment Backend

## 📌 Overview
This is the backend service for the Baby Steps appointment booking system. It allows users to manage doctors, check available slots, and book appointments.

## 🚀 Features
- Manage doctor details and working hours.
- Check available slots for doctors on a specific date.
- Book, update, and delete appointments.

## 🛠️ Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Vinaykumar5890/baby-steps-assignment-backend.git
   cd baby-steps-assignment-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   nodemon app.js
   ```

## ⚙️ API Endpoints

### 📍 Doctors
#### Get all doctors
```http
GET /doctors
```

#### Get available slots for a doctor
```http
GET /doctors/:id/slots?date=YYYY-MM-DD
```

### 📍 Appointments
#### Book an appointment
```http
POST /appointments
```
**Request Body:**
```json
{
  "doctorId": "<doctor_id>",
  "date": "2025-02-24T10:00:00Z",
  "duration": 30,
  "appointmentType": "consultation",
  "patientName": "John Doe",
  "notes": "Follow-up checkup"
}
```

#### Get all appointments
```http
GET /appointments
```

#### Delete an appointment
```http
DELETE /appointments/:id
```

#### Update an appointment
```http
PUT /appointments/:id
```
**Request Body:**
```json
{
  "date": "2025-02-24T11:00:00Z",
  "notes": "Rescheduled appointment"
}
```

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose

## 🔗 License
This project is open-source. Feel free to contribute!

---

🚀 **Developed by Vinay Kumar**
