import { useEffect, useState } from "react";
import api from "../../../middlewares/tokenMiddleware";
import Loading from "../../../components/Client/Loading";
import { message } from "antd";
message.config({
  top: 170, 
});
const UserProfile = () => {
  const [formData, setFormData] = useState({
    CustomerName: "",
    Email: "",
    PhoneNumber: "",
    BirthDate: "",
    Gender: "",
    createdAt: "",
  });
  const [isEditing, setIsEditing] = useState({
    email: false,
    phoneNumber: false,
  });
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (isoDate) => {
    return isoDate ? isoDate.split("T")[0] : "";
  };

  useEffect(() => {
    const fetchCustomerData = () => {
      try {
        setIsLoading(true);
        setTimeout(async () => {
          const response = await api.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/get-customer-info`
          );
          setFormData(response.data);
          setIsLoading(false);
        }, 300);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchCustomerData();
  }, []);

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      setTimeout(async () => {
        await api.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/update-customer-info`,
          formData
        );
        message.success("Thông tin đã được cập nhật thành công!");
        setIsLoading(false);
      },300);
    } catch (error) {
      console.log(error);
      message.error("Đã xảy ra lỗi khi cập nhật thông tin!");
    }
  };

  const handleEditEmail = () => {
    setIsEditing({ ...isEditing, email: true });
    setUpdatedEmail(formData.Email);
  };

  const handleEditPhoneNumber = () => {
    setIsEditing({ ...isEditing, phoneNumber: true });
    setUpdatedPhoneNumber(formData.PhoneNumber);
  };
  const validateEmail = (email) => {
    // A regular expression to check if the email address is valid
    // Hàm kiểm tra định dạng email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };
  const handleSaveEmail = () => {
    if(validateEmail(updatedEmail)){
    setFormData({ ...formData, Email: updatedEmail });
    setIsEditing({ ...isEditing, email: false });}
    else{
      message.warning("email không hợp lệ!");
      return;
    }
    
  };

  const handleSavePhoneNumber = () => {
    if (updatedPhoneNumber.length !== 10 || !/^\d+$/.test(updatedPhoneNumber)) {
      message.warning("Số điện thoại phải bao gồm 10 chữ số.");
      return;
    }
    setFormData({ ...formData, PhoneNumber: updatedPhoneNumber });
    setIsEditing({ ...isEditing, phoneNumber: false });
  };

  return (
    <div className="flex mr-[150px] -mt-5 bg-gray-50">
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70 z-10">
          <div className="relative -translate-y-[30px]">
            <Loading status={isLoading} />
          </div>
        </div>
      )}
      <div className="bg-gray-50 shadow-md rounded-lg p-5 w-full max-w-4xl">
        <div className="ml-6">
          <h2 className="text-lg font-sans mb-1">Hồ Sơ Của Tôi</h2>
          <p className="text-gray-500 mb-2 text-sm">
            Quản lý thông tin hồ sơ để bảo mật tài khoản
          </p>
          <div className="flex items-center my-2">
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>
          <div className="grid grid-cols-4 gap-6 text-[15px]">
            <div className="col-span-3 flex items-center space-x-4">
              <label className="text-gray-700 whitespace-nowrap">
                Tên khách hàng
              </label>
              <input
                type="text"
                value={formData.CustomerName}
                onChange={(e) =>
                  setFormData({ ...formData, CustomerName: e.target.value })
                }
                className="w-full p-2 mt-1 border border-gray-300 rounded"
                placeholder="Nhập tên của bạn"
              />
            </div>
            <div className="col-span-3 flex items-center space-x-4">
              <label className="block text-gray-700 whitespace-nowrap ">
                Email
              </label>
              {isEditing.email ? (
                <div className="flex items-center">
                  <input
                    type="email"
                    value={updatedEmail}
                    onChange={(e) => setUpdatedEmail(e.target.value)}
                    className="border border-gray-300 p-2 rounded"
                  />
                  <button
                    onClick={handleSaveEmail}
                    className="text-blue-500 ml-4"
                  >
                    Lưu
                  </button>
                </div>
              ) : (
                <div>
                  {formData.Email}
                  <button
                    onClick={handleEditEmail}
                    className="text-blue-500 ml-4"
                  >
                    Thay Đổi
                  </button>
                </div>
              )}
            </div>
            <div className="col-span-3 flex items-center space-x-4">
              <label className="block text-gray-700">Số điện thoại:</label>
              {isEditing.phoneNumber ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={updatedPhoneNumber}
                    onChange={(e) => setUpdatedPhoneNumber(e.target.value)}
                    className="border border-gray-300 p-2 rounded"
                  />
                  <button
                    onClick={handleSavePhoneNumber}
                    className="text-blue-500 ml-4"
                  >
                    Lưu
                  </button>
                </div>
              ) : (
                <div>
                  {formData.PhoneNumber}
                  <button
                    onClick={handleEditPhoneNumber}
                    className="text-blue-500 ml-4"
                  >
                    Chỉnh sửa
                  </button>
                </div>
              )}
            </div>
            <div className="col-span-3 flex items-center space-x-4">
              <label className="block text-gray-700">Giới tính</label>
              <div className="flex items-center space-x-4 mt-1">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Nam"
                    checked={formData.Gender === "Nam"}
                    onChange={() => setFormData({ ...formData, Gender: "Nam" })}
                    className="mr-2"
                  />
                  Nam
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Nữ"
                    checked={formData.Gender === "Nữ"}
                    onChange={() => setFormData({ ...formData, Gender: "Nữ" })}
                    className="mr-2"
                  />
                  Nữ
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="Khác"
                    checked={formData.Gender === "Khác"}
                    onChange={() =>
                      setFormData({ ...formData, Gender: "Khác" })
                    }
                    className="mr-2"
                  />
                  Khác
                </label>
              </div>
            </div>
            <div className="col-span-3 flex items-center space-x-4">
              <label className="block text-gray-700">Ngày sinh</label>
              <input
                type="date"
                value={formatDate(formData.BirthDate)}
                onChange={(e) =>
                  setFormData({ ...formData, BirthDate: e.target.value })
                }
                className="border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="col-span-3 flex items-center space-x-4">
              <label className="block text-gray-700">Gia nhập ngày</label>
              <span className="border border-gray-300 p-2 rounded">
                {formatDate(formData.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 ml-6">
          <button
            onClick={handleSaveChanges}
            className="bg-red-500 text-white px-6 py-2 rounded font-semibold hover:bg-red-600"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
