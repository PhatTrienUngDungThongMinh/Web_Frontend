// Updated CustomerLogin.jsx
import google from "../../../assets/client/google.png";
import login1 from "../../../assets/client/login1.png";
import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { path } from "../../../utils/constant";
import { CustomerAuthContext } from "../../../AuthContext/CustomerAuthContext";
import Loading from "../../../components/Client/Loading";

const CustomerLogin = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useContext(CustomerAuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

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

    if (formData.password && formData.password.length < 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Mật khẩu không hợp lệ",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "",
      }));
    }
  }, [formData]);

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const { email, password } = formData;

    try {
      await login(email, password);
      navigate(path.HOMEPAGE);
    } catch (error) {
      setLoginError("Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate(path.HOMEPAGE);
    } catch (error) {
      setLoginError(
        "Đã xảy ra lỗi khi đăng nhập với Google. Vui lòng thử lại."
      );
      console.error("Google login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 h-screen flex items-center justify-center relative">
      <Loading status={isLoading} />
      <div className="bg-white shadow-lg rounded-lg flex max-w-4xl w-full">
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <NavLink to={path.HOMEPAGE} className="text-blue-500 text-sm mb-4">
            ← Trở về trang chủ
          </NavLink>
          <img
            src={login1}
            alt="Illustration"
            className="w-full rounded-lg h-[440px]"
          />
        </div>
        <div className="w-1/2 bg-gray-50 p-8 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            ĐĂNG NHẬP NGAY
          </h2>
          <form onSubmit={handleSubmitLogin}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-600 text-sm mb-2 "
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Nhập e-mail"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>
            <div className="mb-3">
              <label
                htmlFor="password"
                className="block text-gray-600 text-sm mb-2"
              >
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              {errors.password && (
                <p className="text-red-500">{errors.password}</p>
              )}
            </div>
            {loginError && <p className="text-red-500">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Đăng nhập
            </button>
            <div className="flex justify-between items-center mt-2">
              <span className="">Bạn chưa có tài khoản?</span>
              <NavLink to={path.FORGOTPASSWORD} className="text-gray-400">
                Quên mật khẩu?
              </NavLink>
            </div>
          </form>
          <div className="flex items-center my-[8px]">
            <div className="border-t border-gray-300 flex-grow"></div>
            <span className="mx-3 text-gray-400">Hoặc</span>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>

          <div className="text-center justify-between mb-4">
            <span className="text-gray-500">Bạn chưa có tài khoản?</span>
            <NavLink
              to={path.CUSTOMERREGISTER}
              className="ml-2 text-[#e0052b] font-semibold hover:underline"
            >
              Đăng ký ngay
            </NavLink>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 bg-gray-200 rounded-lg hover:bg-[#e0052b] hover:text-white transition flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-spin h-5 w-5 border-2 border-t-transparent rounded-full"></span>
            ) : (
              <>
                <span className="text-lg mr-2">
                  <img className="w-6" src={google} alt="google" />
                </span>
                Đăng nhập với tài khoản Google
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerLogin;
