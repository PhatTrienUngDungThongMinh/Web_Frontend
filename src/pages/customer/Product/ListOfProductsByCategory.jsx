import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../../components/Client/Header";
import Footer from "../../../components/Client/Footer";
import NavigationBar from "../../../pages/customer/Animations/NavigationBar";
import Animation from "../../../pages/customer/Animations/Animation";
import ProductClassification from "./ProductClassification";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../../components/Client/Loading";
import { path } from "../../../utils/constant";


const ListOfProductsByCategory = () => {
  const [products, setProducts] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredAndSortedProducts, setFilteredAndSortedProducts] = useState([]);
  const [priceFilter, setPriceFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const manufacturerId = queryParams.get("manufacturerId");

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setTimeout(async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/get-products-by-id-manufacturer`,
            {
              params: { id: manufacturerId },
            }
          );
          setProducts(response.data);
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    };

    if (manufacturerId) {
      fetchProducts();
    }

    const fetchManufacturerData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/manufacturers`
        );
        setManufacturers(response.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchManufacturerData();
  }, [manufacturerId]);

  useEffect(() => {
    let updatedProducts = [...products];


    if (priceFilter === "under5") {
      updatedProducts = updatedProducts.filter(
        (product) => parseFloat(product.PromotionalPrice) < 5000000
      );
    } else if (priceFilter === "5to10") {
      updatedProducts = updatedProducts.filter(
        (product) =>
          parseFloat(product.PromotionalPrice) >= 5000000 &&
          parseFloat(product.PromotionalPrice) <= 10000000
      );
    } else if (priceFilter === "10to15") {
      updatedProducts = updatedProducts.filter(
        (product) =>
          parseFloat(product.PromotionalPrice) >= 10000000 &&
          parseFloat(product.PromotionalPrice) <= 15000000
      );
    } else if (priceFilter === "to15") {
      updatedProducts = updatedProducts.filter(
        (product) => parseFloat(product.PromotionalPrice) > 15000000
      );
    }


    if (sortOrder === "price_low") {
      updatedProducts.sort(
        (a, b) =>
          parseFloat(a.PromotionalPrice) - parseFloat(b.PromotionalPrice)
      );
    } else if (sortOrder === "price_high") {
      updatedProducts.sort(
        (a, b) =>
          parseFloat(b.PromotionalPrice) - parseFloat(a.PromotionalPrice)
      );
    } else if (sortOrder === "sold") {
      updatedProducts.sort((a, b) => b.Sold - a.Sold);
    } else if (sortOrder === "newest") {
      updatedProducts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    setFilteredAndSortedProducts(updatedProducts);
  }, [priceFilter, sortOrder, products]);

  const getManufacturerName = (ManufacturerID) => {
    const manufacturer = manufacturers.find(
      (p) => p.id === parseInt(ManufacturerID)
    );
    return manufacturer ? manufacturer.ManufacturerName : "Chưa xác định";
  };

  const handleProductClick = (productId) => {
    navigate(`${path.PRODUCTSDETAILS}/${productId}`);
  };


  return (
    <div className="flex flex-wrap flex-row w-full ">
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-70 z-10">
          <div className="relative -translate-y-[30px]">
            <Loading status={isLoading} />
          </div>
        </div>
      )}
      <div className="w-[1536px]">
        <Header />
      </div>
      <div className="bg-[#F2F2F2] w-[1536px] ">
        <NavigationBar current="Sản phẩm" />
        <Animation />
        <p className="mt-5 ml-[189px] font-bold text-[#333] text-[30px] text-red-600 border-b border-red-600 inline-block w-[1160px]">
          {getManufacturerName(manufacturerId) || "Chưa cập nhật"}
        </p>

        <ProductClassification
          onFilterChange={(filter) => setPriceFilter(filter.priceRange)}
          onSortChange={(sort) => setSortOrder(sort.sortOrder)}
        >

        </ProductClassification>
        <div className="ml-[183px] w-[1170px] flex flex-wrap rounded-lg bg-white mt-2 gap-x-1 gap-y-6 pb-4 mb-4">
          {filteredAndSortedProducts.map((product, index) => (
            <div
              key={index}
              onClick={() => handleProductClick(product.id)}
              className="w-full sm:w-1/2 lg:w-[19%] p-4 ml-[7px] flex flex-col items-center border border-gray-300 rounded-md transition-transform duration-300 hover:scale-105 hover:shadow-lg"
            >
              <img
                src={
                  product.RepresentativeImage
                }
                alt={product.ProductName}
                className="rounded-lg object-cover w-full h-auto"
              />
              <h3 className="mt-2 text-[16px] font-bold text-left">
                {product.ProductName || "Unknown Product"}
              </h3>
              <p className="text-red-500 text-[16px] font-bold">
                {product.PromotionalPrice?.toLocaleString()} ₫
              </p>
              {product.ListedPrice && (
                <p className="text-gray-400 font-medium line-through text-[14px]">
                  {product.ListedPrice.toLocaleString()} ₫
                </p>
              )}
              <p className="text-xs text-gray-600 bg-gray-100 mt-2 p-2 border border-gray-300 rounded-md line-clamp-2">
                {product.Description || "No promotion available"}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListOfProductsByCategory;
