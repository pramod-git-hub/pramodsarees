import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export default function MediaSlider({ images = [], video = null }) {
  const hasImages = Array.isArray(images) && images.length > 0
  const hasVideo = !!video

  if (!hasImages && !hasVideo) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No media
      </div>
    )
  }

  return (
    <div className="w-full h-64">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        slidesPerView={1}
        className="w-full h-full"
      >
        {/* IMAGES */}
        {hasImages &&
          images.map((img, i) => (
            <SwiperSlide key={`img-${i}`}>
              <img
                src={img}
                alt={`product-${i}`}
                className="w-full h-64 object-cover"
              />
            </SwiperSlide>
          ))}

        {/* VIDEO */}
        {hasVideo && (
          <SwiperSlide>
            <video
              src={video}
              controls
              className="w-full h-64 object-cover"
            />
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  )
}
