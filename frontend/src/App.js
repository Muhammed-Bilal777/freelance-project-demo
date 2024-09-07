import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.css';
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import { Toaster } from "react-hot-toast";
import ProductDetails from "./components/product/ProductDetails";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/user/Profile";
import UpdateProfile from "./components/user/UpdateProfile";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import UploadAvatar from "./components/user/UploadAvatar";
import UpdatePassword from "./components/user/UpdatePassword";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Cart from "./components/cart/Cart";
import Shipping from "./components/cart/Shipping";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import PaymentMethod from "./components/cart/PaymentMethod";
import MyOrders from "./components/orders/MyOrders";
import OrderDetails from "./components/orders/OrderDetail";
import Invoice from "./components/invoice/Invoice";
 
function App() {
  return (
    <Router>
      <div className="App">
       
        <Header />
        <Toaster position="top-center" />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/password/forgot" element={<ForgotPassword />} />
            <Route path="/password/reset/:token" element={<ResetPassword />} />
            <Route path="/products/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/me/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
            <Route path="/me/update_profile" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>}/>
            <Route path="/me/upload_avatar" element={<ProtectedRoute><UploadAvatar /></ProtectedRoute>}/>
            <Route path="/me/update_password" element={<ProtectedRoute><UpdatePassword/></ProtectedRoute>}/>

            <Route path="/cart" element={<Cart />} />
            <Route path="/shipping" element={<ProtectedRoute> <Shipping /> </ProtectedRoute>}/>
            

            <Route path="/confirm_order" element={<ProtectedRoute><ConfirmOrder /></ProtectedRoute> }/>
            <Route path="/payment_method" element={<ProtectedRoute><PaymentMethod /></ProtectedRoute> }/>
            <Route path="/me/orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute> }/>

            <Route path="/me/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute> }/>
            <Route path="/invoice/order/:id" element={<ProtectedRoute><Invoice /></ProtectedRoute> }/>
              
              
                
                  
                
             
            
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;