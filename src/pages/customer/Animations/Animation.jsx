import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useRef, useState } from "react";
import animation1 from "../../../assets/client/animation1.png";
import animation2 from "../../../assets/client/animation2.jpg";
import animation3 from "../../../assets/client/animation3.jpg";
import animation4 from "../../../assets/client/animation4.jpg";
import icons from "../../../utils/icons";
import "swiper/css";

const Animation = () => {
  const images = [animation1, animation2, animation3, animation4];
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef(null); 

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % images.length; 
    setCurrentIndex(newIndex);
    swiperRef.current?.slideTo(newIndex); 
  };

  const prevSlide = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length; 
    setCurrentIndex(newIndex);
    swiperRef.current?.slideTo(newIndex); 
  };

  return (
    <div className="w-full bg-[#F2F2F2] relative">
      <div className="flex flex-col items-center mx-auto pt-4 bg-[#F2F2F2] rounded-md px-4 sm:px-8 md:px-16 lg:px-[50px] relative group">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={2} 
          spaceBetween={10} 
          loop={true}
          onSwiper={(swiper) => (swiperRef.current = swiper)} 
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          className="w-[1170px]"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-[280px] sm:w-[380px] md:w-[480px] lg:w-[580px] rounded-md"
              />
            </SwiperSlide>
          ))}
        </Swiper>

    
        <button
          onClick={prevSlide} 
          className="absolute left-4 sm:left-8 md:left-16 lg:left-[180px] top-1/2 transform -translate-y-1/2 opacity-75 hover:opacity-100 transition-opacity duration-300 z-10"
        >
          <icons.IoIosArrowDropleftCircle className="text-gray-200 text-2xl sm:text-3xl md:text-4xl" />
        </button>
        <button
          onClick={nextSlide} 
          className="absolute right-4 sm:right-8 md:right-16 lg:right-[180px] top-1/2 transform -translate-y-1/2 opacity-75 hover:opacity-100 transition-opacity duration-300 z-10"
        >
          <icons.IoIosArrowDroprightCircle className="text-gray-200 text-2xl sm:text-3xl md:text-4xl" />
        </button>
      </div>
    </div>
  );
};

export default Animation;
