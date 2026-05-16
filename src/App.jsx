import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import Details from './pages/Details'
import Mainlayout from './layouts/MainLayout'
import ScrollToTop from './components/ScrollToTop'
import CartDrawer from './pages/CartDrawer'
import Blog from './pages/Blog_Detail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Checkout from './pages/Checkout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import MyOrders from './pages/MyOrders'
import Profile from './pages/Profile'
import OrderDetails from './pages/OrderDetails'
import { Toaster } from 'react-hot-toast'

// Admin Components
import AdminLayout from './admin/AdminLayout'
import Dashboard from './admin/pages/Dashboard'
import ProductsPage from './admin/components/Products'
import OrdersPage from './admin/components/Orders'
import CustomersPage from './admin/components/Customer'
import CategoriesPage from './admin/components/Categories'
import BrandsPage from './admin/components/Brands'
import BlogPage from './admin/components/Blog'
import SettingsPage from './admin/components/Settings'

function App() {
  return (
    <>
      <ScrollToTop />
      <Toaster position="bottom-center md:bottom-right" reverseOrder={false} toastOptions={{ className: 'app-toast' }} />
          

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* User Routes */}
        
        <Route element={<Mainlayout />}>          
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/details/:slug?" element={<Details />} />
          <Route path='/cart' element={<CartDrawer/>}/>
          <Route path='/checkout' element={<ProtectedRoute><Checkout/></ProtectedRoute>}/>
          <Route path='/orders' element={<ProtectedRoute><MyOrders/></ProtectedRoute>}/>
          <Route path='/orders/:orderId' element={<ProtectedRoute><OrderDetails/></ProtectedRoute>}/>
          <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
          
          <Route path='/blog' element={<Blog/>}/>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="brands" element={<BrandsPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
