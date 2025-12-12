# 🚀 NEXT STEPS - Setup & Testing Guide

## 1️⃣ Run Prisma Migration

After all code fixes, you need to update the database with the new schema:

```bash
# Navigate to backend directory
cd backend

# Create migration for email verification
npx prisma migrate dev --name add_email_verification

# This will:
# ✅ Add isEmailVerified field to users table
# ✅ Create verification_tokens table
# ✅ Set up all indexes
```

If you get any errors during migration, check:

- PostgreSQL is running
- `DATABASE_URL` is correctly set in `.env`
- No SQL syntax errors in schema

---

## 2️⃣ Verify Backend Runs

```bash
# Start backend server
npm run dev

# Should output:
# ✅ Server running on port 5000
# ✅ Email service connected successfully
# ✅ Backend server is running
```

Check the routes are accessible:

```bash
# Test API health
curl http://localhost:5000/api/health
# Expected: { message: "✅ Backend server is running" }
```

---

## 3️⃣ Setup Email Service

Before testing email flows, configure Gmail:

### Get Gmail App Password

1. Enable 2FA on your Gmail account
2. Go to: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Copy the 16-character password
5. Update `.env` in backend:

```bash
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx    # Copy paste from Google
FRONTEND_URL=http://localhost:5173
```

6. Restart backend with new `.env` values

---

## 4️⃣ Test Email Verification Flow

### Using curl or Postman:

**Step 1: Register User**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "confirmPassword": "Password123!"
  }'

# Expected response:
{
  "message": "User registered successfully. Please verify your email.",
  "tempToken": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isEmailVerified": false
  }
}
```

Check your inbox for verification email!

**Step 2: Get Verification Token**

- Check email for link: `http://localhost:5173/verify-email?token=XXXXX`
- OR check backend logs for the token
- OR query database: `SELECT token FROM verification_tokens WHERE type='email_verification' LIMIT 1;`

**Step 3: Verify Email**

```bash
curl -X POST http://localhost:5000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your_token_here"
  }'

# Expected response:
{
  "message": "Email verified successfully",
  "accessToken": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "isEmailVerified": true
  }
}
```

---

## 5️⃣ Test Password Reset Flow

**Step 1: Request Password Reset**

```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'

# Expected response:
{
  "message": "If email exists, password reset link has been sent"
}
```

Check email or backend logs for reset token!

**Step 2: Get Reset Token**

- Check email for link: `http://localhost:5173/reset-password?token=XXXXX`
- OR check database: `SELECT token FROM verification_tokens WHERE type='password_reset' LIMIT 1;`

**Step 3: Reset Password**

```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "your_token_here",
    "newPassword": "NewPassword456!",
    "confirmPassword": "NewPassword456!"
  }'

# Expected response:
{
  "message": "Password reset successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Step 4: Login with New Password**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "NewPassword456!"
  }'

# Expected response:
{
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## 6️⃣ Frontend Testing

### Start Frontend Server

```bash
cd frontend
npm run dev
# Should run on http://localhost:5173
```

### Test Registration

1. Go to `http://localhost:5173/register`
2. Fill in form: Name, Email, Password
3. Click Register
4. Should see: "Please check your email to verify"
5. Check browser localStorage - should have temp token

### Test Email Verification

1. Check your email inbox
2. Click verification link
3. Should be redirected to home page
4. localStorage should now have real access token
5. Can now login with verified email

### Test Password Reset

1. Go to Login page
2. Click "Forgot password?"
3. Enter your email
4. Check email for reset link
5. Click link in email
6. Enter new password
7. Should be redirected to login
8. Login with new password should work

---

## ⚠️ Troubleshooting

### Email not sending

```
Problem: "Email service error"
Solution:
- Check Gmail app password is correct
- Check 2FA is enabled
- Check FRONTEND_URL is set
- Check server has internet connection
```

### Database migration fails

```
Problem: "relation 'users' already exists"
Solution:
- Schema was already applied
- Safe to ignore - migration already done
```

### Token invalid/expired

```
Problem: "Token has expired" or "Invalid token"
Solution:
- Tokens expire after 15 minutes
- Re-request password reset or verification
- Check token wasn't already used
```

### CORS errors

```
Problem: "Not allowed by CORS"
Solution:
- Check CLIENT_URL in backend .env
- Should be http://localhost:5173 for dev
- Restart backend after changing .env
```

---

## ✅ Final Checklist

After running all tests:

- [ ] Database migration successful
- [ ] Backend server starts without errors
- [ ] Email service connected
- [ ] Registration works
- [ ] Verification email received
- [ ] Email verification successful
- [ ] Can login after verification
- [ ] Forgot password email received
- [ ] Password reset successful
- [ ] Can login with new password
- [ ] Frontend pages load correctly
- [ ] LocalStorage tokens save correctly

---

## 🎉 Success!

When all steps complete successfully:
✅ **Email verification system is fully operational**
✅ **Password reset system is fully operational**
✅ **Frontend and Backend are integrated**

You're ready for:

- User testing
- Deployment
- Production launch
