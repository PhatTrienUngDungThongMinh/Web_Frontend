import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import icons from "../../../utils/icons";
import { useNavigate } from "react-router-dom";
import { path } from "../../../utils/constant";
import PropTypes from "prop-types";
import "swiper/css";
import "swiper/css/navigation";

const getImagePath = (imageName) => {
  if (!imageName) return "";
  return new URL(`../../../assets/client/${imageName}`, import.meta.url).href;
};

const ListBestSellingProducts = ({ categoryId }) => {
  const [products, setProducts] = useState([]);
  const swiperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/get-product-by-id-category`,
          {
            params: { id: categoryId },
          }
        );

        const warrantyResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/warranty-policies`
        );

        const combinedProducts = productResponse.data.map((product, index) => {
          const warrantyImg =
            warrantyResponse.data[index % warrantyResponse.data.length]
              ?.ImgProfile || "";
          return { ...product, warrantyImg };
        });
        combinedProducts.sort((a, b) => b.Sold - a.Sold);
        setProducts(combinedProducts);
      } catch (error) {
        console.error("Error fetching products or warranty policies:", error);
      }
    };

    if (categoryId) fetchProducts();
  }, [categoryId]);
  const handleProductClick = (productId) => {
    navigate(`${path.PRODUCTSDETAILS}/${productId}`);
  };

  const nextSlide = () => {
    swiperRef.current?.slideNext();
  };

  const prevSlide = () => {
    swiperRef.current?.slidePrev();
  };

  return (
    <div className="flex flex-wrap mx-auto flex-row relative items-center group sm:px-8 lg:px-16">
      <button
        onClick={prevSlide}
        className="absolute -left-6 sm:ml-4 md:ml-8 lg:ml-16 transform -translate-y-1/2 z-10 opacity-75 hover:opacity-100 transition-opacity duration-300"
      >
        <icons.IoIosArrowDropleftCircle className="text-gray-200 text-4xl" />
      </button>

      <div className="w-full mt-8 placeholder:flex flex-wrap rounded-lg group relative mx-auto">
        <Swiper
          slidesPerView={5}
          spaceBetween={10}
          loop={true}
          navigation={false}
          className="w-[1150px] h-[420px] mx-auto"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {products.map((product, index) => (
            <SwiperSlide key={index}>
              <div
                key={index}
                onClick={() => handleProductClick(product.id)}
                className="p-4 flex flex-col items-start border border-gray-300 rounded-md shadow-sm  hover:shadow-xl  relative overflow-hidden"
              >
                <div className=" group relative">
                  {product.warrantyImg && (
                    <div className="absolute top-[70%] -left-1 z-10 transition-transform duration-300 hover:scale-110">
                      <img
                        src={getImagePath(product.warrantyImg)}
                        alt="Warranty Policy"
                        className="w-16 h-16 rounded-md"
                      />
                    </div>
                  )}

                  <img
                    src={product.RepresentativeImage}
                    alt={product.ProductName}
                    className="w-full h-auto object-cover transition-transform duration-300 hover:scale-[1.13]"
                  />
                </div>

                <h3
                  className="mt-6 text-[16px] font-bold text-left"
                  style={{ minHeight: "40px" }}
                >
                  {product.ProductName || "Unknown Product"}
                </h3>

                <p className="text-[16px] font-bold text-red-500 text-left">
                  {product.PromotionalPrice.toLocaleString() + " ₫"}
                </p>
                <p
                  className="text-[16px] font-bold text-[#bdbdbd] text-left line-through"
                  style={{ minHeight: "20px" }}
                >
                  {product.ListedPrice.toLocaleString() + " ₫"}
                </p>

                <p
                  className="text-xs text-gray-600 bg-gray-100 mt-2 p-2 border border-gray-300 rounded-md group-hover:bg-gray-200 line-clamp-2"
                  style={{ minHeight: "50px" }}
                >
                  {product.Description || "No promotion available"}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <button
        onClick={nextSlide}
        className="absolute -right-2 mr-14 transform -translate-y-1/2 z-10 opacity-75 hover:opacity-100 transition-opacity duration-300"
      >
        <icons.IoIosArrowDroprightCircle className="text-gray-200 text-4xl" />
      </button>
    </div>
  );
};
ListBestSellingProducts.propTypes = {
  categoryId: PropTypes.string.isRequired,
};
export default ListBestSellingProducts;
