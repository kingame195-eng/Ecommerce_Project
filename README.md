# MyShop - E-Commerce Platform

A full-stack e-commerce web application built with modern technologies for selling products online with features like user authentication, product catalog, shopping cart, and order management.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [Contributing](#contributing)

## ✨ Features

- **User Authentication**: Register, login, email verification, password reset
- **Product Management**: Browse products, search, filter, pagination
- **Shopping Cart**: Add/remove items, manage quantities
- **Order Management**: Place orders, view order history
- **Email Service**: Email notifications for orders and account verification
- **Responsive Design**: Mobile-friendly UI with modern styling
- **Admin Features**: Product management (backend ready)

## 🛠 Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: Nodemailer

### Frontend

- **Framework**: React.js
- **Build Tool**: Vite
- **State Management**: Context API
- **Styling**: CSS3
- **HTTP Client**: Axios
- **Routing**: React Router

### DevOps

- **Containerization**: Docker & Docker Compose
- **Version Control**: Git

## 📁 Project Structure

```
MyShop_Project/
├── .github/                      # GitHub workflows & CI/CD
├── docs/                         # Documentation files
│   ├── EMAIL_SERVICE_GUIDE.md
│   ├── PAGINATION_ADVANCED_SEARCH_GUIDE.md
│   ├── SETUP_AND_TESTING_GUIDE.md
│   └── FINAL_STATUS.md
├── scripts/                      # Deployment & utility scripts
│   ├── deploy.bat
│   ├── deploy.sh
│   ├── disable-ime.bat
│   └── disable-ime.ps1
├── backend/                      # Backend API server
│   ├── src/
│   │   ├── server.js
│   │   ├── prisma.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── products.js
│   │   │   └── orders.js
│   │   ├── services/
│   │   │   └── emailService.js
│   │   └── utils/
│   │       └── tokenUtils.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.js
│   │   └── migrations/
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── frontend/                     # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
├── docker-compose.yml            # Docker services configuration
├── .gitignore
├── package.json                  # Root package.json (optional)
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (or use Docker)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/kingame195-eng/MyShop_Project.git
   cd MyShop_Project
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   cp .env.example .env.local
   # Update .env.local with your configuration
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

#### Backend (.env.local)

```
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
PORT=8000
```

#### Frontend (.env.local)

```
VITE_API_URL=http://localhost:8000/api
```

## 💻 Development

### Run Locally (Without Docker)

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
# or: npm start
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

Access the application at:

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API: http://localhost:8000/api

### Run with Docker

```bash
docker-compose up --build
```

This will start:

- PostgreSQL on port 5432
- Backend on port 8000
- Frontend on port 5173

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📦 Deployment

### Using Docker Compose

```bash
scripts/deploy.sh          # Linux/Mac
scripts/deploy.bat         # Windows
```

### Manual Deployment

1. **Build images**

   ```bash
   docker build -t myshop-backend ./backend
   docker build -t myshop-frontend ./frontend
   ```

2. **Push to registry** (Docker Hub, ECR, etc.)

   ```bash
   docker tag myshop-backend your-registry/myshop-backend:latest
   docker push your-registry/myshop-backend:latest
   ```

3. **Deploy to server**
   - Update docker-compose.yml with your image URLs
   - Run: `docker-compose up -d`

## 📚 Documentation

For detailed documentation, see the [docs/](docs/) folder:

- [Setup & Testing Guide](docs/SETUP_AND_TESTING_GUIDE.md) - Detailed setup instructions
- [Email Service Guide](docs/EMAIL_SERVICE_GUIDE.md) - Email configuration & setup
- [Pagination & Advanced Search](docs/PAGINATION_ADVANCED_SEARCH_GUIDE.md) - Feature implementation
- [Final Status](docs/FINAL_STATUS.md) - Project completion status

## 🔐 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Environment variables for sensitive data
- CORS configured for security
- Email verification for account confirmation

## 📝 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Initiate password reset
- `POST /api/auth/reset-password` - Reset password with token

### Product Endpoints

- `GET /api/products` - Get all products with pagination
- `GET /api/products/:id` - Get product details
- `GET /api/products/search` - Search products

### Order Endpoints

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👨‍💻 Author

**kingame195-eng**

- GitHub: [@kingame195-eng](https://github.com/kingame195-eng)

## 📞 Support

For issues and questions:

- Create an issue on [GitHub Issues](https://github.com/kingame195-eng/MyShop_Project/issues)
- Contact via email

## 🗺 Roadmap

- [ ] Admin dashboard
- [ ] Payment integration (Stripe/PayPal)
- [ ] Product reviews & ratings
- [ ] Wishlist feature
- [ ] Inventory management
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode

---
