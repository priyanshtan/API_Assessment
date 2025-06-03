
# 🧪 Node.js API Machine Test

This project is a Node.js backend for managing users with secure authentication, distance calculation, status toggling, and weekday-wise listing.

## 🔧 Technologies Used
- Node.js + Express
- MongoDB + Mongoose
- bcryptjs (for password hashing)
- jsonwebtoken (for JWT auth)
- dotenv (for env config)
- Postman (for API testing)

---

## 📁 Folder Structure

```
.
├── index.js
├── models/
│   └── User.js
├── routes/
│   └── userRoutes.js
├── controllers/
│   └── userController.js
├── middleware/
│   └── authMiddleware.js
├── utils/
│   └── distanceCalculator.js
├── .env
└── README.md
```

---

## ⚙️ Setup Instructions

1. **Clone the repo** and navigate to the folder:
   ```bash
   git clone <repo-url>
   cd nodejs-api-machine-test
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file:
   ```env
   MONGO_URI=mongodb://localhost:27017/userdb
   JWT_SECRET=your_secret_key
   ```

4. **Run the server**
   ```bash
   node index.js
   ```

---

## 🚀 API Endpoints

### 1. `POST /api/users/register`
Register a new user.

### 2. `PUT /api/users/toggle-status`
Toggle all user statuses. Requires `Authorization` token.

### 3. `GET /api/users/distance`
Calculate distance from the user to a destination. Requires `Authorization` token and query params `destination_latitude` and `destination_longitude`.

### 4. `GET /api/users/list?week_number=1,2`
Get users grouped by the day they registered. `week_number` can be comma-separated.

---

## 🧪 Testing with Postman

1. Open Postman
2. Import the collection: `nodejs-api-machine-test.postman_collection.json`
3. (Optional) Import the environment: `nodejs-api-environment.postman_environment.json`
4. Use the `Register` request to get a token, which is automatically saved for subsequent calls

---

## 📌 Notes

- JWT token is returned after registration.
- Passwords are stored encrypted using bcrypt.
- Optimized queries used (e.g., status toggle without loops).

---

## 📞 Support

For any issues, please contact the developer.
