import { useContext } from "react";
import Footer from "../../../components/Client/Footer";
import Header from "../../../components/Client/Header";
import { NavLink, useNavigate } from "react-router-dom";
import icons from "../../../utils/icons";
import { CartContext } from "./CartContext";
import { path } from "../../../utils/constant";
import { message } from "antd";

const ShoppingCart = () => {
  const { cartItems, setCartItems, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();
  const handleCheckout = () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      message.warning("Bạn ơi. Bạn đã quên đăng nhập kìa! Bạn vui lòng đăng nhập để tiếp tục thanh toán!");
      return; 
    }
    if (cartItems.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }
    console.log(cartItems);
    navigate(path.PAYMENTINFO, { state: { cartItems } });
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleIncreaseQuantity = (productId, color = null) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === productId && (item.color === color || !item.color)
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCartItems(updatedCartItems);
  };

  const handleDecreaseQuantity = (productId, color = null) => {
    const updatedCartItems = cartItems.map((item) =>
      item.id === productId &&
      (item.color === color || !item.color) &&
      item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCartItems);
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const totalAmount = cartItems.reduce((total, item) => {
    const price =
      typeof item.price === "string"
        ? parseFloat(item.price.replace(/\D/g, ""))
        : item.price;

    return total + price * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <div>
        <Header />
      </div>

      <div className="flex-grow bg-[#F0F0F0] flex flex-col items-center py-5">
        {cartItems.length === 0 ? (
          <div className="w-[758.4px] h-[240px] bg-[#FFFFFF] flex flex-col justify-center items-center text-center rounded-lg gap-5">
            <p className="text-gray-500">
              Không có sản phẩm nào trong giỏ hàng
            </p>
            <button className="w-[300px] h-[41.6px] border border-blue-500 text-blue-500 font-bold rounded-md">
              <NavLink to="/">VỀ TRANG CHỦ</NavLink>
            </button>
          </div>
        ) : (
          <div className="w-[758.4px] bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-[17px]  mb-2">
              Có {cartItems.length}
              <span className="font-semibold"> sản phẩm</span> trong giỏ hàng
            </h2>
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center ml-4 justify-between border-b-2 py-4 last:border-b-0"
              >
                <img
                  src={item.imgSrc}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />

                <div className="flex-1 ml-4">
                  <p className="font-semibold text-base">{item.name}</p>
                  {item.color && (
                    <p className="text-gray-500 text-sm">
                      Màu sắc: {item.color}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2 -mt-4">
                  <button
                    className=" hover:text-[#e0052b] mr-1"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <icons.RiDeleteBin5Line size={20} />
                  </button>
                  <div className="flex items-center text-[20px]  space-x-1 bg-slate-200 rounded-2xl">
                    <button
                      className="w-8 h-8 rounded-full  flex items-center justify-center text-black"
                      onClick={() =>
                        handleDecreaseQuantity(item.id, item.color)
                      }
                    >
                      <icons.IoIosRemoveCircle />
                    </button>
                    <span className="font-semibold">{item.quantity}</span>
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center text-black"
                      onClick={() =>
                        handleIncreaseQuantity(item.id, item.color)
                      }
                    >
                      <icons.IoIosAddCircle />
                    </button>
                  </div>
                </div>
                <p className="text-red-500 font-bold text-base -mt-4 ml-6">
                  {formatPrice(
                    parseFloat(item.price.replace(/\D/g, "")) * item.quantity
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
        {cartItems.length > 0 && (
          <div className="w-[758.4px] bg-[#f5f5f5] p-4 rounded-b-lg shadow-md flex justify-between items-center">
            <p className="text-[#e0052b] font-bold text-[12px] mt-[50px]">
              Chính sách hoàn tiền khi thanh toán online
            </p>
            <div className="flex flex-col items-end text-[14px]">
              <div className="text-right flex items-center mb-6">
                <p className="font-semibold mr-[70px]">
                  Tổng tiền ({cartItems.length} sản phẩm):
                </p>
                <p className="text-[#e0052b] font-bold">
                  {formatPrice(totalAmount)}
                </p>
              </div>
              <button
                onClick={handleCheckout}
                className="bg-[#e0052b] mr-4 text-white font-semibold py-3 px-6 rounded-3xl hover:bg-red-600 transition"
              >
                MUA NGAY
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ShoppingCart;
