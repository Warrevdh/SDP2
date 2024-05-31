import Navbar from "./components/navbar";
import Footer from "./components/footer";
import NotFound from "./components/notfound";

import ProfileOverview from "./pages/profileOverview";
import ShoppingcartOverview from "./pages/shoppingcartOverview";
import ProductPage from "./pages/productPage";
import ProductList from "../src/components/products/index.jsx"
import OrderPage from "./pages/orderPage";
import TrackTracePage from "./pages/trackTracePage";
import PlaceOrderPage from "./pages/placeOrderPage";

import RequireAuth from "./components/authentication/RequireAuth";

import { Routes, Route } from 'react-router-dom';
function App() {
          
  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <main>
        <Routes>
          <Route index element={<ProductList />} />
          <Route path="profile" element={<ProfileOverview />} />
        <Route path="/shoppingCart" element={<ShoppingcartOverview />} />
          <Route path="productPage/:productId" element={<ProductPage />} />
          <Route path="order/:orderId" element={<OrderPage />} />
          <Route path="track-&-trace" element={<TrackTracePage />} />
          <Route path="placeOrder" element={
            <RequireAuth>
              <PlaceOrderPage />
            </RequireAuth>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default App;
