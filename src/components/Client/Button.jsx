import { useEffect, useState, useRef } from "react";
import axios from "axios";
import icons from "../../utils/icons";
import React from "react";
import { useNavigate } from "react-router-dom";
import { path } from "../../utils/constant";
const {
  BsFillPhoneFill,
  BsFillLaptopFill,
  FaTablet,
  IoWatchSharp,
  IoHeadset,
  GiRiceCooker,
  HiMiniTv,
  FaLaptopCode,
} = icons;

const availableIcons = {
  BsFillPhoneFill,
  BsFillLaptopFill,
  FaTablet,
  IoWatchSharp,
  IoHeadset,
  GiRiceCooker,
  HiMiniTv,
  FaLaptopCode,
};

const Button = () => {
  const [categories, setCategories] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const categoryRef = useRef(null); 
  const productTypesRef = useRef(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/categories`
        );
        const updatedCategories = response.data.map((category, index) => ({
          ...category,
          icon: Object.keys(availableIcons)[
            index % Object.keys(availableIcons).length
          ],
        }));
        setCategories(updatedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchProductTypes = async (categoryId) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/get-all-manufacturer-Of-Product-By-Category?id=${categoryId}`
      );
      setProductTypes(response.data);
    } catch (error) {
      console.error("Error fetching product types:", error);
      setProductTypes([]);
    }
  };

  const handleMouseEnter = (category) => {
    setHoveredCategory(category);
    fetchProductTypes(category.id);
  };

  const handleMouseLeave = (event) => {
    const relatedTarget = event.relatedTarget;
    
    if (relatedTarget && relatedTarget.nodeType === 1) { 
      if (
        categoryRef.current &&
        !categoryRef.current.contains(relatedTarget) &&
        productTypesRef.current &&
        !productTypesRef.current.contains(relatedTarget)
      ) {
        setHoveredCategory(null);
        setProductTypes([]);
      }
    } else {
      setHoveredCategory(null);
      setProductTypes([]);
    }
  };
  
  const handleManufacturerClick = (manufacturerId) => {
    navigate(`${path.LISTOFPRODUCTSBYCATEGORY}?manufacturerId=${manufacturerId}`);
  };
  

  return (
    <div
      className="w-full bg-white relative group"
      ref={categoryRef}
      onMouseLeave={handleMouseLeave}
    >

      <div className="w-full max-w-[1170px] mx-auto bg-white rounded-lg">
        <div className="flex justify-between gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-lg h-[50px] "
         
              onMouseEnter={() => handleMouseEnter(category)}
            >
              {category.icon && (
                <span className="text-[16px]">
                  {React.createElement(availableIcons[category.icon])}
                </span>
              )}

              <span className="text-[13px] font-medium whitespace-nowrap ">
                {category.CategoryName}
              </span>
            </div>
          ))}
        </div>
      </div>

      {hoveredCategory && (
        <div
          className="absolute top-full left-0 w-screen h-[250px] bg-white opacity-100 transition-opacity duration-300 z-50 border-y border-gray-300"
          ref={productTypesRef}
        >
          <div className="p-4 max-w-[1170px] mx-auto">
            <h3 className="font-bold text-lg mb-4">Chọn theo hãng</h3>
            <div className="grid grid-cols-3 gap-2">
              {productTypes.map((type) => (
                <div
                  key={type.id}
                  className="rounded-md shadow-sm hover:bg-gray-50 transition"
                  onClick={() => handleManufacturerClick(type.id)}
                >
                  <span className="text-sm font-medium text-gray-500 hover:cursor-pointer">
                    {type.ManufacturerName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Button;
