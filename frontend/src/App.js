import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.css';
import "./App.css"
import { BrowserRouter as Router, Routes ,Route} from "react-router-dom";

import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import { Toaster } from "react-hot-toast";
import useUserRoutes from '../src/components/routes/UserRoutes'
import useAdminRoutes from '../src/components/routes/AdminRoutes'
import NotFound from "./components/layouts/NotFound";
function App() {

  const userRoutes = useUserRoutes()
  const adminRoutes = useAdminRoutes()
  return (
    <Router>
      <div className="App">
       
        <Header />
        <Toaster position="top-center" />
        <div className="container">
          <Routes>
            { 
              userRoutes
              
            }
            {
              adminRoutes
            }
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;