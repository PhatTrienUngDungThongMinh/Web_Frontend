import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../../config/firebaseService";
import { path } from "../../../utils/constant";
import { Form, Input, Button, Space, Alert } from "antd";
import { MailOutlined } from "@ant-design/icons";

const ForgotPassword = () => {
  const [serverError, setServerError] = useState("");
  const [isSubmitting,setSubmitting] = useState(false);
  const navigate = useNavigate();

  const initialValues = { email: "" };

  const handleSubmit = async (values) => {
    setServerError("");
    setSubmitting(true);
    
    try {
      await resetPassword(values.email);
      setTimeout(() => {
        navigate(path.CUSTOMERLOGIN);
      }, 2000);
    } catch (error) {
      setServerError("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
      console.error("Error resetting password:", error);
    } finally {
      setSubmitting(false); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-100 via-white to-red-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
          Quên mật khẩu
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Nhập email của bạn để khôi phục mật khẩu.
        </p>
        <Form
          initialValues={initialValues}
          onFinish={handleSubmit}
          layout="vertical"
          validateTrigger="onBlur"
        >
          {/* Email Input Field */}
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                type: "email",
                message: "Email không hợp lệ",
              },
              {
                required: true,
                message: "Vui lòng nhập email của bạn",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Nhập email của bạn"
              type="email"
            />
          </Form.Item>

          {/* Server Error Message */}
          {serverError && (
            <Alert
              message={serverError}
              type="error"
              showIcon
              className="mb-4"
            />
          )}

          {/* Success Message */}
          <Form.Item>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                block
              >
                Gửi email khôi phục mật khẩu
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {/* Success Message on Submission */}
        <div className="text-center mt-4 text-gray-500">
          <p>Đã quên mật khẩu? Không vấn đề gì, nhập email của bạn và chúng tôi sẽ giúp bạn khôi phục.</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;