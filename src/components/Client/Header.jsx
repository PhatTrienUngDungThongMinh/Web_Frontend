import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay  } from "swiper/modules";
import anh1 from "../../assets/client/anh1.jpg";
import anh2 from "../../assets/client/anh2.jpg";
import anh3 from "../../assets/client/anh3.png";
import icons from "../../utils/icons";
import Button from "./Button";
import Toolbar from "./Toolbar";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const Header = () => {
  const images = [anh1, anh2, anh3];
  const swiperRef = useRef(null);

  const prevImg = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev(); 
    }
  };

  const nextImg = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext(); 
    }
  };

  return (
    <div className="relative max-w-full mx-auto z-50">
      <div className="relative z-50 w-full max-w-full lg:max-w-[1170px] mx-auto overflow-hidden">
        <button
          onClick={prevImg} 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
        >
          <icons.IoIosArrowDropleft className="text-white text-3xl opacity-75 hover:opacity-100" />
        </button>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]} 
          spaceBetween={0}
          slidesPerView={1}
          loop={true} 
          autoplay={{
            delay: 4000, 
            disableOnInteraction: false, 
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)} 
          className="w-full h-full"
        >
          {images.map((image, index) => (
            <SwiperSlide
              key={index}
              className="flex justify-center items-center"
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-auto object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>


        <button
          onClick={nextImg} 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
        >
          <icons.IoIosArrowDropright className="text-white text-3xl opacity-75 hover:opacity-100" />
        </button>
      </div>

      <Toolbar />
      <Button />
    </div>
  );
};

export default Header;
