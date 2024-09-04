import "./App.css";
import 'bootstrap/dist/css/bootstrap.css';
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import { Toaster } from "react-hot-toast";
import ProductDetails from "./components/product/ProductDetails";
 
function App() {
  return (
    <Router>
      <div className="App">
       
        <Header />
        <Toaster position="top-center" />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/:id" element={<ProductDetails />}/>
             
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;