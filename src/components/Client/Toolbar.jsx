import { NavLink, useNavigate } from "react-router-dom";
import icons from "../../utils/icons";
import { path } from "../../utils/constant";
import logoFriends from "../../assets/admin/3Friends.png";
import { useEffect, useState } from "react";
import login1 from "../../assets/client/login1.png";

function Toolbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(storedHistory);
  }, []);
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      const updatedHistory = [
        searchTerm,
        ...searchHistory.filter((term) => term !== searchTerm),
      ].slice(0, 10);
      setSearchHistory(updatedHistory);
      localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
      navigate(`${path.CATALOGSEARCH}?query=${searchTerm}`);
      setShowHistory(false);
    }
  };
  const handleHistoryClick = (term) => {
    setSearchTerm(term);
    setShowHistory(false);
    navigate(`${path.CATALOGSEARCH}?query=${term}`);
  };
  const handleInputFocus = () => {
    if (searchHistory.length > 0) {
      setShowHistory(true);
    }
  };
  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("searchHistory");
  };
  const handleInputBlur = () => {
    setTimeout(() => setShowHistory(false), 200);
  };

  const [token, setToken] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  useEffect(() => {
    const storedUsername = localStorage.getItem("token");
    if (storedUsername) {
      setToken(storedUsername);
    }
  }, []);

  return (
    <div className="bg-[#EE0033]">
      <div className="md:flex md:flex-row md:h-16 items-center">
        <div className="flex flex-col md:flex-row items-center w-full md:w-[1225px] mx-auto">
          <div className="ml-4 z-50">
            <div className="border border-transparent rounded p-2 bg-transparent md:w-[167px]">
              <NavLink to="/">
                <img
                  src={logoFriends}
                  alt="logo"
                  className="h-[100px] w-[167px]"
                />
              </NavLink>
            </div>
          </div>

          <div className="flex items-center border rounded-2xl bg-white mt-2 md:mt-0 ml-4 md:ml-6 flex-1 h-10 md:h-[38px] z-50">
            <div className="ml-3">
              <icons.IoSearch />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearch}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Bạn cần tìm sản phẩm nào..."
              className="w-full border-none outline-none px-2 py-1 bg-transparent"
            />
            {showHistory && (
              <div className="absolute top-[65%] left-[38%] transform -translate-x-1/2 bg-white shadow-lg border rounded-lg max-h-[450px] w-[90%] md:w-[450px] overflow-y-auto z-50">
                <div className="flex justify-between items-center px-4 py-2 border-b">
                  <h4 className="text-gray-800">Lịch sử tìm kiếm</h4>
                  <button
                    onClick={clearHistory}
                    className="text-gray-400 text-sm flex items-center gap-1 hover:underline"
                  >
                    Xóa tất cả
                    <icons.RiDeleteBin5Line />
                  </button>
                </div>
                {searchHistory.length > 0 ? (
                  searchHistory.map((term, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                      onMouseDown={() => handleHistoryClick(term)}
                    >
                      {term}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500">
                    Không có lịch sử tìm kiếm
                  </div>
                )}
              </div>
            )}
          </div>
          <div
            className="text-xs text-white p-2 rounded-xl ml-6 w-auto z-50 md:w-[141px] h-[40px] mt-2 md:mt-0 hidden lg:flex"
            style={{ backgroundColor: "#C81B1B" }}
          >
            <div className="flex justify-between items-center h-full">
              <div className="flex flex-col">
                <p>Xem giá tồn kho tại:</p>
                <span className="font-bold">Toàn Quốc</span>
              </div>
              <div className="flex items-center">
                <icons.TiArrowSortedDown className="text-white text-lg" />
              </div>
            </div>
          </div>

          <div
            className="text-xs text-white p-3 z-50 rounded-xl ml-8 w-auto md:w-[140px] h-[40px] mt-2 md:mt-0 hidden lg:flex"
            style={{ backgroundColor: "#C81B1B" }}
          >
            <div className="flex justify-between items-center h-full">
              <div className="flex items-start">
                <icons.FaPhone className="text-white text-lg mr-1" />
              </div>
              <div className="flex flex-col">
                <span className="whitespace-nowrap">Tư vấn mua hàng:</span>
                <span className="font-bold">1900 8123</span>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col md:flex-row justify-center items-center mt-4 md:mt-0">
            <div className="text-xs text-white p-3 rounded-xl w-[122px] h-[80px] z-50">
              <div className="flex flex-col justify-center items-center h-full">
                <div className="flex mb-1">
                  <icons.FaShopify className="text-white text-2xl" />
                </div>
                <div className="flex flex-col items-center whitespace-nowrap">
                  <NavLink to={path.LOOKORDERS} className="font-bold">
                    Tra cứu đơn hàng
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="text-xs text-white rounded-xl w-[85px] h-[80px] hidden md:flex ml-3">
              <div className="flex flex-col justify-center items-center h-full z-50">
                <div className="flex items-start mb-1">
                  <icons.TbTruckDelivery className="text-white text-2xl" />
                </div>
                <div className="flex flex-col items-center">
                  <NavLink to={path.SHOPPINGCART} className="font-bold">
                    Giỏ hàng
                  </NavLink>
                </div>
              </div>
            </div>

            <div className="text-xs text-white rounded-xl w-[85px] h-[80px] hidden md:flex relative">
              <div className="flex flex-col justify-center z-50 items-center h-full cursor-pointer">
                <div className="flex items-start mb-1">
                  <icons.RxAvatar className="text-white text-2xl" />
                </div>
                <div
                  className="flex flex-col items-center"
                  onClick={toggleDropdown}
                >
                  {token ? (
                    <span className="font-bold whitespace-nowrap">
                      Xin chào, Member
                    </span>
                  ) : (
                    <NavLink to={path.CUSTOMERLOGIN} className="font-bold">
                      Đăng nhập
                    </NavLink>
                  )}
                </div>
              </div>

              <div className="relative">
                {isDropdownOpen && (
                  <div
                    className="fixed inset-0 bg-black opacity-50 z-10"
                    onClick={() => setIsDropdownOpen(false)}
                  ></div>
                )}

                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border rounded-lg shadow-lg z-20 px-3">
                    <div className="mt-2 p-2 flex items-center border-[1.5px] border-red-500 rounded-lg h-[50px]">
                      <img
                        src={login1}
                        alt="S-Ant"
                        className="w-10 h-10 mr-3"
                      />
                      <div className="flex justify-between items-center w-full">
                        <NavLink
                          to={path.FMEMBER}
                          className="text-red-500 font-bold text-[14px]"
                        >
                          Truy cập 3Fmember
                        </NavLink>
                        <span className="text-red-500 text-[20px]">
                          <icons.IoIosArrowForward />
                        </span>
                      </div>
                    </div>

                    <button
                      className="w-full py-3 text-blue-600 font-semibold border-t hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Đóng
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Toolbar;
