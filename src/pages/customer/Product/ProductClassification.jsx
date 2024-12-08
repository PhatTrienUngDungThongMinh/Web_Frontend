import icons from "../../../utils/icons";
import PropTypes from "prop-types";

const ProductClassification = ({ onFilterChange, onSortChange   }) => {


  const handleAction = (type, value) => {
    if (type === "filter") {
      onFilterChange({ priceRange: value, sortOrder: "" });
    } else if (type === "sort") {
      onSortChange({ priceRange: "", sortOrder: value });
    }
  };

  return (
    <div className="p-6 w-full max-w-[1536px] mx-auto flex justify-center bg-[#F2F2F2] -mb-12">
      <div className="w-full lg:w-[1170px] bg-white rounded-2xl">

        {/* Lọc theo */}
        <div className="mt-6 flex flex-col mb-4 ml-6 text-[#333]">
          <span className="mr-4 font-bold">Lọc theo</span>
          <div className="flex flex-wrap mt-2 text-[14px]">
            <p className="rounded-md px-3 py-1 mr-2 flex items-center gap-1">
              <icons.FaFilter />
              Mức giá:
            </p>
            <button
              onClick={() => handleAction("filter", "under5")}
              className="border border-gray-200 rounded-md px-3 py-1 mr-2 flex items-center gap-1"
            >
              Dưới 5 triệu
            </button>
            <button
              onClick={() => handleAction("filter", "5to10")}
              className="border border-gray-200 rounded-md px-3 py-1 mr-2 flex items-center gap-1"
            >
              Từ 5 - 10 triệu
            </button>
            <button
              onClick={() => handleAction("filter", "10to15")}
              className="border border-gray-200 rounded-md px-3 py-1 mr-2 flex items-center gap-1"
            >
              Từ 10 - 15 triệu
            </button>
            <button
              onClick={() => handleAction("filter", "to15")}
              className="border border-gray-200 rounded-md px-3 py-1 mr-2 flex items-center gap-1"
            >
              Trên 15 triệu
            </button>
          </div>
        </div>

        {/* Sắp xếp theo */}
        <div className="flex flex-col mb-8 ml-6 text-[#333]">
          <span className="mr-4 font-bold">Sắp xếp theo</span>
          <div className="flex flex-wrap mt-2 text-[14px]">
            <button
              className="border border-gray-200 rounded-md px-3 py-1 mr-2"
              onClick={() => handleAction("sort", "newest")}
            >
              Mới nhất
            </button>
            <button
              className="border border-gray-200 rounded-md px-3 py-1 mr-2"
              onClick={() => handleAction("sort", "sold")}
            >
              Bán chạy
            </button>
            <button
              className="border border-gray-200 rounded-md px-3 py-1 mr-2"
              onClick={() => handleAction("sort", "price_high")}
            >
              Giá cao - thấp
            </button>
            <button
              className="border border-gray-200 rounded-md px-3 py-1 mr-2"
              onClick={() => handleAction("sort", "price_low")}
            >
              Giá thấp - cao
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductClassification.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default ProductClassification;
