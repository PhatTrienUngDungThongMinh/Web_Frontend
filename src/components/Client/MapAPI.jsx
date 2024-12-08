import { useState } from "react";
import axios from "axios";
import { Input } from "antd";
import PropTypes from "prop-types";

const AddressSearch = ({form}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY; 
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${value}&key=${apiKey}&limit=5`
      );
      if (response.data.results) {
        setSuggestions(response.data.results);
      }
    } catch (error) {
      console.error("Error fetching address data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (address) => {
    setQuery(address.formatted);
    form.setFieldsValue({ Address: address.formatted }); // Cập nhật giá trị vào form
    setSuggestions([]); // Dọn dẹp gợi ý sau khi chọn
  };

  return (
    <div>
      <Input
        value={query}
        onChange={handleSearchChange}
        placeholder="Nhập địa chỉ"
      />
      {loading && <div>Đang tải...</div>}
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((address, index) => (
            <li key={index} onClick={() => handleSuggestionClick(address)}>
              {address.formatted}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
AddressSearch.propTypes = {
  form: PropTypes.object.isRequired,
};
export default AddressSearch;
