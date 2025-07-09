import "./App.css";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/navbar";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/User/Home/HomePage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import PublicLayout from "./components/PublicLayout/PublicLayout";
import Shops from "./pages/User/Shops/Shops";
import Promotions from "./pages/User/Promotions/Promotions";
import AdminLayout from './pages/Admin/components/AdminLayout/AdminLayout';
import AdminDashboard from './pages/Admin/pages/AdminDashboard/AdminDashboard';
import ErrorPage from "./components/404/ErrorPage";
import QRcodePage from "./pages/User/QRcode/QRcodePage";
import PublicLayoutDark from './components/PublicLayout/PublicLayoutDark';
import Profile from "./pages/User/Profile/Profile";

import ShopDetail from "./pages/User/Shops/ShopDetail";
import BeautyShop from "./pages/User/Shops/BeautyShop";
import Bookshop from "./pages/User/Shops/Bookshop";
import Clothshop from "./pages/User/Shops/Clothshop";
import Createshop from "./pages/User/Shops/Createshop";
import UpdatebookShop from "./pages/User/Shops/UpdatebookShop";
import CreateClothshop from "./pages/User/Shops/CreateClothshop";
import UpdateClothshop from "./pages/User/Shops/UpdateClothshop";
import CreateBeutyshop from "./pages/User/Shops/CreateBeutyshop";
import UpdateBeautyshop from "./pages/User/Shops/UpdateBeautyshop";
import ProductList from "./pages/User/Shops/ProductList";
import CreateProduct from "./pages/User/Shops/CreateProduct";
import Updateproduct from "./pages/User/Shops/Updateproduct";

import PromotionList from "./pages/Admin/pages/Promotion/PromotionList";
import AddPromotion from "./pages/Admin/pages/Promotion/AddPromotion";
import ViewQRCode from "./pages/Admin/pages/Promotion/ViewQRCode";
import PromotionView from "./pages/Admin/pages/Promotion/PromotionView";
import EditPromotion from "./pages/Admin/pages/Promotion/EditPromotion";

// Seller Pages
import SellerDashboard from "./pages/Seller/SellerDashboard";
import AddItem from "./pages/Seller/AddItem";
import EditShop from "./pages/Seller/EditShop";

// Admin Pages
import ShopApproval from "./pages/Admin/ShopApproval";
import CreateAdmin from "./pages/Admin/CreateAdmin";

// Product Pages
import ProductDetail from "./pages/User/Products/ProductDetail";

import { AuthProvider } from "./context/AuthContext";
import { useDarkMode } from "./context/DarkModeContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const { isDarkMode } = useDarkMode();

  return (
    <ErrorBoundary>
      <Router>
        <div className={`${isDarkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} min-h-screen transition-colors duration-300`}>
          <AuthProvider>
            <ToastContainer 
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme={isDarkMode ? 'dark' : 'light'}
            />
            <Routes>
              {/* Public routes */}
              <Route
                path="/*"
                element={
                  <PublicLayout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/shops" element={<Shops />} />
                      <Route path="/promotions" element={<Promotions />} />
                      <Route path="/shop/:shopId" element={<ShopDetail />} />
                      <Route path="/product/:itemId" element={<ProductDetail />} />
                      <Route path="/BeautyShop" element={<BeautyShop />} />
                      <Route path="/BookShop" element={<Bookshop />} />
                      <Route path="/ClothShop" element={<Clothshop />} />
                      <Route path="/Createshop" element={
                        <ProtectedRoute>
                          <Createshop />
                        </ProtectedRoute>
                      } />
                      <Route path="/update-Bookshope/:updateId" element={
                        <ProtectedRoute>
                          <UpdatebookShop />
                        </ProtectedRoute>
                      } />
                      <Route path="/crateclothshop" element={
                        <ProtectedRoute>
                          <CreateClothshop />
                        </ProtectedRoute>
                      } />
                      <Route path="/update-clothshope/:updateCId" element={
                        <ProtectedRoute>
                          <UpdateClothshop />
                        </ProtectedRoute>
                      } />
                      <Route path="/createBeauty" element={
                        <ProtectedRoute>
                          <CreateBeutyshop />
                        </ProtectedRoute>
                      } />
                      <Route path="/update-beautyshope/:updateBId" element={
                        <ProtectedRoute>
                          <UpdateBeautyshop />
                        </ProtectedRoute>
                      } />
                      <Route path="/product/:productId/:shoptype" element={<ProductList />} />
                      <Route path="/createproduct/:creatId" element={
                        <ProtectedRoute>
                          <CreateProduct />
                        </ProtectedRoute>
                      } />
                      <Route path="/updateproduct/:updatePId" element={
                        <ProtectedRoute>
                          <Updateproduct />
                        </ProtectedRoute>
                      } />

                      {/* Profile route */}
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } />

                      {/* Auth routes */}
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />

                      <Route path="/qr-scan" element={<QRcodePage />} />

                      <Route path="*" element={<ErrorPage />} />

                    </Routes>
                  </PublicLayout>
                }
              />

              {/* Seller routes */}
              <Route
                path="/seller/*"
                element={
                  <ProtectedRoute requiredUserType="seller">
                    <PublicLayout>
                      <Routes>
                        <Route path="/" element={<Navigate to="dashboard" />} />
                        <Route path="dashboard" element={<SellerDashboard />} />
                        <Route path="edit-shop" element={<EditShop />} />
                        <Route path="add-item" element={<AddItem />} />
                        <Route path="edit-item/:itemId" element={<AddItem />} />
                        <Route path="*" element={<ErrorPage />} />
                      </Routes>
                    </PublicLayout>
                  </ProtectedRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminLayout>
                      <Routes>
                        <Route path="/" element={<Navigate to="dashboard" />} />
                        <Route path="/dashboard" element={<AdminDashboard />} />
                        <Route path="shop-approval" element={<ShopApproval />} />
                        <Route path="create-admin" element={<CreateAdmin />} />
                        <Route path="*" element={<ErrorPage />} />
                        <Route path="/promotion-list" element={<PromotionList />} />
                        <Route path="/promotion-add/:productId/:shopId/:shoptype" element={<AddPromotion />} />
                        <Route path="/promotion-edit/:promotionId" element={<EditPromotion />} />
                        <Route path="/promotion-qr-code/:id" element={<ViewQRCode />} />
                        <Route path="/promotion-view/:promotionId/:location" element={<PromotionView />} />
                      </Routes>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

function App() {
  return <AppContent />;
}

export default App;
