import { Swiper, SwiperSlide } from "swiper/react";
import React, { useRef, useState } from "react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import "./styles.css";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper";

const Banner = () => {
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="swiper"
      >
        <SwiperSlide>
          <img
            src="https://res.cloudinary.com/dlp9idmqm/image/upload/v1674438771/banners/mve_o1aa-uz_x3d7rg.jpg"
            alt="markplace"
            className="banner"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://res.cloudinary.com/dlp9idmqm/image/upload/h_250,w_970/v1674426738/banners/bronze_m50u3i.jpg"
            alt="markplace"
            className="banner"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src="https://res.cloudinary.com/dlp9idmqm/image/upload/h_250,w_970/v1674439011/banners/acme_ff9myx.jpg"
            alt="markplace"
            className="banner"
          />
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default Banner;
