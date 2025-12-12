#!/bin/bash
# Deploy script cho Vercel
# Chạy: ./deploy.sh

echo "🚀 Bắt đầu deploy lên Vercel..."
echo ""

# 1. Build frontend
echo "📦 Building frontend..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Frontend build failed"
  exit 1
fi
cd ..

# 2. Deploy frontend
echo ""
echo "🌐 Deploying frontend to Vercel..."
vercel --prod

# 3. Show info
echo ""
echo "✅ Frontend deployed!"
echo ""
echo "📝 Next steps:"
echo "1. Set VITE_API_URL in Vercel Environment Variables"
echo "2. Make sure backend API is running"
echo "3. Test: https://your-project.vercel.app"
echo ""
echo "🔗 View deployment:"
echo "   https://vercel.com/dashboard"
