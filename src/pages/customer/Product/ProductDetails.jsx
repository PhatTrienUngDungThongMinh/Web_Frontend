import { useState, useContext, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import NavigationBar from "../../../pages/customer/Animations/NavigationBar";
import Footer from "../../../components/Client/Footer";
import Header from "../../../components/Client/Header";
import icons from "../../../utils/icons";
import { CartContext } from "../ShoppingCart/CartContext";
import { useParams } from "react-router-dom";
import axios from "axios";
import { message } from "antd";
import api from "../../../middlewares/tokenMiddleware";

const ProductDetails = () => {
  const { productId } = useParams();

  // State quản lý dữ liệu sản phẩm và các trạng thái khác
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [selectedColorIndex, setSelectedColorIndex] = useState(null);
  const [swiperRef, setSwiperRef] = useState(null);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [showMoreDesc, setShowMoreDesc] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [reviews, setReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showMore, setShowMore] = useState(false);


  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/get-product-by-id`,
          {
            params: { id: productId },
          }
        );
        setProduct(response.data);
        const sortedReviews = response.data.Reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(sortedReviews);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setProduct(null);
        setLoading(false);
      }
    };

    if (productId) fetchProductDetails();
  }, [productId]);

  const handleColorClick = (index) => {
    setSelectedColorIndex(index);
  };

  const handleBuyNow = () => {
    if (product?.Colors?.length > 0) {
      if (selectedColorIndex !== null && product?.Colors) {
        const selectedColor = product.Colors[selectedColorIndex];
        if (selectedColor) {
          const selectedProduct = {
            id: product.id,
            name: product.ProductName,
            price: product.PromotionalPrice,
            color: selectedColor.ColorName,
            imgSrc: product.RepresentativeImage,
            quantity: 1,
          };
  
          addToCart(selectedProduct);
          message.success(
            "Đã thêm vào giỏ hàng thành công! nhanh tay vào mục giỏ hàng để thanh toán sản phẩm nhé."
          );
        } else {
          message.error("Lỗi: Không thể lấy thông tin màu sắc.");
        }
      } else {
        message.error("Vui lòng chọn màu sắc.");
      }
    } else {
      const selectedProduct = {
        id: product.id,
        name: product.ProductName,
        price: product.PromotionalPrice,
        imgSrc: product.RepresentativeImage,
        quantity: 1,
      };
  
      addToCart(selectedProduct);
      message.success(
        "Đã thêm vào giỏ hàng thành công! nhanh tay vào mục giỏ hàng để thanh toán sản phẩm nhé."
      );
    }
  };
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const submitReview = async () => {
    const userToken = localStorage.getItem("token");
    const userName = localStorage.getItem("username");
    if (!userToken) {
      message.warning("Vui lòng đăng nhập để sử dụng tính năng này!");
      return;
    }

    if (reviewContent.length < 15) {
      message.error("Xin mời nhập tối thiểu 15 ký tự cho đánh giá.");
      return;
    }

    try {
      const bought = await api.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/get-status-bought-product`,
        {
            params: { id: product.id },
        }
      );
      const newReview = {
        ReviewContent: reviewContent,
        RatingLevel: rating,
        ReviewDate: new Date().toISOString(),
        Bought:bought.data.bought,
        Customer: { CustomerName: userName },
      };
      await api.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/re-view`,
        newReview, 
        {
            params: { id: product.id }, // Query parameter
        }
    );
      setReviews([newReview, ...reviews]);
      setReviewContent("");
      closeModal();
      message.success("Đội ngũ 3Friend cảm ơn bạn đã đánh giá sản phẩm của chúng tôi!");
    } catch (error) {
      console.error("Error submitting review:", error);
      message.error("vui lòng thử lại sau!");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Sản phẩm không tồn tại.</p>
      </div>
    );
  }

  return (
    <div className="flex-col w-full">
      <Header />
      <div className="bg-gray-100 w-full py-2">
        <NavigationBar current="Chi tiết sản phẩm" />
      </div>
      <div className="bg-gray-100 w-full flex justify-center items-center py-6">
        <div className="w-full max-w-screen-xl flex flex-col lg:flex-row bg-white rounded-xl shadow-md">
          <div className="w-full lg:w-1/2 p-4">
            <div className="font-bold text-2xl">{product.ProductName}</div>
            <div className="flex mt-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="p-1 rounded-full">
                  <icons.FaStar
                    key={i}
                    className={`${
                      i <
                      Math.round(
                        reviews.reduce(
                          (acc, curr) => acc + curr.RatingLevel,
                          0
                        ) / reviews.length || 0
                      )
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </span>
              ))}
              <span className="text-gray-500 ml-4">
                {reviews.length} đánh giá
              </span>
              <span className="text-gray-500 ml-4">
                {product.Sold > 9999 ? `9.999+` : `${product.Sold}`} lượt đã bán
              </span>
              <span className="text-gray-500 ml-4">
                Kho: {product.Sold > 9999 ? `9.999+` : `${product.Stock}`} sản phẩm
              </span>
            </div>
            <div className="flex space-x-2 mt-4 items-center">
              <p className="text-red-500 text-2xl font-bold">
                {product.PromotionalPrice?.toLocaleString()} ₫
              </p>
              {product.ListedPrice && (
                <p className="text-gray-400 font-medium text-lg line-through">
                  {product.ListedPrice.toLocaleString()} ₫
                </p>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">Đã bao gồm thuế VAT</p>

            <div className="flex mt-6 justify-center items-center relative">
              <button
                onClick={() => {
                  if (swiperRef) swiperRef.slidePrev();
                }}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
              >
                <icons.IoIosArrowDropleftCircle className="text-gray-400 text-3xl" />
              </button>

              <Swiper
                modules={[Autoplay]}
                autoplay={{ delay: 5000 }}
                loop
                className="w-full max-w-md h-[400px] "
                onSwiper={(swiper) => setSwiperRef(swiper)}
              >
                {product.Images && product.Images.length > 0 ? (
                  product.Images.map((image, index) => (
                    <SwiperSlide
                      key={index}
                      className="flex justify-center items-center h-[400px]"
                    >
                      <img
                        src={image.FilePath}
                        alt={`Product ${index + 1}`}
                        className="rounded-lg object-cover w-[400px] h-[400px] "
                      />
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide className="flex justify-center items-center h-[333px]">
                    <img
                      src={product.RepresentativeImage}
                      alt="Representative Image"
                      className="rounded-lg object-cover w-[333px] h-[333px]"
                    />
                  </SwiperSlide>
                )}
              </Swiper>

              <button
                onClick={() => {
                  if (swiperRef) swiperRef.slideNext();
                }}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
              >
                <icons.IoIosArrowDroprightCircle className="text-gray-400 text-3xl" />
              </button>
            </div>
          </div>

          <div className="flex flex-col p-4 w-full lg:w-1/2">
            <h2 className="text-lg font-semibold">LỰA CHỌN MÀU SẮC</h2>
            {product.Colors && product.Colors.length > 0 ? (
              <div className="flex items-center space-x-4 mt-2 text-sm">
                {product.Colors.map((color, index) => (
                  <button
                    key={color.id}
                    className={`border p-2 rounded-lg flex text-center gap-2 w-24 ${
                      selectedColorIndex === index
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    onClick={() => handleColorClick(index)}
                  >
                    <p>{color.ColorName}</p>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-2">
                Sản phẩm này không có tùy chọn màu sắc.
              </p>
            )}


            <div className="bg-gray-50 mt-4 rounded-lg border border-gray-300">
              <div className="flex justify-between items-center mt-3 mx-2 mb-4">
                <p className="text-sm font-bold">
                  Chính sách bảo hành và đổi trả
                </p>
              </div>

              <div className="px-4 pb-4">
                <div
                  className={`relative overflow-hidden transition-all duration-300 ${
                    showMore ? "max-h-full" : "max-h-[360px]"
                  }`}
                >
                  {product.WarrantyPolicy?.PolicyContent.split("\n").map(
                    (line, index) => (
                      <p key={index} className="text-sm">
                        {line}
                      </p>
                    )
                  )}


                  {product.WarrantyPolicy?.WarrantyConditions.split("\n").map(
                    (line, index) => (
                      <p key={index} className="text-sm">
                        {line}
                      </p>
                    )
                  )}
                </div>


                <div className="flex justify-center">
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="bg-white py-2 px-4 mt-4 rounded-2xl flex items-center justify-center text-sm gap-1 shadow-md"
                  >
                    {showMore ? "Ẩn bớt" : "Đọc thêm"}
                    {showMore ? (
                      <icons.IoIosArrowUp />
                    ) : (
                      <icons.IoIosArrowDown />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {product.IsDeleted ? (
              <>
                <div className="bg-gray-500 flex flex-col items-center justify-center rounded-lg mt-6 h-16">
                  <button
                    className="text-white text-xl font-bold w-full h-full"
                    disabled
                  >
                    Sản phẩm đã ngưng kinh doanh mặt hàng này!
                  </button>
                </div>
              </>
            ) : (
              <>
                {product.Stock > 0 ? (
                  <div className="bg-red-600 flex flex-col items-center justify-center rounded-lg mt-6 h-16">
                    <button
                      onClick={handleBuyNow}
                      className="text-white text-xl font-bold w-full h-full"
                    >
                      Thêm vào giỏ hàng
                      <span className="text-white font-medium text-sm block">
                        Thoải mái lựa chọn, xem hàng tại nhà
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-red-600 flex flex-col items-center justify-center rounded-lg mt-6 h-16">
                    <button className="text-white text-xl font-bold w-full h-full">
                      Sản phẩm đã hết. xin vui lòng quay lại sau!
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-100 ">
        <div className="max-w-screen-xl mx-auto flex flex-col lg:flex-row gap-6">
          <div className="bg-white rounded-xl p-6 flex-1">
            <h2 className="text-xl font-semibold mb-4">Đặc điểm nổi bật</h2>
            <div
              className={`relative overflow-hidden transition-all duration-300 ${
                showMoreDesc ? "max-h-full" : "max-h-[360px]"
              }`}
            >
              <div className="space-y-4">
                {product.Description.split("\n")
                  .reduce((acc, line, index) => {
                    const groupIndex = Math.floor(index / 2);
                    if (!acc[groupIndex]) {
                      acc[groupIndex] = [];
                    }
                    acc[groupIndex].push(line);
                    return acc;
                  }, [])
                  .map((group, idx) => (
                    <div key={idx}>
                      {group.map((line, lineIdx) => (
                        <p key={lineIdx} className="text-sm">
                          {line}
                        </p>
                      ))}
                      {idx !==
                        product.Description.split("\n").length / 2 - 1 && (
                        <div className="my-4" />
                      )}
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex justify-center ">
              <button
                onClick={() => setShowMoreDesc(!showMoreDesc)}
                className="bg-white py-2 px-4 mt-4 rounded-2xl flex items-center justify-center text-sm gap-1 shadow-md"
              >
                {showMoreDesc ? "Ẩn bớt" : "Đọc thêm"}
                {showMoreDesc ? (
                  <icons.IoIosArrowUp />
                ) : (
                  <icons.IoIosArrowDown />
                )}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 w-full lg:w-1/3 h-[500px]">
            <h2 className="text-xl font-semibold mb-4">Thông số kỹ thuật</h2>
            <div className="space-y-4">
              {product.ProductAttributeDetails &&
                Array.from(
                  new Set(
                    product.ProductAttributeDetails.map(
                      (attr) => attr.ProductAttribute.AttributeName
                    )
                  )
                )
                  .slice(0, 8)
                  .map((attributeName, index) => {
                    const firstAttr = product.ProductAttributeDetails.find(
                      (attr) =>
                        attr.ProductAttribute.AttributeName === attributeName
                    );
                    return (
                      <div
                        key={index}
                        className={`flex justify-between text-sm py-1 ${
                          index % 2 === 0 ? "bg-gray-100" : ""
                        }`}
                      >
                        <span className="font-medium">{attributeName}</span>
                        <span>{firstAttr.AttributeValue}</span>
                      </div>
                    );
                  })}
            </div>

            <div className="flex justify-center py-4">
              <button
                onClick={() => setShowAllSpecs(true)}
                className="text-blue-600 px-4 py-2  mt-4 bg-gray-100 rounded-lg flex items-center gap-1"
              >
                Xem cấu hình chi tiết
                <icons.IoIosArrowForward />
              </button>
            </div>

            {showAllSpecs && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-2/5 max-w-2xl h-3/4 overflow-auto relative">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                    onClick={() => setShowAllSpecs(false)}
                  >
                    ✖
                  </button>
                  <h2 className="text-xl font-semibold mb-4 text-center">
                    Chi tiết thông số kỹ thuật
                  </h2>
                  <div className="space-y-4">
                    {product.ProductAttributeDetails &&
                      product.ProductAttributeDetails.map((attr) => (
                        <div
                          key={attr.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="font-medium">
                            {attr.ProductAttribute.AttributeName}
                          </span>
                          <span>{attr.AttributeValue}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-100 py-6">
        <div className="max-w-screen-xl mx-auto bg-white rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Đánh giá & nhận xét</h2>

          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold">
                {(
                  reviews.reduce((acc, curr) => acc + curr.RatingLevel, 0) /
                    reviews.length || 0
                ).toFixed(1)}
                /5
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <icons.FaStar
                    key={i}
                    className={`${
                      i <
                      Math.round(
                        reviews.reduce(
                          (acc, curr) => acc + curr.RatingLevel,
                          0
                        ) / reviews.length || 0
                      )
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={openModal}
              className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 mt-4 md:mt-0"
            >
              Viết đánh giá
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {reviews.length > 0 ? (
              (showAllReviews ? reviews : reviews.slice(0, 5)).map((review) => (
                <div
                  key={review.id}
                  className="p-4 border border-gray-200 rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold uppercase">
                      {review.Customer.CustomerName[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {review.Customer.CustomerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(review.ReviewDate))}
                      </p>
                      {review.Bought ? (
                        <p className="text-sm text-green-500">Đã mua hàng</p>
                      ) : (
                        <p className="text-sm text-red-500">Chưa mua hàng</p>
                      )}                      
                    </div>
                  </div>
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <icons.FaStar
                        key={i}
                        className={`${
                          i < review.RatingLevel
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-gray-800">{review.ReviewContent}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Chưa có đánh giá nào.</p>
            )}
          </div>

          {reviews.length > 5 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="text-blue-600"
              >
                {showAllReviews ? "Ẩn bớt" : "Xem tất cả"}
              </button>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white max-w-lg w-full p-6 rounded-lg shadow-lg relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>

            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
              Đánh giá & nhận xét
            </h2>
            <h3 className="text-lg text-gray-600 text-center mb-6">
              <span>{product?.ProductName || "Sản phẩm"}</span> | Chính hãng
              VN/A
            </h3>

            <div className="mb-6">
              <p className="font-semibold text-gray-800 mb-2">Đánh giá chung</p>
              <div className="flex justify-between items-center">
                {["Rất tệ", "Tệ", "Bình thường", "Tốt", "Tuyệt vời"].map(
                  (label, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setRating(index + 1)}
                      className="flex flex-col items-center"
                    >
                      <span
                        className={`text-2xl transition-transform ${
                          index + 1 <= rating
                            ? "text-yellow-400"
                            : "text-gray-400 hover:text-yellow-400"
                        }`}
                      >
                        <icons.FaStar />
                      </span>
                      <p
                        className={`text-sm mt-1 transition-colors ${
                          index + 1 <= rating
                            ? "text-gray-800 "
                            : "text-gray-400 "
                        }`}
                      >
                        {label}
                      </p>
                    </button>
                  )
                )}
              </div>
            </div>

            <textarea
              placeholder="Xin mời chia sẻ một số cảm nhận về sản phẩm (nhập tối thiểu 15 ký tự)"
              className="w-full border border-gray-300 rounded-lg p-3 mb-6 focus:outline-none focus:ring-1 focus:ring-blue-300"
              rows="4"
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
            ></textarea>

            <button
              onClick={submitReview}
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              Gửi đánh giá
            </button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductDetails;
