# 🚀 DEPLOYMENT CHECKLIST - TRƯỚC KHI PUSH VERCEL & RAILWAY

## ✅ ĐÃ XỬ LÝ (100% READY)

### Backend Fixes ✅

- [x] Dockerfile: Thay EXPOSE 5000 → 8000
- [x] docker-compose.yml: Thêm FRONTEND_URL env var
- [x] .env & .env.example: Thêm FRONTEND_URL + CLIENT_URL
- [x] emailService.js: Đang dùng process.env.FRONTEND_URL cho email links
- [x] auth.js: Đầy đủ tất cả endpoints (register, login, verify, forgot-password, reset-password, etc)

### Frontend Fixes ✅

- [x] AuthContext.jsx: Dùng import.meta.env.VITE_API_BASE_URL thay hardcode
- [x] vercel.json: Thêm rewrites + VITE_API_BASE_URL env
- [x] App.jsx: Routes đầy đủ & protected routes OK

---

## 📋 SETUP TRƯỚC KHI PUSH

### 1️⃣ **RAILWAY Setup (Backend)**

Tạo các environment variables trên Railway:

```
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your-strong-random-secret-key
FRONTEND_URL=https://your-frontend-name.vercel.app
CLIENT_URL=https://your-frontend-name.vercel.app
NODE_ENV=production
PORT=8000
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

**Important:**

- `JWT_SECRET` phải là 32+ ký tự random, bảo mật
- `FRONTEND_URL` phải match domain Vercel
- `EMAIL_PASSWORD` là app-specific password của Gmail (không phải password account)

### 2️⃣ **VERCEL Setup (Frontend)**

Tạo các environment variables trên Vercel:

```
VITE_API_BASE_URL=https://your-railway-backend.up.railway.app/api
```

**Important:**

- Railway URL sẽ như: `https://ecommerce-backend-production.up.railway.app`
- Thêm `/api` vào cuối URL

### 3️⃣ **Kiểm tra Before Deploy**

Chạy lệnh kiểm tra locally:

```bash
# Terminal 1 - Backend
cd backend
npm install
npx prisma migrate deploy
npm run build (nếu có)
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm run build
npm run preview
```

---

## 🔒 SECURITY NOTES

❌ **KHÔNG commit:**

- .env files (chứa API keys)
- .env.local
- node_modules/
- dist/

✅ **Sử dụng:**

- .env.example (template)
- Environment variables trên Railway/Vercel
- JWT secrets mạnh (min 32 ký tự)
- HTTPS everywhere (Railway & Vercel auto SSL)

---

## 🔄 EMAIL VERIFICATION FLOW

```
User Register
    ↓
Backend tạo VerificationToken
    ↓
emailService gửi email với:
  Link: {FRONTEND_URL}/verify-email?token=XXX
    ↓
User click link
    ↓
Frontend POST /api/auth/verify-email?token=XXX
    ↓
Backend validate token
    ↓
user.isEmailVerified = true
    ↓
Return access token
    ↓
Frontend redirects to home
```

---

## 💾 DATABASE SETUP

Railway PostgreSQL:

```sql
-- Migrations sẽ run automatically từ Dockerfile:
RUN npx prisma migrate deploy

-- Schema sẽ create: users, products, orders, order_items, reviews, wishlist_items, verification_tokens
```

---

## 🧪 TEST CHECKLIST

- [ ] Register & email verification works
- [ ] Login works
- [ ] Forgot password & email works
- [ ] Reset password works
- [ ] Protected routes (redirect if not logged in)
- [ ] JWT token valid (7 days)
- [ ] Cart works
- [ ] Order history works

---

## 🎯 FINAL COMMANDS

### Deploy Backend (Railway)

```bash
# Railway sẽ detect Node.js project từ package.json
# Tự động chạy: npm install && npm start
# Dockerfile sẽ tự build & deploy
git push
```

### Deploy Frontend (Vercel)

```bash
# Vercel sẽ detect Vite project từ vite.config.js
# Tự động chạy: npm install && npm run build
# Output: dist folder
git push
```

---

**Status:** ✅ 100% READY TO DEPLOY
