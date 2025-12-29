import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Unauthorized from "./UtilityFolder/Unauthorized";

import Logging from "./AuthFolder/Logging";
import Registration from "./AuthFolder/Registration";
import Layout from "./Layout/Layout";
import { TokenDeconder } from "./UtilityFolder/TokenDecoder";
import { TokenValidator } from "./UtilityFolder/TokenValidatorChecker";
import Shop from "./Protected/Global/Shop/Shop";
import Details from "./Protected/Global/Details/Details";
import Home from "./Protected/Global/Home/Home";
import Favorites from "./Protected/Global/Favorites/Favorites";
import Profile from "./Protected/Global/Profile/Profile";
import Protected from "./UtilityFolder/Protected";
import Dashbord from "./Protected/Admin/Dashbord";
import ProductDashbord from "./Protected/Admin/Product/ProductDashbord";
import Category from "./Protected/Admin/Category/Category";
import Cart from "./Protected/Global/Cart/Cart/Cart";
import Summary from "./Protected/Global/Cart/Summary/Summary";
import CreateProduct from "./Protected/Admin/Product/CreateProduct";
import UpdateProduct from "./Protected/Admin/Product/UpdateProduct";
import DeleteProduct from "./Protected/Admin/Product/DeleteProduct";
import CreateCategory from "./Protected/Admin/Category/CreateCategory";
import EditCategory from "./Protected/Admin/Category/EditCategory";
import DeleteCategory from "./Protected/Admin/Category/DeleteCategory";
import User from "./Protected/Admin/User/User";
import OrderUserDetails from "./Protected/Admin/Order User Details/OrderUserDetails";
import Payment from "./Protected/Global/Payment/Payment";
import MyOrders from "./Protected/Global/My Order/MyOrders";
import PaymentSuccessfull from "./Payment/PaymentSuccessfull";
import RecoveryEmail from "./Protected/Global/Reset Password/RecoveryEmail";
import OTP from "./Protected/Global/Reset Password/OTP";
import NewPass from "./Protected/Global/Reset Password/NewPass";
import ClinetOrder from "./Protected/Employee/ClinetOrder";
import Notification from "./Protected/Global/Notification/Notification";
function App() {
  useEffect(() => {
    TokenValidator();
  }, []);
  useEffect(() => {
    // ১. রাইট-ক্লিক মেনু বন্ধ করা
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // ২. কিবোর্ড শর্টকাট বন্ধ করা (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U)
    const handleKeyDown = (e) => {
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
        (e.ctrlKey && e.keyCode === 85) // Ctrl+U (View Source)
      ) {
        e.preventDefault();
        alert("Security Reason: Inspect element is disabled!");
      }
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  TokenDeconder();
  TokenValidator();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="unathorized" element={<Unauthorized />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="Shop" element={<Shop />} />
          <Route
            path="Details"
            element={
              <Protected
                currentRoles={["Admin", "Client", "Employee", "Donar"]}
              >
                <Details />
              </Protected>
            }
          />
          <Route
            path="Favorites"
            element={
              <Protected
                currentRoles={["Admin", "Client", "Employee", "Donar"]}
              >
                <Favorites />
              </Protected>
            }
          />
          <Route
            path="Profile"
            element={
              <Protected
                currentRoles={["Admin", "Client", "Employee", "Donar"]}
              >
                <Profile />
              </Protected>
            }
          />
          <Route
            path="Dashbord"
            element={
              <Protected
                currentRoles={["Admin", "Client", "Employee", "Donar"]}
              >
                <Dashbord />
              </Protected>
            }
          />
          <Route
            path="ProductDashbord"
            element={
              <Protected currentRoles={["Admin"]}>
                <ProductDashbord />
              </Protected>
            }
          />
          <Route
            path="CreateProduct"
            element={
              <Protected currentRoles={["Admin"]}>
                <CreateProduct />
              </Protected>
            }
          />
          <Route
            path="UpdateProduct"
            element={
              <Protected currentRoles={["Admin"]}>
                <UpdateProduct />
              </Protected>
            }
          />
          <Route
            path="deleteProduct"
            element={
              <Protected currentRoles={["Admin"]}>
                <DeleteProduct />
              </Protected>
            }
          />
          <Route
            path="CategoryDashbord"
            element={
              <Protected currentRoles={["Admin"]}>
                <Category />
              </Protected>
            }
          />
          <Route
            path="CreateCategory"
            element={
              <Protected currentRoles={["Admin"]}>
                <CreateCategory />
              </Protected>
            }
          />
          <Route
            path="UpdateCategory"
            element={
              <Protected currentRoles={["Admin"]}>
                <EditCategory />
              </Protected>
            }
          />
          <Route
            path="DeleteCategory"
            element={
              <Protected currentRoles={["Admin"]}>
                <DeleteCategory />
              </Protected>
            }
          />

          <Route
            path="AllUser"
            element={
              <Protected currentRoles={["Admin"]}>
                <User />
              </Protected>
            }
          />
          <Route
            path="Delivery"
            element={
              <Protected currentRoles={["Employee"]}>
                <ClinetOrder />
              </Protected>
            }
          />

          <Route
            path="OrderUserDetails"
            element={
              <Protected currentRoles={["Admin"]}>
                <OrderUserDetails />
              </Protected>
            }
          />

          <Route
            path="Cart"
            element={
              <Protected
                currentRoles={["Admin", "Client", "Employee", "Donar"]}
              >
                <Cart />
              </Protected>
            }
          />
          <Route
            path="Summary"
            element={
              <Protected
                currentRoles={["Admin", "Client", "Employee", "Donar"]}
              >
                <Summary />
              </Protected>
            }
          />

          <Route
            path="Payment"
            element={
              <Protected
                currentRoles={["Admin", "Client", "Employee", "Donar"]}
              >
                <Payment />
              </Protected>
            }
          />

          <Route
            path="PaymentSuceessfull"
            element={
              <Protected
                currentRoles={["Admin", "Client", "Employee", "Donar"]}
              >
                <PaymentSuccessfull />
              </Protected>
            }
          />
          <Route
            path="MyOrder"
            element={
              <Protected
                currentRoles={["Admin", "Client", "Employee", "Donar"]}
              >
                <MyOrders />
              </Protected>
            }
          />
          <Route
            path="Notification"
            element={
              // <Protected
              // currentRoles={["Admin", "Client", "Employee", "Donar"]}
              //>
              <Notification />
              //</Protected>
            }
          />

          <Route path="RecoveryEmail" element={<RecoveryEmail />} />
          <Route path="Otp" element={<OTP />} />
          <Route path="newPass" element={<NewPass />} />

          <Route path="Loggin" element={<Logging />} />
          <Route path="Resgister" element={<Registration />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
