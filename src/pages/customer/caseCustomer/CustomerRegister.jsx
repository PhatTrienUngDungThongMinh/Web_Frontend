import { useState, useEffect, useContext } from "react";
import { auth } from "../../../config/firebaseConfig.jsx";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { path } from "../../../utils/constant.jsx";
import login1 from "../../../assets/client/login1.png";
import google from "../../../assets/client/google.png";
import Loading from '../../../components/Client/Loading.jsx';
import { CustomerAuthContext } from "../../../AuthContext/CustomerAuthContext.jsx";
import moment from "moment";
import { message } from "antd";

const CustomerRegister = () => {
  const {loginWithGoogle } = useContext(CustomerAuthContext);
  const [errorResult, setErrorResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phoneNumber: "",
    birthday: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    customerName: "",
    address: "",
    email: "",
    phoneNumber: "",
    birthday: "",
    password: "",
    confirmPassword: "",
  });
  // kiểm tra định dạng email
  useEffect(() => {
    if (formData.email && !validateEmail(formData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Định dạng email không hợp lệ",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "",
      }));
    }

    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Mật khẩu không khớp",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "",
      }));
    }
  }, [formData]);
  //kiểm tra dữ liệu bị bỏ trống
  const handleBlur = (e) => {
    const { name, value } = e.target;
    // Nếu giá trị trống thì thông báo lỗi
    if (!value.trim()) {
      setErrors({
        ...errors,
        [name]: (
          <span className="text-[12px] text-red-500 ml-[10px]">
            Vui lòng không bỏ trống
          </span>
        ),
      });
    } else {
      // Xóa thông báo lỗi nếu đã có giá trị
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };
  // kiểm tra thay đổi dữ liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  //kiểm tra email hợp lệ
  const validateEmail = (email) => {
    // A regular expression to check if the email address is valid
    // Hàm kiểm tra định dạng email
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  //các hàm xử lí đăng ký

  //lưu thông tin người dùng
  const saveAccount = async ({
    uid,
    customerName,
    gender,
    email,
    phoneNumber,
    birthDate,
    isVerified = false,
  }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/register`,
        {
          uid,
          customerName,
          gender,
          email,
          phoneNumber,
          birthDate,
          isVerified,
        }
      );
      if (response.status === 200) {
        console.log("save accounting success");
        return true;
      }
    } catch (error) {
      console.log("error save accounting", error.message);
      return false;
    }
  };

  // check email tồn tại hay chưa
  const checkEmail = async ({ email }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/check-email?email=${email}`
      );
      if (response.data.success) {
        return true;
      } else {
        return false;
      }
    } catch  {
      return false;
    }
  };

  // đăng kí bằng gg
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate(path.HOMEPAGE);
    } catch (error) {
      setErrorResult(
        "Đã xảy ra lỗi khi đăng nhập với Google. Vui lòng thử lại."
      );
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  //xử lý đăng ký
  const handleRegister = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    //kiểm tra tất cả giá trị có trong formdata
    const values = Object.values(formData);
    const hasEmptyValue = values.some((value) => value === null || value === '');
    if (hasEmptyValue) {
        message.error('Vui lòng điền đầy đủ thông tin!');
        return;
    }
    try {
        const checkCreatedEmail = await checkEmail({ email });
        if (checkCreatedEmail) {
            message.warning('Email đã tồn tại trên hệ thống. Vui lòng đăng ký lại!');
            throw new Error('Email đã đăng ký');
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (userCredential) {
                const success = await saveAccount({
                    uid: userCredential.user.uid,
                    customerName: formData.customerName,
                    gender: formData.gender,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    birthDate: formData.birthday,
                });
                if (!success) {
                    message.error('Lỗi hệ thống vui lòng thử lại sau');
                    throw new Error('Error saving account');
                }

                setFormData({
                    customerName: '',
                    email: '',
                    phoneNumber: '',
                    birthday: '',
                    password: '',
                    confirmPassword: '',
                });
                message.success('Đăng ký thành công vui lòng xác thực email!');
                await sendEmailVerification(userCredential.user);
                navigate(path.CUSTOMERLOGIN);
            } else {
                message.error("Đăng ký thất bại vui lòng thử lại sau!");
            }
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                message.warning('Email đã tồn tại trên hệ thống. Vui lòng đăng ký với email khác!');
            } else {
                message.error('Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.');
                console.error('Error:', error);
            }
        }
    } catch (error) {
        console.error('Lỗi đăng ký:', error.message);
        setErrors({ ...errors, email: error.message || 'Đăng ký thất bại. Thử lại email khác.' });
    }
};

  return (

    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-red-100 via-white to-red-50">
      {/* Container */}
      <Loading status={isLoading} />
      <div className="w-[700px] bg-white rounded-lg shadow-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={login1} alt="Logo" className="w-20 h-20" />
        </div>

        {/* Title */}
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
          Đăng ký với
        </h2>

        {/* Social Login */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center py-3 px-6 text-[16px] rounded-lg hover:bg-red-100 transition"
          >
            <img src={google} alt="Google" className="w-6 h-6 mr-2" />
            Google
          </button>
        </div>

        <div className="flex items-center  justify-center my-4">
          <div className="w-1/4 border-t border-gray-300"></div>
          <span className="mx-4 text-gray-400">Hoặc</span>
          <div className="w-1/4 border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="relative">
            <input
              type="text"
              name="customerName"
              placeholder="Họ và tên*"
              className={`w-full p-2 border-b ${
                errors.customerName ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-0 focus:border-red-400`}
              value={formData.customerName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.customerName && (
              <p className="text-sm text-red-500 mt-1">{errors.customerName}</p>
            )}
          </div>

          {/* Gender */}
          <div className="relative">
            <label className="block text-sm font-medium mb-2">Giới tính</label>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Nam"
                  className="mr-2"
                  checked={formData.gender === "Nam"}
                  onChange={handleChange}
                />
                Nam
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Nữ"
                  className="mr-2"
                  checked={formData.gender === "Nữ"}
                  onChange={handleChange}
                />
                Nữ
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="Khác"
                  className="mr-2"
                  checked={formData.gender === "Khác"}
                  onChange={handleChange}
                />
                Khác
              </label>
            </div>
            {errors.gender && (
              <p className="text-sm text-red-500 mt-1">{errors.gender}</p>
            )}
          </div>

          {/* Birthday */}
          <div className="relative">
            <input
              type="date"
              name="birthday"
              className={`w-full p-2 border-b ${
                errors.birthday ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-0 focus:border-red-400`}
              value={formData.birthday}
              onChange={handleChange}
              onBlur={(e) => {
                const birthday = new Date(e.target.value);
                const age = moment().diff(birthday, "years");
                if (age < 16) {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    birthday: "Phải trên 16 tuổi",
                  }));
                } else {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    birthday: "",
                  }));
                }
              }}
            />
            {errors.birthday && (
              <p className="text-sm text-red-500 mt-1">{errors.birthday}</p>
            )}
          </div>
          {/* Phone Input */}
          <div className="relative">
            <input
              type="text"
              name="phoneNumber"
              placeholder="Số điện thoại*"
              className={`w-full p-2 border-b ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-0 focus:border-red-400`}
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={() => {
                const phoneNumberPattern = /^\d{10}$/;
                if (!phoneNumberPattern.test(formData.phoneNumber)) {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    phoneNumber: "Số điện thoại phải bao gồm 10 chữ số.",
                  }));
                } else {
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    phoneNumber: "",
                  }));
                }
              }}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500 mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Email*"
              className={`w-full p-2 border-b ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-0 focus:border-red-400`}
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu*"
              className={`w-full p-2 border-b ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-0 focus:border-red-400`}
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu*"
              className={`w-full p-2 border-b ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-0 focus:border-red-400`}
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          {errorResult && <p className="text-red-500">{errorResult}</p>}
          <button
            type="submit"
            className="w-full bg-[#e0052b] text-white py-4 rounded-lg font-bold text-lg hover:bg-red-600 transition"
          >
            Đăng ký
          </button>
        </form>

        {/* Login link */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Bạn đã có tài khoản?{" "}
          <NavLink
            to={path.CUSTOMERLOGIN}
            className="text-[#e0052b] font-medium hover:underline"
          >
            Đăng nhập ngay
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default CustomerRegister;
