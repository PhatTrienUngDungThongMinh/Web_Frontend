// Updated CustomerAuthContext.jsx
import PropTypes from "prop-types";
import { createContext, useState } from "react";
import { signInWithEmailPassword, signInWithGoogle } from "../config/firebaseService";
import axios from "axios";
import { message } from "antd";

export const CustomerAuthContext = createContext();

export const CustomerAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [customer, setCustomer] = useState(null);

  const saveAccount = async ({
    uid,
    customerName,
    gender,
    email,
    phoneNumber,
    birthDate,
    isActive ,
}) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
            uid,
            customerName,
            gender,
            email,
            phoneNumber,
            birthDate,
            isActive,
        });
        if (response.status === 200) {
            console.log("save accounting success");
            return true;
        }
    } catch (error) {
        console.log("error save accounting", error.message);
        return false;
    }
};

const checkEmail = async ({ email }) => {
  try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/check-email?email=${email}`);
      console.log("res: ", response);

      if (response.data.success) {
          return true;
      } else {
          return false;
      }
  } catch (error) {
      console.error("error check mail: ", error.message);
      return false;
  }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailPassword(email, password);
      console.log(userCredential);
      console.log(userCredential.emailVerified);
      if (!userCredential.emailVerified) {
        throw new Error('Vui lòng xác thực email trong thư mục tin nhắn để đăng nhập!');
      }
  
      localStorage.setItem("token", await userCredential.getIdToken());
      if(userCredential.displayName)
        localStorage.setItem("username", userCredential.displayName);
      message.success('Đăng nhập thành công!');
      
    } catch {
      message.warning('vui lòng kiểm tra và xác thực email trước khi đăng nhập!.');
    }
  };

  const loginWithGoogle = async () => {
    try {
        const userCredential = await signInWithGoogle();
        if (userCredential) {
            const user = userCredential;
            if (user) {
                const checkCreatedEmail = await checkEmail({ email: user.email });
                if (!checkCreatedEmail) {
                    try {
                        await saveAccount({
                            uid: user.uid,
                            customerName: user.displayName,
                            gender: user.gender || 'Unknown',
                            email: user.email,
                            phoneNumber: user.phoneNumber || 'Unknown',
                            birthDate: user.birthDate || null,
                            isActive: true,
                        });
                        localStorage.setItem("token", await user.getIdToken());
                        localStorage.setItem("username", user.displayName);
                        message.success('Đăng nhập thành công!');
                    } catch (error) {
                        console.error('Error saving account: ', error);
                        message.error('Đã xảy ra lỗi khi lưu tài khoản.');
                    }
                } else {
                    localStorage.setItem("token", await user.getIdToken());
                    localStorage.setItem("username", user.displayName);
                    message.success('Đăng nhập thành công!');
                }
            }
        }
    } catch (error) {
        console.error('Error signing in with Google:', error);
        message.error('Đã xảy ra lỗi khi đăng nhập.');
    }
}

  const logout = () => {
    setIsAuthenticated(false);
    setCustomer(null);
    localStorage.removeItem("username");
    localStorage.removeItem("token");
  };

  return (
    <CustomerAuthContext.Provider value={{ isAuthenticated, customer, login, loginWithGoogle, logout }}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

CustomerAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
