import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import icons from "../../../utils/icons";

const CustomerReviewProducts = ({ productId }) => {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/get-product-by-id`,
          { params: { id: productId } }
        );
        const fetchedReviews = response.data.Reviews || [];
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const filters = [
    { label: "Tất cả", value: "Tất cả" },
    { label: "Có hình ảnh", value: "Có hình ảnh" },
    { label: "Đã mua hàng", value: "Đã mua hàng" },
  ];

  const ratingFilters = [5, 4, 3, 2, 1];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F2F2F2] w-[1536px] pb-6">
      <div className="ml-[170px] w-full max-w-[785px] mx-auto p-4 border rounded-lg shadow-lg bg-white">
        <div className="mb-6">
          <p className="font-bold text-gray-800 mb-2">Lọc theo</p>
          <div className="flex items-center gap-3 flex-wrap">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  activeFilter === filter.value
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
            {ratingFilters.map((star) => (
              <button
                key={star}
                onClick={() => setActiveFilter(`${star} ⭐`)}
                className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium ${
                  activeFilter === `${star} ⭐`
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {star} <span className="text-yellow-500">⭐</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-4 border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold uppercase">
                  {review.CustomerID[0]}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {review.CustomerID}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.ReviewDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center mt-3 ml-[55px]">
                {Array.from({ length: 5 }, (_, i) => (
                  <icons.FaStar
                    key={i}
                    className={`text-lg ${
                      i < review.RatingLevel
                        ? "text-[#ffbf00]"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-3 text-gray-800 ml-[55px]">{review.ReviewContent}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

CustomerReviewProducts.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
};

export default CustomerReviewProducts;
