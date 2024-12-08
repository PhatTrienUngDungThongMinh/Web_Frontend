import { useEffect, useState, useMemo } from "react";
import api from "../../../middlewares/tokenMiddleware";
import moment from "moment";
import { message } from "antd";

const PurchaseHistory = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");


  const [expandedOrderIds, setExpandedOrderIds] = useState([]);

  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancelError, setCancelError] = useState(null);
  const fetchPurchaseHistory = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-orders-by-id-customer`
      );
      const sortedReviews = response.data.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setPurchaseHistory(sortedReviews);
      console.log("Dữ liệu purchaseHistory sau khi set:", response.data);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
      setError("Đã xảy ra lỗi khi tải đơn hàng.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPurchaseHistory();
  }, []);

  const filteredPurchaseHistory = useMemo(() => {
    return purchaseHistory.filter((order) => {
      const orderDate = moment(order.OrderDate);
      const isWithinDateRange =
        (!startDate || orderDate.isSameOrAfter(moment(startDate))) &&
        (!endDate || orderDate.isSameOrBefore(moment(endDate)));
      const isStatusMatch =
        selectedStatus === "Tất cả" || order.OrderStatus === selectedStatus;
      return isWithinDateRange && isStatusMatch;
    });
  }, [purchaseHistory, startDate, endDate, selectedStatus]);


  const orderStatuses = [
    "Tất cả",
    "Chờ xác nhận",
    "Đã xác nhận",
    "Đang vận chuyển",
    "Đã giao hàng",
    "Đã hủy",
    "Hoàn thành"
  ];


  const toggleOrderDetails = (orderId) => {
    setExpandedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };


  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Xác nhận hủy đơn hàng?", "", { type: "warning" })) {
      return;
    }
    setCancellingOrderId(orderId);
    setCancelError(null);
    try {
      await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/update-order-status?id=${orderId}`,
        { OrderStatus: "Đã hủy" } 
    );
    fetchPurchaseHistory();
      message.success("Đơn hàng đã được hủy thành công.");
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      message.error("Không thể hủy đơn hàng. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="bg-gray-50 px-6 rounded-md -mt-4 pt-4 shadow-xl w-[870px]">

      <div className="flex items-center justify-between mb-6 flex-wrap ">
        <div className="flex items-center flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Từ ngày
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Đến ngày
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 p-2 rounded"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 md:mt-4 text-[14px] ">
          {orderStatuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded  ${
                selectedStatus === status
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-6 w-[820px] pb-4">
        {loading ? (
          <div className="flex justify-center items-center">
            <svg
              className="animate-spin h-8 w-8 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : filteredPurchaseHistory.length > 0 ? (
          filteredPurchaseHistory.map((order) => {
            const isExpanded = expandedOrderIds.includes(order.id);
            return (
              <div
                key={order.id}
                className="bg-white shadow rounded-lg p-6 flex flex-col gap-4"
              >

                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">Đơn hàng #{order.id}</h2>
                    <p className="text-gray-600">
                      Ngày đặt hàng: {moment(order.OrderDate).format("DD/MM/YYYY")}
                    </p>
                    <p className="text-gray-600">Trạng thái: {order.OrderStatus}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-500">
                      Tổng tiền: {Number(order.TotalAmount).toLocaleString()} VND
                    </p>
                    <p className="text-gray-600">
                      Tổng thanh toán: {Number(order.TotalAmount).toLocaleString()} VND
                    </p>
                    <p className="text-gray-600">Số lượng sản phẩm: {order.OrderProductDetails.length}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleOrderDetails(order.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    {isExpanded ? "Ẩn chi tiết" : "Xem chi tiết"}
                  </button>
                  {isExpanded && (
                    <button
                      onClick={() => toggleOrderDetails(order.id)}
                      className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                      Trở lại
                    </button>
                  )}
                </div>

        
                {isExpanded && (
                  <div className="mt-4 ">
      
                    {order.OrderProductDetails.length > 0 ? (
                      <div className="space-y-4 ">
                        {order.OrderProductDetails.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center gap-4 border-t pt-4"
                          >
                            <img
                              src={product.Product.RepresentativeImage}
                              alt={product.Product.ProductName}
                              className="w-20 h-20 object-cover rounded-md border"
                            />
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold">
                                {product.Product.ProductName}
                              </h3>
                              <p className="text-gray-600">
                                Số lượng: {product.Quantity}
                              </p>
                              <p className="text-gray-600">
                                Giá: {Number(product.UnitPrice).toLocaleString()} VND
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-600">
                                Thành tiền:{" "}
                                {(Number(product.UnitPrice) * product.Quantity).toLocaleString()}{" "}
                                VND
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">Không có sản phẩm nào trong đơn hàng này.</p>
                    )}

 
                    {order.OrderStatus === "Chờ xác nhận" && (
                      <div className="mt-4">
                        {cancelError && (
                          <p className="text-red-500 mb-2">{cancelError}</p>
                        )}
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="bg-red-500 text-white px-4 py-2 rounded"
                          disabled={cancellingOrderId === order.id}
                        >
                          {cancellingOrderId === order.id ? "Đang hủy..." : "Hủy đơn hàng"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-[15px]">Không có đơn hàng nào phù hợp với bộ lọc đã chọn.</p>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;
