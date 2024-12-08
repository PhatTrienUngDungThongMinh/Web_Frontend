import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal, List, message, Form, Input } from "antd";
import PropTypes from "prop-types";
import icons from "../../../utils/icons";
import api from "../../../middlewares/tokenMiddleware";
import Toolbar from "../../../components/Client/Toolbar";
import payment1 from "../../../assets/client/payment1.jpg";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { path } from "../../../utils/constant";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { CartContext } from "./CartContext";
import AddressSearch from "../../../components/Client/MapAPI";
const getImagePath = (imageName) => {
  if (!imageName) return "";
  return new URL(`../../../assets/client/${imageName}`, import.meta.url).href;
};
const PaymentModal = ({ isVisible, isSuccess, onClose }) => {
  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      centered
      className="max-w-xs mx-auto"
    >
      <div className="flex flex-col items-center p-4">
        {isSuccess ? (
          <CheckCircleOutlined className="text-green-500 text-6xl mb-4" />
        ) : (
          <CloseCircleOutlined className="text-red-500 text-6xl mb-4" />
        )}
        <h3 className="text-xl font-semibold">
          {isSuccess ? "Đặt hàng thành công!" : "Đặt hàng thất bại!"}
        </h3>
        <p className="text-center mt-2">
          {isSuccess
            ? "3FRIENDS Cảm ơn bạn đã mua hàng của chúng tôi. Đơn hàng của bạn đang được xử lý. Vui lòng chờ điện thoại chúng tôi sẽ liên hệ với bạn và xử lí đơn hàng một cách nhanh nhất!"
            : "Xin lỗi, có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại!"}
        </p>
        <Button
          type={isSuccess ? "primary" : "default"}
          onClick={onClose}
          className="mt-4"
        >
          Đóng
        </Button>
      </div>
    </Modal>
  );
};
const PaymentInfo = () => {
  const { cartItems, removeAllItemCart } = useContext(CartContext);
  const [form] = Form.useForm();
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedMethodIndex, setSelectedMethodIndex] = useState(null);
  const [promotionCode, setPromotionCode] = useState("");
  const [totalAmount, setTotalAmount] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethods, setPaymentMethodsID] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [promotion, setPromotion] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const openModal = () => {
    setIsModalOpen(true);
    setIsAddressModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsAddressModalOpen(true);
    setCurrentAddress(null);
  };
  const saveAddress = async (values) => {
    try {
      if (currentAddress) {
        await api.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/update-address?id=${
            currentAddress.id
          }`,
          { ...values }
        );
        setAddresses(
          addresses.map((addr) =>
            addr.id === currentAddress.id ? { ...addr, ...values } : addr
          )
        );
        message.success("Địa chỉ đã được cập nhật!");
      } else {
        console.log(values);
        const response = await api.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/create-address`,
          values
        );
        setAddresses([...addresses, response.data]);
        message.success("Địa chỉ đã được thêm!");
      }
      closeModal();
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi lưu địa chỉ");
    }
  };
  const checkDiscount = () => {
    return new Promise((resolve) => {
      Modal.confirm({
        title: "Xác nhận Voucher",
        content: (
          <p>
            Kiểm tra kỹ voucher của bạn trước khi bấm xác nhận, một khi đã bấm
            Xác nhận, voucher sẽ không thể sử dụng được cho đơn hàng khác nữa.
          </p>
        ),
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/get-address-by-id-customer`
        );
        const addresses = response.data?.ShippingAddresses || [];
        setAddresses(addresses);
        if (addresses.length > 0 && !selectedAddress) {
          setSelectedAddress(addresses[0]);
        }
      } catch (error) {
        message.error("Lỗi khi tải danh sách địa chỉ", error);
      }
    };
    setTotalAmount(
      cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    );
    fetchAddresses();
  }, [cartItems, selectedAddress]);

  const convertVNDtoUSD = (vndAmount) => {
    const exchangeRate = 1 / 25000;
    return vndAmount * exchangeRate;
  };

  const handleNextStep = () => {
    if (currentStep === 1) setCurrentStep(2);
    else {
      console.log(paymentMethods);
      if (paymentMethods === null)
        return message.warning("Vui lòng chọn phương thức thanh toán!");
      if (paymentMethods === 1) handleSubmitOrder();
    }
  };

  const handleSubmitOrder = async () => {
    try {
      console.log(
        totalAmount,
        selectedMethodIndex,
        promotion,
        selectedAddress,
        cartItems,
        selectedAddress
      );
      await api.post(`${import.meta.env.VITE_BACKEND_URL}/api/create-order`, {
        TotalAmount: totalAmount,
        PaymentMethodID: selectedMethodIndex,
        PromotionID: promotion?.id,
        AddressID: selectedAddress.id,
        ListProduct: cartItems,
        Infomation: selectedAddress,
      });
      removeAllItemCart();
      showModalSubmitOrder(true);
    } catch (error) {
      message.error(error.response.data.error + " vui lòng quay lại sau!");
      setIsPaymentSuccess(false);
    }
  };

  const applyPromotion = async () => {
    if (!promotionCode) {
      message.warning("Vui lòng nhập mã giảm giá.");
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-promotion-by-code`,
        {
          params: { Code: promotionCode },
        }
      );
      const Promotion = response.data;
      if (!Promotion || Promotion.IsDeleted || Promotion.DeletedAt) {
        message.warning("Mã giảm giá không hợp lệ.");
        return;
      }

      const currentDate = new Date();
      const startDate = new Date(Promotion.StartDate);
      const endDate = new Date(Promotion.EndDate);

      if (currentDate < startDate || currentDate > endDate) {
        message.error("Mã giảm giá đã hết hạn.");
        return;
      }

      if (totalAmount < Promotion.MinValue) {
        message.warning(
          `Tổng giá trị đơn hàng phải đạt tối thiểu ${formatPrice(
            Promotion.MinValue
          )} để sử dụng mã giảm giá.`
        );
        return;
      }

      if (Promotion.Quantity <= 0) {
        message.error("Số lượng mã giảm giá đã hết.");
        return;
      }

      const discountAmount = (Promotion.DiscountValue / 100) * totalAmount;
      const finalDiscount = Math.min(discountAmount, Promotion.MaxDiscount);
      const discountedPrice = totalAmount - finalDiscount;
      const useDiscount = await checkDiscount();

      if (useDiscount) {
        setPromotion(Promotion);
        setDiscountPercent(Promotion.DiscountValue);
        setTotalAmount(discountedPrice);
        setIsDiscountApplied(true);
        message.success("Mã giảm giá đã được áp dụng thành công!");
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra. Vui lòng thử lại sau.", error);
    }
  };

  const openAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const closeAddressModal = () => {
    setIsAddressModalOpen(false);
  };

  const selectAddress = (address) => {
    setSelectedAddress(address);
    closeAddressModal();
  };

  const togglePaymentModal = () => {
    setPaymentModalOpen(!isPaymentModalOpen);
  };
  const handlePaymentMethodSelect = (method, index) => {
    setSelectedPaymentMethod(method);
    setSelectedMethodIndex(index);
  };

  const ChoosePaymentMethod = () => {
    setPaymentMethodsID(1);
  };
  const handleConfirmSelection = () => {
    setPaymentModalOpen(false);
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  const showModalSubmitOrder = (success) => {
    setIsPaymentSuccess(success);
    setIsModalVisible(true);
  };

  const handleCloseSubmitOrder = () => {
    if (isPaymentSuccess) {
      navigate(path.HOMEPAGE);
    }
    setIsModalVisible(false);
  };

  const handlePreviousStep = () => {
    if (currentStep === 2) {
      console.log("Thanh toán");
      setCurrentStep(1);
    }
  };

  return (
    <div>
      <PaymentModal
        isVisible={isModalVisible}
        isSuccess={isPaymentSuccess}
        onClose={handleCloseSubmitOrder}
      />

      <Toolbar />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center">
        <div className="bg-[#f4f6f8] w-full max-w-[600px] mx-auto p-3 flex items-center justify-between  border-b border-gray-300">
          <button
            onClick={handlePreviousStep}
            className=" font-semibold text-xl flex justify-center items-center gap-2"
          >
            <icons.IoArrowBack />
          </button>
          <h1 className="text-lg font-bold ">
            {currentStep === 1 ? "Thông tin" : "Thanh toán"}
          </h1>
          <div></div>
        </div>

        <div className="flex pt-2 mb-4 text-sm justify-center space-x-4 mx-auto max-w-[600px]">
          <button
            className={`font-bold px-4 py-2 w-[300px] text-center text-[16px] ${
              currentStep === 1
                ? "text-[#e0052b] border-b-[3px] border-[#e0052b]"
                : "text-gray-500 border-b-2"
            }`}
          >
            1. THÔNG TIN
          </button>
          <button
            className={`font-bold px-4 py-2 w-[300px] text-center text-[16px] ${
              currentStep === 2
                ? "text-[#e0052b] border-b-[3px] border-[#e0052b]"
                : "text-gray-500 border-b-2"
            }`}
          >
            2. THANH TOÁN
          </button>
        </div>

        {currentStep === 1 && (
          <div className="mx-auto max-w-[600px] w-full">
            <div className="flex mb-6 bg-white w-full max-w-[600px] mt-4 p-4 rounded-lg shadow-sm border border-gray-300">
              <div className="w-full max-w-[600px] mt-4">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center bg-white p-4 rounded-lg shadow-sm ${
                      index !== 0 ? "border-t border-gray-300" : ""
                    }`}
                  >
                    <img
                      src={item?.imgSrc}
                      alt={item?.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />

                    <div className="ml-6 flex-1">
                      <h2 className="font-semibold">
                        {item?.name} {item?.color && `- ${item.color}`}
                      </h2>
                      <span className="text-[#e0052b]">
                        {formatPrice(
                          parseFloat(item?.price.replace(/\D/g, "")) *
                            item?.quantity
                        )}
                      </span>
                    </div>
                    <div className="ml-auto">
                      <p className="font-sm">
                        Số lượng:
                        <span className="text-[#e0052b] ml-1">
                          {item?.quantity}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex ">
              <h3 className="text-lg mx-auto max-w-[600px] w-full text-left pt-1 pb-2">
                THÔNG TIN NHẬN HÀNG
              </h3>
              <Button
                type="primary"
                onClick={openAddressModal}
                className="mt-1 mb-4"
              >
                Thay đổi địa chỉ
              </Button>
            </div>
            <div className="bg-white w-full max-w-[600px] p-4 rounded-lg shadow-sm border border-gray-300 ">
            {selectedAddress === null ? (
                <div className="text-center">
                  <img
                    src={getImagePath("delivery.png")}
                    alt="noAddress"
                    className="w-45 mx-auto"
                  />
                  <p className="text-gray-500 text-lg">Bạn chưa có địa chỉ nhận hàng</p>
                </div>
              ):(
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-semibold">
                      Người nhận
                    </span>
                    <span className="text-gray-500">
                      {selectedAddress.RecipientName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-semibold">
                      Số điện thoại
                    </span>
                    <span className="text-gray-500">
                      {selectedAddress.PhoneNumber}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-semibold">Địa chỉ</span>
                    <span className="text-gray-500">
                      {selectedAddress.Address}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-semibold">Địa chỉ cụ thể</span>
                    <span className="text-gray-500">
                      {selectedAddress.SpecificAddress}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <Modal
              title={"Thêm địa chỉ mới"}
              open={isModalOpen}
              onCancel={closeModal}
              footer={null}
              destroyOnClose
            >
              <Form
                form={form}
                initialValues={currentAddress}
                onFinish={saveAddress}
                layout="vertical"
              >
                <Form.Item
                  label="Họ và Tên"
                  name="RecipientName"
                  rules={[
                    { required: true, message: "Vui lòng nhập họ và tên!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Số điện thoại"
                  name="PhoneNumber"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại!" },
                    {
                      pattern: new RegExp(/^0\d{9,10}$/),
                      message: "Số điện thoại không hợp lệ!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Địa chỉ"
                  name="Address"
                  rules={[
                    { required: true, message: "Vui lòng nhập địa chỉ!" },
                  ]}
                >
                  <AddressSearch form={form} />
                </Form.Item>

                <Form.Item
                  label="Địa chỉ cụ thể"
                  name="SpecificAddress"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập địa chỉ cụ thể!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item className="text-center">
                  <Button type="default" onClick={closeModal} className="mr-4">
                    Hủy
                  </Button>
                  <Button type="primary" htmlType="submit">
                    Lưu
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
            <Modal
              title="Chọn địa chỉ nhận hàng"
              visible={isAddressModalOpen}
              onCancel={closeAddressModal}
              footer={null}
            >
              <Button
                type="primary"
                onClick={() => openModal()}
                className="float-right -mt-9 mr-36 p-2"
              >
                Thêm địa chỉ mới
              </Button>
              <List
              bordered
              dataSource={addresses}
              renderItem={(address) => (
                <List.Item
                  key={address.id}
                  actions={[
                    <Button
                      key="select"
                      type="primary"
                      onClick={() => selectAddress(address)}
                    >
                      Chọn
                    </Button>,
                  ]}
                  className="mb-4 rounded-lg shadow-lg p-4"
                >
                  <div>
                    <div className="font-semibold">
                      Người nhận: {address.RecipientName} |{" "}
                      {address.PhoneNumber}
                    </div>
                    <div>{address.SpecificAddress}</div>
                    <div>
                      {address.Address}
                    </div>
                  </div>
                </List.Item>
              )}
            />   
              
            </Modal>
          </div>
        )}
        {currentStep === 2 && (
          <div className="mx-auto max-w-[600px] w-full mt-2">
            <div className="bg-white w-full max-w-[600px] p-4 rounded-lg shadow-sm border border-gray-300 mb-4">
              <div className="mb-4">
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    className="flex-1 py-2 border-gray-300 border-b-[1px] focus:border-blue-500 focus:outline-none"
                    placeholder="Nhập mã giảm giá"
                    value={promotionCode}
                    onChange={(e) => setPromotionCode(e.target.value)}
                  />
                  <button
                    onClick={applyPromotion}
                    className="bg-[#d73d3d] text-white hover:bg-[#f00] text-sm px-4 py-2 rounded-lg"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center mb-2 *:">
                <span className="text-[16px] text-gray-500">
                  Số lượng sản phẩm
                </span>
                <span className="text-gray-700 font-medium">
                  0{cartItems.length}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[16px] text-gray-500">
                  Tiền hàng (tạm tính)
                </span>
                <span className="text-gray-700 font-medium">
                  {formatPrice(totalAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[16px] text-gray-500">
                  Phí vận chuyển
                </span>
                <span className="text-gray-700 font-medium">Miễn phí</span>
              </div>
              {isDiscountApplied && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[16px] text-gray-500">Giảm giá</span>
                  <span className="text-gray-700 font-medium">
                    {discountPercent}%
                  </span>
                </div>
              )}
              <div className="border-t border-gray-300 my-4"></div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-800">
                  Tổng tiền
                  <span className="font-normal"> ( đã gồm VAT)</span>
                </span>
                <span className="font-bold text-[#e0052b] text-lg">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            {/* Payment Info */}
            <h3 className="text-lg mx-auto max-w-[600px] w-full text-left pt-1 pb-2">
              THÔNG TIN THANH TOÁN
            </h3>
            <div
              onClick={togglePaymentModal}
              className="bg-white w-full max-w-[600px] p-2 rounded-lg shadow-sm border border-gray-300 mb-4"
            >
              <button className="flex items-center justify-between w-full text-left p-4 rounded-lg">
                <div className="flex items-center">
                  <icons.MdOutlinePayments className="text-blue-700 text-3xl mr-3" />
                  <div>
                    {selectedPaymentMethod ? (
                      <>
                        <p className="font-semibold text-[#e0052b] text-[16px]">
                          {selectedPaymentMethod}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Đã chọn phương thức thanh toán
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold text-[#e0052b] text-[16px]">
                          Chọn phương thức thanh toán
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <icons.IoIosArrowForward className="text-[#e0052b] text-xl" />
              </button>
            </div>
            {isPaymentModalOpen && (
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-50 z-50 flex justify-center items-center"
                onClick={togglePaymentModal}
              >
                <div
                  className="bg-white w-96 p-6 rounded-lg shadow-lg relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-bold mb-4">
                    Chọn phương thức thanh toán
                  </h3>
                  <p className="text-gray-600 mb-4 text-[13px]">KHẢ DỤNG</p>

                  <div
                    onClick={() =>
                      handlePaymentMethodSelect("Thanh toán tại cửa hàng", 1)
                    }
                    className={`flex border p-1 rounded-lg mb-4 cursor-pointer ${
                      selectedMethodIndex === 1
                        ? "border-[#e0052b]"
                        : "border-gray-300"
                    } hover:bg-[#ffdada]`}
                  >
                    <img src={payment1} className="w-[50px] h-[50px]" />
                    <button
                      onClick={ChoosePaymentMethod}
                      className="w-full py-2 px-4 rounded-lg mb-2"
                    >
                      Thanh toán tại cửa hàng
                    </button>
                  </div>
                  <div
                    onClick={() =>
                      handlePaymentMethodSelect("Thanh toán paypal", 2)
                    }
                    className={`flex border p-1 rounded-lg mb-4 cursor-pointer ${
                      selectedMethodIndex === 2
                        ? "border-[#e0052b]"
                        : "border-gray-300"
                    } hover:bg-[#ffdada]`}
                  >
                    <img src={payment1} className="w-[50px] h-[50px]" />
                    <button
                      onClick={ChoosePaymentMethod}
                      className="w-full py-2 px-4 rounded-lg mb-2"
                    >
                      Thanh toán bằng paypal
                    </button>
                  </div>

                  <button
                    onClick={handleConfirmSelection}
                    className="w-full bg-[#e0052b] text-white py-2 rounded-lg mt-4"
                  >
                    Xác nhận
                  </button>

                  <button
                    onClick={togglePaymentModal}
                    className="absolute top-7 right-2 text-sm font-semibold"
                  >
                    ✖
                  </button>
                </div>
              </div>
            )}
            {/* Shipping Info */}
            <h3 className="text-lg mx-auto max-w-[600px] w-full text-left pt-1 pb-2">
              THÔNG TIN NHẬN HÀNG
            </h3>
            <div className="bg-white w-full max-w-[600px] p-4 rounded-lg shadow-sm border border-gray-300 ">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-semibold">
                    Khách hàng
                  </span>
                  <span className="text-gray-500">
                    {selectedAddress
                      ? selectedAddress.RecipientName
                      : "Chưa chọn địa chỉ"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-semibold">
                    Số điện thoại
                  </span>
                  <span className="text-gray-500">
                    {selectedAddress
                      ? selectedAddress.PhoneNumber
                      : "Chưa có thông tin"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-semibold">
                    Địa chỉ nhận hàng
                  </span>
                  <span className="text-gray-500">
                    {selectedAddress
                      ? selectedAddress.Address
                      : "Chưa có thông tin địa chỉ"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-semibold">Địa chỉ chi tiết</span>
                  <span className="text-gray-500">
                    {selectedAddress
                      ? selectedAddress.SpecificAddress
                      : "Chưa có thông tin địa chỉ"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-semibold">
                    Người nhận
                  </span>
                  <span className="text-gray-500">
                    {selectedAddress
                      ? `${selectedAddress.RecipientName} - ${selectedAddress.PhoneNumber}`
                      : "Chưa có thông tin"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border-t pt-4 mt-4 mx-auto max-w-[600px] w-full bg-white  rounded-lg pb-4 shadow-[0px_-4px_10px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between mb-4 mx-2">
            <p className="font-semibold">Tổng tiền tạm tính:</p>
            <p className="font-bold text-[#e0052b]">
              {formatPrice(totalAmount)}
            </p>
          </div>
          <div className="flex justify-center">
            {selectedMethodIndex === 2 ? (
              <PayPalScriptProvider
                options={{
                  "client-id":
                    "ASw75GpZvhBDAxAPvaQ28B4Y9ajOyjksFgNSrbSuVnY0DDE34_gjYuhCwiQh8yTE0c_FSdFSq-dftQet",
                }}
              >
                <PayPalButtons
                  className="w-[580px] py-3 rounded-lg font-bold "
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            currency_code: "USD",
                            value: convertVNDtoUSD(totalAmount).toFixed(2),
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={(data, actions) => {
                    return actions.order.capture().then(() => {
                      setIsPaymentSuccess(true);
                      handleSubmitOrder();
                    });
                  }}
                />
              </PayPalScriptProvider>
            ) : (
              <button
                onClick={handleNextStep}
                className="w-[580px] bg-[#e0052b] text-white py-3 rounded-lg font-bold "
              >
                {currentStep === 1 ? "Tiếp tục" : "Thanh toán"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
PaymentModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  isSuccess: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
PaymentInfo.propTypes = {
  customerData: PropTypes.shape({
    CustomerName: PropTypes.string.isRequired,
    PhoneNumber: PropTypes.string.isRequired,
    Email: PropTypes.string.isRequired,
    Address: PropTypes.string,
  }).isRequired,
};
export default PaymentInfo;
