import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

export default function MediaSlider({ images = [], video }) {
  // 🛡 safety: force images to array
  const imageList = Array.isArray(images)
    ? images
    : typeof images === "string" && images.length > 0
    ? images.split(",")
    : []

  if (imageList.length === 0 && !video) {
    return (
      <div className="flex items-center justify-center h-56 bg-gray-100 text-gray-400">
        No media
      </div>
    )
  }

  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ clickable: true }}
      spaceBetween={10}
      slidesPerView={1}
      className="rounded-lg overflow-hidden"
    >
      {/* ✅ Images */}
      {imageList.map((img, i) => (
        <SwiperSlide key={`img-${i}`}>
          <img
            src={img}
            alt={`product-${i}`}
            className="w-full h-56 object-cover"
          />
        </SwiperSlide>
      ))}

      {/* ✅ Video */}
      {video && (
        <SwiperSlide key="video">
          <video
            src={video}
            controls
            className="w-full h-56 object-cover"
          />
        </SwiperSlide>
      )}
    </Swiper>
  )
}




