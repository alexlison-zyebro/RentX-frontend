import { Route, Routes } from "react-router-dom";

function App() {
  return (
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
      <Route path="/adminRentals" element={<AdminRentals />} />
      <Route path="/sellerHome" element={<SellerHome />} />
      <Route path="/productManagement" element={<ProductManagement />} />
      <Route path="/rentalActions" element={<RentalActions />} />
      <Route path="/earnings" element={<SellerEarnings />} />

      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
