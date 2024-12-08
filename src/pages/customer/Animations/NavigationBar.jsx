import { Link } from "react-router-dom";
import icons from "../../../utils/icons";
import PropTypes from 'prop-types';

const NavigationBar = ({ current }) => {
  return (
    <nav className="flex items-center mt-1.5 text-[14px] ml-[10px] sm:ml-[183px]">
      <Link
        to="/"
        className="flex items-center text-gray-500 hover:text-gray-700"
      >
        <icons.FaHome className="mr-2" />
        Trang chủ
      </Link>
      <span className="text-gray-500 mx-2">›</span>
      <span className="text-[#333]">{current}</span>
    </nav>
  );
};
NavigationBar.propTypes = {
  current: PropTypes.any.isRequired // hoặc xác định kiểu chính xác, ví dụ: PropTypes.string hoặc PropTypes.number
};
export default NavigationBar;
