import { Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import LandingPage from './layout/LandingPage'; 
import LayoutDashboard from './layout/DashboardAdmin';
import LayoutBeranda from './layout/DashboardClient';
// landingpage
import Home from './pages/Landingpage/Home';
import Clotches from './pages/Landingpage/Clotches'
import Details from './components/Landingpage/Details'
import { CartProvider } from './context/CartContext';
import Cart from './pages/Landingpage/Cart';
// dashboard
import Dashboard from './pages/Dashboard/Dashboard';
import Product from './pages/Dashboard/Product';
import ProductDetails from './pages/Dashboard/ProductDetails';
import Settings from './pages/Dashboard/Settings';
// beranda client
import InformasiAkun from './pages/Beranda/Akun';
// Auth
import Masuk from "./Auth/Login";
import Register from "./Auth/Registrasi";
import CreateShop from "./Auth/CreateShop";
import Shoes from './pages/Landingpage/Shoes';


function App() {
  return (
    <CartProvider>
      <div className="overflow-hidden w-full">
        <Toaster position="top-right" />

        <Routes>
          {/* Landingpage */}
          <Route element={<LandingPage />}>
            <Route path="/" element={<Home />} />
            <Route path="/Clotches" element={<Clotches />} />
            <Route path="/Shoes" element={<Shoes />} />
            <Route path="/Details/:id" element={<Details />} />
            <Route path="/Cart" element={<Cart />} />
          </Route>

          {/* Dashboard */}
          <Route element={<LayoutDashboard />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/product" element={<Product />} />
            <Route path="/products/details/:id" element={<ProductDetails />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Beranda Client */}
          <Route element={<LayoutBeranda />}>
            <Route path="Beranda" element={<InformasiAkun />} />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<Masuk />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-shop" element={<CreateShop />} />
        </Routes>
      </div>
    </CartProvider>
  );
}


export default App;