import PropTypes from "prop-types";
import { useEffect, useState } from "react";


const Loading = ({ status }) => {
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    if (status) {
      setLoadingStatus(true);
    } else {
      setLoadingStatus(false);
    }
  }, [status]);

  return (
    <div>
      {loadingStatus && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50">
          <div className="flex items-center">
            <span className="animate-spin rounded-full h-12 w-12 border-t-[3px] border-b-[3px] border-[#e0052b]"></span>
          </div>
        </div>
      )}
    </div>
  );
};
Loading.propTypes = {
    status: PropTypes.bool.isRequired,
  };
export default Loading;

