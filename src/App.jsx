import { BrowserRouter, Route, Routes } from "react-router-dom";
import Registration from "./components/Registration";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgetPassword";
import Home from "./components/Home";
import AdminHome from "./components/AdminHome";
import SellerHome from "./components/SellerHome";
import AdminRequest from "./components/AdminRequest";
import CategoryManagement from "./components/CategoryManagement";
import ProductManagement from "./components/ProductManagement";
import Categories from "./components/Categories";
import Products from "./components/Products";
import MyRentals from "./components/MyRentals";
import About from "./components/About";
import RentalActions from "./components/RentalActions";
import SellerEarnings from "./components/SellerEarnings";
import EditBuyer from "./components/EditBuyer";
import BuyerManagement from "./components/BuyerManagement";
import SellerManagement from "./components/SellerManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/editProfile" element={<EditBuyer />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products" element={<Products />} />
        <Route path="/myRentals" element={<MyRentals />} />
        <Route path="/about" element={<About />} />
        <Route path="/adminHome" element={<AdminHome />} />
        <Route path="/adminRequest" element={<AdminRequest />} />
        <Route path="/category" element={<CategoryManagement />} />
        <Route path="/buyerManagement" element={<BuyerManagement />} />
        <Route path="/sellerManagement" element={<SellerManagement />} />
        <Route path="/sellerHome" element={<SellerHome />} />
        <Route path="/productManagement" element={<ProductManagement />} />
        <Route path="/rentalActions" element={<RentalActions />} />
        <Route path="/earnings" element={<SellerEarnings />} />
 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
