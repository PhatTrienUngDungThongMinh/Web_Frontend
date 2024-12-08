import { useEffect, useState } from "react";
import axios from "axios";
import { path } from "../../../utils/constant";
import { NavLink } from "react-router-dom";

const Category = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/categories`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full bg-[#F2F2F2]">
      <div className="w-full max-w-[1170px] mx-auto py-12 bg-white rounded-lg px-[50px]">
        <h2 className="text-xl font-bold mb-8 -ml-4 -mt-2">Danh mục nổi bật</h2>
        <div className="flex flex-wrap justify-between text-[12px] gap-4 -mt-4">
          {categories.map((category, index) => (
            <NavLink
              key={index}
              to={`${path.LISTPRODUCTS}?categoryId=${category.id}`}
              className={`flex flex-col items-center bg-pink-100 p-4 rounded-lg group hover:scale-110 transition-transform duration-300 relative ${
                index > 4 ? "hidden lg:flex" : ""
              }`}
              style={{ width: "95px", height: "95px" }}
            >
              <img
                src={category.pathImg}
                className={`mb-4  ${index === 1 ? "mt-5" : ""}   
          ${index === 6 ? "-mt-3.5" : ""}   
          ${index === 7 ? "-mt-1.5" : ""}`}
              />
              <span className="text-[13px] font-bold text-nowrap mt-4">
                {category.CategoryName}
              </span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
