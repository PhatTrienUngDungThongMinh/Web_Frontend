import { Route, Routes } from "react-router-dom";
import {CustomerLogin, Fmember, HomePage, ListProducts, LookOrders, PaymentInfo, ProductDetails, ShoppingCart, CustomerRegister ,ForgotPassword, CatalogSearch, ListOfProductsByCategory } from "./index";
import { path } from "../../utils/constant";
import { CartProvider } from "./ShoppingCart/CartContext";
import {  ListProductProvider } from "./Product/ListProductsContext";
const CustomerRoutes = () => (
    <ListProductProvider>
        <CartProvider>
            <Routes>
                <Route path={path.HOMEPAGE} element={<HomePage />} />
                <Route path={path.LISTPRODUCTS} element={<ListProducts />} />
                <Route path={path.LOOKORDERS} element={<LookOrders />} />
                <Route path={`${path.PRODUCTSDETAILS}/:productId`} element={<ProductDetails />} />
                <Route path={path.SHOPPINGCART} element={<ShoppingCart />} />
                <Route path={path.CUSTOMERREGISTER} element={<CustomerRegister />} />
                <Route path={path.CUSTOMERLOGIN} element={<CustomerLogin />} />
                <Route path={path.FMEMBER} element={<Fmember />} />
                <Route path={path.FORGOTPASSWORD} element={<ForgotPassword />} />
                <Route path={path.PAYMENTINFO} element={<PaymentInfo />} />
                <Route path={path.CATALOGSEARCH} element={<CatalogSearch />} />
                <Route path={path.LISTOFPRODUCTSBYCATEGORY} element={<ListOfProductsByCategory />} />
            </Routes>
        </CartProvider>
    </ListProductProvider>
);
export default CustomerRoutes;