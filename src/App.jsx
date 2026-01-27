import { BrowserRouter, Route, Routes } from "react-router-dom";
import Registration from "./components/Registration";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgetPassword";
import Home from "./components/Home";
import AdminHome from "./components/AdminHome";
import SellerHome from "./components/SellerHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/adminHome" element={<AdminHome />} />
        <Route path="/sellerHome" element={<SellerHome />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
