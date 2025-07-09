# Serendib Plaza - Shopping Mall Application

A full-stack shopping mall application with React frontend and Node.js backend, featuring automated CI/CD deployment to Vercel.

## 🚀 Live Demo
- **Production**: [https://your-app-name.vercel.app](https://your-app-name.vercel.app)
- **API Docs**: [https://your-app-name.vercel.app/api](https://your-app-name.vercel.app/api)

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- Framer Motion
- React Router Dom
- Heroicons

### Backend
- Node.js + Express
- MongoDB Atlas
- JWT Authentication
- Multer (File uploads)
- bcryptjs

### Deployment
- Vercel (Full-stack hosting)
- GitHub Actions (CI/CD)
- MongoDB Atlas (Database)

## 📁 Project Structure

```
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── context/           # React context
│   └── utils/             # Utility functions
├── server/                # Node.js backend
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── controller/        # Route controllers
│   └── utils/             # Server utilities
├── .github/workflows/     # GitHub Actions
└── vercel.json           # Vercel configuration
```

## 🔧 Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Shopping-Mall
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install
   ```

3. **Environment variables**
   Create `server/.env`:
   ```env
   MONGO=mongodb+srv://username:password@cluster.mongodb.net/dbname
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   ```

4. **Start development servers**
   ```bash
   # Frontend (port 5173)
   npm run dev
   
   # Backend (port 3000) - in another terminal
   cd server && npm run dev
   ```

## 🚀 Deployment

### Automatic Deployment (Recommended)

The project uses GitHub Actions for automated CI/CD:

1. **Push to main branch** → Production deployment
2. **Open Pull Request** → Preview deployment
3. **Merge PR** → Automatic production update

### Manual Deployment

```bash
# Deploy to production
npm run deploy

# Deploy preview
npm run deploy:preview
```

### Setup CI/CD

1. **Push code to GitHub**
2. **Install Vercel CLI**: `npm install -g vercel`
3. **Login**: `vercel login`
4. **Link project**: `vercel link`
5. **Add GitHub Secrets**:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

## 🔐 Environment Variables

Add these in Vercel Dashboard:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `NODE_ENV` | Environment | `production` |
| `FRONTEND_URL` | Frontend URL | `https://your-app.vercel.app` |

## 🌟 Features

- **User Authentication** (Customer/Seller/Admin)
- **Shop Management** (Create, Edit, View shops)
- **Product Catalog** (Browse by categories)
- **Promotions System** (Special offers)
- **QR Code Scanner** (Quick access)
- **Dark/Light Mode** (Theme switching)
- **Responsive Design** (Mobile-first)
- **File Uploads** (Shop logos, product images)

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Shops
- `GET /api/shops` - Get all shops
- `POST /api/shops` - Create shop
- `PUT /api/shops/:id` - Update shop
- `DELETE /api/shops/:id` - Delete shop

### Products
- `GET /api/product` - Get all products
- `POST /api/product` - Create product
- `PUT /api/product/:id` - Update product

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email info@serendibplaza.lk or create an issue in this repository.

---

Made with ❤️ by the Serendib Plaza team
