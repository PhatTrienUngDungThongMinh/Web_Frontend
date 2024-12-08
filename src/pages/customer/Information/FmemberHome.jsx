import { useEffect, useState } from "react";
import api from "../../../middlewares/tokenMiddleware";
import login1 from '../../../assets/client/login1.png';
import  icons from "../../../utils/icons";

const FmemberHome = () => {
  const [customerData, setCustomerData] = useState({ name: "", phone: "" });
  const [isPhoneHidden, setIsPhoneHidden] = useState(false);
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/get-customer-info`
        );
        setCustomerData(response.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };
    fetchCustomerData();
  }, []);
  const togglePhoneVisibility = () => {
    setIsPhoneHidden((prevState) => !prevState);
  };

  const maskPhoneNumber = (phone) => {
    if (phone && phone.length >= 10) {
      return phone.slice(0, 3) + "*****" + phone.slice(-2);
    }
    return phone;
  };

  return (
    <div className="bg-gray-50 pt-6 px-4 pb-4 -mt-5 rounded-lg shadow-xl  w-[891px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img
            src={login1}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-2 border-[#a83288] mr-6"
          />
          <div>
            <p className="text-lg font-bold text-[#a83288]">
              {customerData.CustomerName || "Đang tải..."}
            </p>
            <p className="text-[15px] text-gray-700 flex items-center gap-2">
            {isPhoneHidden ? maskPhoneNumber(customerData.PhoneNumber) : customerData.PhoneNumber || "Số điện thoại chưa cập nhật"}
              <span onClick={togglePhoneVisibility} className="cursor-pointer">
                {isPhoneHidden ? <icons.IoEyeSharp /> : <icons.FaEyeSlash />}
              </span>
            </p>
            <p className="text-[15px] text-gray-700 flex items-center gap-2 ">
              {customerData.Email || "Đang tải..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FmemberHome;
