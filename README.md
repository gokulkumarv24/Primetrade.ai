# TaskFlow API - Scalable REST API with Authentication & Role-Based Access

A full-stack task management application with a **Node.js/Express** backend and **React** frontend. Features JWT authentication, role-based access control (RBAC), full CRUD operations, input validation, and Swagger API documentation.

---

## Tech Stack

| Layer      | Technology                           |
|------------|--------------------------------------|
| Backend    | Node.js, Express.js                  |
| Database   | MongoDB with Mongoose ODM            |
| Auth       | JWT (jsonwebtoken), bcryptjs         |
| Frontend   | React 18, Vite, React Router v6     |
| API Docs   | Swagger (swagger-jsdoc + swagger-ui) |
| Security   | helmet, cors, express-rate-limit, express-mongo-sanitize, hpp |

---

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection, env config, Swagger setup
│   │   ├── controllers/     # Auth & Task business logic
│   │   ├── middleware/       # Auth guard, RBAC, validators, error handler
│   │   ├── models/          # Mongoose schemas (User, Task)
│   │   ├── routes/          # API route definitions with Swagger JSDoc
│   │   └── server.js        # Express app entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, TaskModal
│   │   ├── context/         # AuthContext (React Context API)
│   │   ├── pages/           # Login, Register, Dashboard
│   │   ├── services/        # Axios API client with interceptors
│   │   ├── App.jsx          # Router setup with protected routes
│   │   └── main.jsx         # React entry point
│   ├── index.html
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+ installed
- **MongoDB** running locally or a MongoDB Atlas connection string

### 1. Clone the repository

```bash
git clone <repo-url>
cd <project-folder>
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file (or copy from `.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

Start the backend server:

```bash
npm run dev
```

The API will be running at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be running at `http://localhost:3000`.

---

## API Endpoints

### Auth Routes

| Method | Endpoint               | Access  | Description              |
|--------|------------------------|---------|--------------------------|
| POST   | `/api/v1/auth/register`| Public  | Register a new user      |
| POST   | `/api/v1/auth/login`   | Public  | Login & receive JWT      |
| GET    | `/api/v1/auth/me`      | Private | Get current user profile |
| GET    | `/api/v1/auth/users`   | Admin   | List all users (paginated)|

### Task Routes

| Method | Endpoint              | Access  | Description                       |
|--------|-----------------------|---------|-----------------------------------|
| GET    | `/api/v1/tasks`       | Private | Get tasks (user: own, admin: all) |
| POST   | `/api/v1/tasks`       | Private | Create a new task                 |
| GET    | `/api/v1/tasks/:id`   | Private | Get a single task                 |
| PUT    | `/api/v1/tasks/:id`   | Private | Update a task                     |
| DELETE | `/api/v1/tasks/:id`   | Private | Delete a task                     |

### Query Parameters (GET /tasks)

- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)
- `status` - Filter: `pending`, `in-progress`, `completed`
- `priority` - Filter: `low`, `medium`, `high`

---

## API Documentation (Swagger)

Once the backend is running, visit:

**http://localhost:5000/api-docs**

Interactive Swagger UI lets you test all endpoints directly in the browser.

---

## Database Schema

### User

| Field     | Type   | Description                |
|-----------|--------|----------------------------|
| name      | String | Required, max 50 chars     |
| email     | String | Required, unique, validated|
| password  | String | Hashed with bcrypt (12 rounds)|
| role      | String | `user` (default) or `admin`|
| createdAt | Date   | Auto-generated             |

### Task

| Field       | Type     | Description                              |
|-------------|----------|------------------------------------------|
| title       | String   | Required, max 100 chars                  |
| description | String   | Optional, max 500 chars                  |
| status      | String   | `pending`, `in-progress`, `completed`    |
| priority    | String   | `low`, `medium`, `high`                  |
| dueDate     | Date     | Optional                                 |
| user        | ObjectId | Reference to User (owner)                |
| createdAt   | Date     | Auto-generated                           |

---

## Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Authentication**: Tokens in `Authorization: Bearer <token>` header
- **Role-Based Access Control**: `user` and `admin` roles with middleware guard
- **Input Validation**: express-validator on all endpoints
- **MongoDB Injection Prevention**: express-mongo-sanitize
- **HTTP Security Headers**: helmet
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **HTTP Parameter Pollution Prevention**: hpp
- **Request Size Limiting**: 10kb max JSON body
- **CORS Configuration**: Configurable origin policy

---

## Scalability Notes

### Current Architecture

The application follows a **modular monolith** pattern with clear separation of concerns, making it straightforward to scale:

### Horizontal Scaling Strategies

1. **Microservices Decomposition**: The modular structure (auth module, task module) allows easy extraction into independent microservices. Each module has its own controller, routes, and validation — ready for service boundaries.

2. **Database Scaling**:
   - MongoDB supports **replica sets** for read scaling and high availability
   - **Sharding** can distribute data across multiple servers for write scaling
   - Database indexes on `user` and `status` fields are already in place for query optimization

3. **Caching Layer (Redis)**:
   - Add Redis for session/token caching to reduce DB lookups
   - Cache frequently accessed task lists with TTL-based invalidation
   - Use Redis as a rate-limiter store for distributed deployments

4. **Load Balancing**:
   - Stateless JWT auth allows any server instance to handle any request
   - Deploy behind **Nginx** or **AWS ALB** for request distribution
   - Use **PM2 cluster mode** for multi-core utilization on a single server

5. **Containerization & Orchestration**:
   - Dockerize both frontend and backend
   - Use **Docker Compose** for local multi-service development
   - Deploy on **Kubernetes** for auto-scaling, self-healing, and rolling updates

6. **API Gateway**:
   - Introduce an API gateway (Kong, AWS API Gateway) for routing, throttling, and monitoring
   - API versioning (`/api/v1/`) is already in place for backward compatibility

7. **Monitoring & Logging**:
   - Add structured logging (Winston/Pino) for centralized log aggregation (ELK Stack)
   - Integrate APM tools (New Relic, Datadog) for performance monitoring

### Deployment Readiness

```
Docker Compose (dev) → CI/CD Pipeline → Container Registry → Kubernetes (prod)
```

The project is structured for a smooth transition from monolith to microservices as traffic grows.

---

## Frontend Features

- **Register & Login** pages with form validation and error display
- **Protected Dashboard** (redirects to login if no JWT)
- **Full CRUD** for tasks: create, view, edit, delete
- **Filtering** by status and priority
- **Pagination** for task lists
- **Role-aware UI** (admin sees task owners, user sees own tasks)
- **Success/error toast messages** from API responses

---

## License

ISC
