import { useState } from "react";
import Header from "../../../components/Client/Header";
import UserProfile from "./UserProfile";
import { NavLink, useNavigate } from "react-router-dom";
import { path } from "../../../utils/constant";
import FmenberHome from "./FmemberHome";  
import icons from "../../../utils/icons";
import PurchaseHistory from "./PurchaseHistory";
// import HistoryReturnProduct from "./HistoryReturnProduct";
import AddressCustomer from "./AddressCustomer";
function CustomerInformation() {
  const [activeComponent, setActiveComponent] = useState("home");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");

    setShowLogoutModal(false);

    navigate(path.CUSTOMERLOGIN);
  };

  return (
    <div className="bg-[#F2F2F2] min-h-screen">
    <div className="bg-white">
      <Header onLogout={handleLogout} />
    </div>
    <div className="flex justify-center bg-[#F2F2F2] mt-4">
 
      <div className="w-full ml-[177px] sm:w-1/4 md:w-1/5 lg:w-[19%] p-5 bg-white shadow-md rounded-lg h-full max-h-[calc(100vh+30px)]">
        <nav className="space-y-5 text-[#4a4a4a]">
          <a
            href="#"
            className={`flex items-center space-x-2 font-semibold px-3 py-2 rounded ${
              activeComponent === "home" ? "bg-red-100 border-[#fd2424] text-[#fd2424] border-[1px]" : "bg-transparent border-transparent text-[#4a4a4a]"
            }`}
            onClick={() => setActiveComponent("home")}
          >
            <span className="flex items-center gap-3">
              <icons.FaHome className="text-xl" /> Trang chủ
            </span>
          </a>
          <a
            href="#"
            className={`flex items-center space-x-2 font-semibold px-3 py-2 rounded ${
              activeComponent === "profile" ? "bg-red-100 border-[#fd2424] text-[#fd2424] border-[1px]" : "bg-transparent border-transparent text-[#4a4a4a]"
            }`}
            onClick={() => setActiveComponent("profile")}
          >
            <span className="flex items-center gap-3">
              <icons.ImProfile className="text-xl" /> Hồ sơ
            </span>
          </a>
          <a
            href="#"
            className={`flex items-center space-x-2 font-semibold px-3 py-2 rounded ${
              activeComponent === "history" ? "bg-red-100 border-[#fd2424] text-[#fd2424] border-[1px]" : "bg-transparent border-transparent text-[#4a4a4a]"
            }`}
            onClick={() => setActiveComponent("history")}
          >
            <span className="flex items-center gap-3">
              <icons.RiFileHistoryLine className="text-2xl" /> Lịch sử mua hàng
            </span>
          </a>
          {/* <a
            href="#"
            className={`flex items-center space-x-2 font-semibold px-3 py-2 rounded ${
              activeComponent === "historyReturnProduct" ? "bg-red-100 border-[#fd2424] text-[#fd2424] border-[1px]" : "bg-transparent border-transparent text-[#4a4a4a]"
            }`}
            onClick={() => setActiveComponent("historyReturnProduct")}
          >
            <span className="flex items-center gap-3">
              <icons.RiFileHistoryLine className="text-2xl" /> Lịch sử trả hàng
            </span>
          </a> */}
          <a
            href="#"
            className={`flex items-center space-x-2 font-semibold px-3 py-2 rounded ${
              activeComponent === "address" ? "bg-red-100 border-[#fd2424] text-[#fd2424] border-[1px]" : "bg-transparent border-transparent text-[#4a4a4a]"
            }`}
            onClick={() => setActiveComponent("address")}
          >
            <span className="flex items-center gap-3">
              <icons.RiFileHistoryLine className="text-2xl" /> Địa chỉ
            </span>
          </a>
          <NavLink
            to="#"
            className={`flex items-center space-x-2 font-semibold px-3 py-2 rounded ${
              showLogoutModal ? "bg-red-100 border-[#fd2424] text-[#fd2424] border-[1px]" : "bg-transparent border-transparent text-[#4a4a4a]"
            }`}
            onClick={() => setShowLogoutModal(true)}
          >
            <span className="flex items-center gap-3">
              <icons.IoExitOutline className="text-2xl" /> Thoát tài khoản
            </span>
          </NavLink>
        </nav>
      </div>
  
      {/* Main content area */}
      <div className="flex-1 p-5 max-w-screen-xl mx-auto">
        {activeComponent === "home" && <FmenberHome />}
        {activeComponent === "profile" && <UserProfile />}
        {/* {activeComponent === "historyReturnProduct" && <HistoryReturnProduct />} */}
        {activeComponent === "history" && <PurchaseHistory />}
        {activeComponent === "address" && <AddressCustomer />}
      </div>
  
    </div>
  
    {/* Logout Modal */}
    {showLogoutModal && (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
        <div className="bg-white p-5 rounded-xl shadow-lg w-[600px] max-w-lg">
          <h2 className="text-base font-semibold mb-4 text-center">Bạn muốn thoát tài khoản?</h2>
          <div className="flex justify-between space-x-3">
            <button
              className="px-4 py-2 font-medium bg-gray-200 rounded w-[250px]"
              onClick={() => setShowLogoutModal(false)}
            >
              Không
            </button>
            <button
              className="px-4 py-2 bg-[#e0052b] font-medium text-white rounded w-[250px]"
              onClick={handleLogout}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  
  );
}

export default CustomerInformation;
