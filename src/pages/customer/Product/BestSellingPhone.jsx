import { NavLink } from "react-router-dom";
import { path } from "../../../utils/constant";
import icons from "../../../utils/icons";
import ListBestSellingProducts from "./ListBestSellingProducts";
import PropTypes from "prop-types";

const BestSellingPhone = ({categoryId}) => {
  const handleLinkClick = () => {
    window.scrollTo(0, 0);
  };
  const getCategoryName = (id) => {
    switch(id) {
      case '1':
        return "Điện thoại bán chạy";
      case '2':
        return "Laptop bán chạy";
      case '3':
        return "Máy tính bảng bán chạy";
      case '4':
        return "Đồng hồ bán chạy";
      case '5':
        return "Phụ kiện bán chạy";
      case '6':
        return "Gia dụng bán chạy";
      case '7':
        return "Tivi bán chạy";
      case '8':
        return "PC bán chạy";
      default:
        return "Điện thoại bán chạy";  
    }
  };
  return (
    <div className="w-full bg-[#F2F2F2] flex flex-col relative py-4">
      <div className="flex justify-between w-full h-[608px] mx-auto py-6 bg-white rounded-lg md:w-[1170px] md:h-[608px] md:mx-auto md:py-6 md:bg-white md:rounded-lg md:flex md:justify-between">
        <div className="font-bold text-[22px] ml-6 mt-2 whitespace-nowrap md:ml-6 md:mt-2 md:whitespace-nowrap">
        {getCategoryName(categoryId)}
        </div>
        <NavLink
          to={`${path.LISTPRODUCTS}?categoryId=${categoryId}`}
          className="w-[110px] h-[31px] whitespace-nowrap text-blue-500 rounded-[30px] bg-slate-200 text-[13px] mr-2 flex justify-center items-center gap-1 relative z-10 mt-2 md:w-[110px] md:h-[31px] md:whitespace-nowrap md:text-blue-500 md:rounded-[30px] md:bg-slate-200 md:text-[13px] md:mr-2 md:flex md:justify-center md:items-center md:gap-1 md:relative md:z-10 md:mt-2"
          onClick={handleLinkClick}
        >
          Xem tất cả
          <icons.IoIosArrowForward />
        </NavLink>
      </div>

      <div className="flex flex-row -mt-[550px] md:-mt-[550px]">
        <ListBestSellingProducts categoryId={categoryId} />
      </div>
    </div>
  );
};
BestSellingPhone.propTypes = {
  categoryId: PropTypes.string.isRequired, 
};
export default BestSellingPhone;
