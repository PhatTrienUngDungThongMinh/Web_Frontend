import { useEffect, useState } from 'react';
import { Modal, Row, Col, Image, Spin, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import Header from '../../../components/Client/Header';
import Footer from '../../../components/Client/Footer';

const LookOrders = () => {
  const [orderCode, setOrderCode] = useState(''); // Trạng thái mã đơn hàng
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal
  const [orderData, setOrderData] = useState(null); // Dữ liệu trả về từ API
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Hàm gọi API để tra cứu đơn hàng
  const fetchOrderData = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3001/api/get-order-customer-detail`, {
        params: { id },
      });
      const data = response.data;
      setOrderData(data);
      setIsModalOpen(true); // Chỉ mở modal sau khi nhận được dữ liệu
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order data:', error);
      if (error.response) {
        message.error(`Lỗi: ${error.response.data.message || 'Không tìm thấy đơn hàng!'}`);
      } else {
        message.error('Không thể kết nối đến server.');
      }
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/method-payment`
      );
      setPaymentMethods(
        response.data.map((method, index) => ({ key: index, ...method }))
      );
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      message.error(
        "Không thể tải danh sách phương thức thanh toán. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  // Hàm lấy tên phương thức thanh toán
  const getPaymentMethodName = (id) => {
    const method = paymentMethods.find((method) => method.id === id);
    return method ? method.PaymentMethodName : 'Phương thức không xác định';
  };


  // Hàm xử lý sự kiện khi nhấn "TRA CỨU"
  const handleSearchOrder = () => {
    if (!orderCode.trim()) {
      message.warning('Vui lòng nhập mã đơn hàng');
    } else {
      fetchOrderData(orderCode.trim());
    }
  };

  // Hàm đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
    setOrderData(null); // Reset dữ liệu khi đóng modal
  };

  // Các trạng thái đơn hàng
  const orderStatuses = [
    'Chờ xác nhận',
    'Đã xác nhận',
    'Đang đóng hàng',
    'Chờ giao hàng',
    'Đang giao hàng',
    'Đã hoàn thành',
  ];

  return (
    <div>
      <Header />
      <div className="flex p-5 bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 mr-5 ml-[183px] mt-8">
          <ul className="space-y-2">
            <li>
              <a href="/" className="text-gray-700 hover:text-blue-500">
                Những câu hỏi thường gặp
              </a>
            </li>
            <li>
              <a href="/" className="text-gray-700 hover:text-blue-500">
                Phương thức thanh toán
              </a>
            </li>
            <li>
              <a href="/" className="text-blue-500 font-bold">
                Tra cứu đơn hàng trực tuyến
              </a>
            </li>
            <li>
              <a href="/" className="text-gray-700 hover:text-blue-500">
                Tìm trung tâm bảo hành
              </a>
            </li>
          </ul>
        </div>

        {/* Lookup Form */}
        <div className="flex flex-col w-80 space-y-4 mt-8 ml-[300px]">
          <input
            type="text"
            placeholder="Nhập mã đơn hàng để tra cứu"
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
          />
          <button
            className="py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300"
            onClick={handleSearchOrder}
          >
            TRA CỨU
          </button>
        </div>
      </div>

      {/* Modal để hiển thị thông tin đơn hàng */}
      <Modal
        title="Thông tin đơn hàng"
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
      >
        {loading ? (
          <div className="flex justify-center items-center">
            <Spin size="large" />
          </div>
        ) : orderData ? (
          <>
            {/* Trạng thái đơn hàng */}
            <Row className="mb-4">
              <Col span={24}>
                <div className="border-2 border-gray-300 p-4 rounded-lg bg-gray-50">
                  <p>
                    <strong>Trạng thái đơn hàng:</strong> {orderData.OrderStatus}
                  </p>
                  <div className="flex space-x-4">
                    {orderStatuses.map((status, index) => (
                      <div key={index} className="flex items-center">
                        {orderStatuses.indexOf(orderData.OrderStatus) >= index ? (
                          <CheckCircleOutlined className="text-green-500 mr-2" />
                        ) : (
                          <CloseCircleOutlined className="text-gray-400 mr-2" />
                        )}
                        <span>{status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>

            {/* Thông tin sản phẩm */}
            <Row gutter={16}>
              {/* Cột trái: Thông tin sản phẩm */}
              <Col span={12}>
                <div className="border-2 border-gray-300 p-4 rounded-lg bg-gray-50">
                  <h4>Thông tin sản phẩm</h4>
                  <ul className="list-disc pl-5 mt-5">
                    {orderData.OrderProductDetails.map((productDetail, index) => (
                      <li key={index} className="mb-4">
                        <div className="flex items-center">
                          <Image
                            width={80}
                            src={productDetail.Product.RepresentativeImage}
                            alt={productDetail.Product.ProductName}

                          />
                          <div className='ml-5'>
                            <p >
                              <strong>{productDetail.Product.ProductName}</strong>
                            </p>
                            <p>
                              <strong>Giá:</strong>{' '}
                              {parseFloat(productDetail.Product.PromotionalPrice).toLocaleString('vi-VN')} VND
                            </p>
                            <p>
                              <strong>Số lượng:</strong> {productDetail.Quantity}
                            </p>
                            <p>
                              <strong>Tổng giá:</strong>{' '}
                              {(
                                parseFloat(productDetail.Product.PromotionalPrice) * productDetail.Quantity
                              ).toLocaleString('vi-VN')}{' '}
                              VND
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Col>

              {/* Cột phải: Thông tin khách hàng và thanh toán */}
              <Col span={12}>
                {/* Thông tin khách hàng */}
                <div className="border-2 border-gray-300 p-4 rounded-lg bg-gray-50 mb-4">
                  <h4>Thông tin người nhận</h4>
                  <p>
                    <strong>Họ và tên:</strong> {orderData.ShippingAddress.RecipientName}
                  </p>
                  <p>
                    <strong>Số điện thoại:</strong> {orderData.ShippingAddress.PhoneNumber}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong>{' '}
                    {`${orderData.ShippingAddress.Address}`}
                  </p>
                  <p>
                    <strong>Địa chỉ chi tiết:</strong>{' '}
                    {`${orderData.ShippingAddress.SpecificAddress}`}
                  </p>
                </div>

                {/* Thông tin thanh toán */}
                <div className="border-2 border-gray-300 p-4 rounded-lg bg-gray-50">
                  <h4>Thông tin thanh toán</h4>
                  <p>
                    <strong>Phương thức thanh toán:</strong>{' '}
                    {getPaymentMethodName(orderData.PaymentMethodID)}
                  </p>

                  <p>
                    <strong>Trạng thái thanh toán:</strong>{' '}
                    <span style={{ color: orderData.PaymentStatus ? 'green' : 'red' }}>
                      {orderData.PaymentStatus ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </p>

                  <p>
                    <strong>Tổng tiền:</strong>{' '}
                    {orderData.OrderProductDetails.reduce(
                      (total, productDetail) =>
                        total +
                        parseFloat(productDetail.Product.PromotionalPrice) * productDetail.Quantity,
                      0
                    ).toLocaleString('vi-VN')}{' '}
                    VND
                  </p>
                </div>
              </Col>
            </Row>
          </>
        ) : (
          <p>Không có dữ liệu đơn hàng!</p>
        )}
      </Modal>
      <Footer />
    </div>
  );
};

export default LookOrders;
