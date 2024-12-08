import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import logo2 from "../../../assets/client/logo2.png";
import icons from "../../../utils/icons";
import a1 from "../../../assets/client/a1.png";
import a2 from "../../../assets/client/a2.png";
import a3 from "../../../assets/client/a3.jpg";
import a4 from "../../../assets/client/a4.jpg";
import h1 from "../../../assets/client/h1.jpg";
import h2 from "../../../assets/client/h2.jpg";
import h3 from "../../../assets/client/h3.jpg";
import l1 from "../../../assets/client/l1.jpg";
import l2 from "../../../assets/client/l2.jpg";
import l3 from "../../../assets/client/l3.png";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const FeaturedProducts = () => {
  const images = [l1, l2, l3, a4];
  const images1 = [h1, h2, h3];
  const images2 = [a1, a2, a3];

  const imageNames = [
    "Xiaomi 14T Series",
    "Tecno Pova 6 Neo",
    "ViVo Y18s (6+128GB)",
    "Reno12 Series 5G",
  ];
  const prices = [
    "Ưu Đãi Đến 5.5 Triệu",
    "Giá Chỉ 3.990.000đ",
    "Giá Chỉ 4.190.000đ",
    "Giá chỉ từ 9.490.000đ",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const swiperRef = useRef(null);
  const swiperRef1 = useRef(null);
  const swiperRef2 = useRef(null);

  const prevMain = () => swiperRef.current && swiperRef.current.slidePrev();
  const nextMain = () => swiperRef.current && swiperRef.current.slideNext();

  const prevSub1 = () => swiperRef1.current && swiperRef1.current.slidePrev();
  const nextSub1 = () => swiperRef1.current && swiperRef1.current.slideNext();

  const prevSub2 = () => swiperRef2.current && swiperRef2.current.slidePrev();
  const nextSub2 = () => swiperRef2.current && swiperRef2.current.slideNext();

  const goToSlide = (index) => {
    if (swiperRef.current) {
      swiperRef.current.slideToLoop(index);
      setCurrentIndex(index);
    }
  };

  return (
    <div className="bg-[#F2F2F2]">
      <div className="hidden md:flex justify-center mx-auto">
        <img
          src={logo2}
          alt=""
          className="rounded-bl-3xl rounded-br-3xl max-w-[1736px] w-full h-auto"
        />
      </div>

      <div className="container mx-auto px-4 lg:px-[160px] -mt-[110px] bg-transparent">
        <div className="p-6 rounded-lg flex flex-col lg:flex-row gap-4">
          <div className="relative overflow-hidden w-full lg:w-[770px] lg:h-[400px] group">
            <button
              onClick={prevMain}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 opacity-75 hover:opacity-100"
            >
              <icons.IoIosArrowDropleft className="text-white text-3xl" />
            </button>

            <Swiper
              modules={[Autoplay]}
              loop={true}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              className="w-full h-full"
            >
              {images.map((image, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-auto lg:w-[770px] lg:h-[330px] rounded-lg"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="text-black text-center relative z-20">
              <div className="flex justify-center bg-white">
                {imageNames.map((name, index) => (
                  <div
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`bg-white p-4 w-[150px] lg:w-[190px] text-center cursor-pointer ${
                      index === currentIndex ? "border-b-4 border-[#f00]" : ""
                    } relative z-20`} 
                  >
                    <div className="mx-auto flex flex-col -mt-[60px] border-gray-500">
                      <h3 className="text-sm font-medium">{name}</h3>
                      <p className="text-sm">{prices[index]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={nextMain}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 opacity-75 hover:opacity-100"
            >
              <icons.IoIosArrowDropright className="text-white text-3xl" />
            </button>
          </div>

          <div className="flex flex-col justify-center items-center gap-6 lg:gap-5">
            <div className="relative overflow-hidden w-full lg:w-[390px] lg:h-[190px] group">
              <button
                onClick={prevSub1}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 opacity-75 hover:opacity-100"
              >
                <icons.IoIosArrowDropleft className="text-white text-3xl" />
              </button>

              <Swiper
                modules={[Autoplay]}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                onSwiper={(swiper) => (swiperRef1.current = swiper)}
                className="w-full h-full"
              >
                {images1.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-auto rounded-lg"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                onClick={nextSub1}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 opacity-75 hover:opacity-100"
              >
                <icons.IoIosArrowDropright className="text-white text-3xl" />
              </button>
            </div>

            <div className="relative overflow-hidden w-full lg:w-[390px] lg:h-[190px] group">
              <button
                onClick={prevSub2}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 opacity-75 hover:opacity-100"
              >
                <icons.IoIosArrowDropleft className="text-white text-3xl" />
              </button>

              <Swiper
                modules={[Autoplay]}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                onSwiper={(swiper) => (swiperRef2.current = swiper)}
                className="w-full h-full"
              >
                {images2.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-auto rounded-lg"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                onClick={nextSub2}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 opacity-75 hover:opacity-100"
              >
                <icons.IoIosArrowDropright className="text-white text-3xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
