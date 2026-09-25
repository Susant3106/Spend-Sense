# Spend Sense 💸

Spend Sense is a full-stack expense-tracking web application that helps users record, manage, and review their personal expenses. Users can create an account, securely log in, manage expense records, and view spending summaries through charts and reports.

## Features

- **User authentication:** Register and log in with email and password.
- **Password security:** Passwords are hashed using `bcryptjs`.
- **JWT authentication:** Protected API endpoints use JSON Web Tokens.
- **Expense management:** Add, view, update, and delete expenses.
- **Expense categories:** Organize spending into Food, Transport, Shopping, Bills, Health, Entertainment, and Other.
- **Expense filtering:** Filter expenses by category.
- **Reports and analytics:** View monthly spending and category-wise breakdowns using charts.
- **User-specific data:** Expenses are associated with the logged-in user.

## Tech Stack

### Frontend
- React
- React Router
- Axios
- Chart.js and react-chartjs-2
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Token (JWT)
- bcryptjs
- dotenv
- CORS

## Project Structure

```text
Spend-Sense/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Expense.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── expenses.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   └── package.json
└── .gitignore
```

## Getting Started

Follow these steps to run Spend Sense locally.

### Prerequisites

Install the following:

- [Node.js and npm](https://nodejs.org/)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account or a local MongoDB instance
- Git (optional, for cloning the repository)

### 1. Clone the repository

```bash
git clone https://github.com/Susant3106/Spend-Sense.git
cd Spend-Sense
```

### 2. Configure the backend

Open a terminal in the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
PORT=5000
```

Replace the example values with your own MongoDB connection string and a strong JWT secret. **Do not commit or share your `.env` file.**

Start the backend development server:

```bash
npm run dev
```

The API will run at `http://localhost:5000` by default.

### 3. Configure the frontend

Open a second terminal from the project root:

```bash
cd frontend
npm install
npm start
```

The React development server will usually open at `http://localhost:3000`.

The frontend's Axios configuration currently points to:

```text
http://localhost:5000/api
```

Make sure the backend is running on that address, or update the API base URL in `frontend/src/api/axios.js` if your backend uses a different address.

## API Overview

The backend base URL is `http://localhost:5000/api`.

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | Public |
| POST | `/auth/login` | Log in and receive a JWT | Public |

### Expenses

Include the JWT in the request header for protected routes:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `/expenses` | Create an expense |
| GET | `/expenses` | Get the logged-in user's expenses |
| GET | `/expenses?category=Food` | Filter expenses by category |
| PUT | `/expenses/:id` | Update an expense |
| DELETE | `/expenses/:id` | Delete an expense |
| GET | `/expenses/summary/monthly` | Get monthly spending summary |
| GET | `/expenses/summary/category` | Get category-wise spending summary |

## Security Notes

- Keep `.env` files and credentials out of version control.
- Use your own MongoDB connection string and JWT secret.
- Never publish real database passwords, tokens, or API secrets in a public repository.

## Future Improvements

Potential enhancements include deployment, automated tests, budget limits, recurring expenses, and downloadable reports.

## Author

**Susant Kumar**

GitHub: [@Susant3106](https://github.com/Susant3106)

---

If you find this project useful, feel free to star the repository!
