import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function MediaSlider({ images = [], video = null }) {
  if ((!images || images.length === 0) && !video) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No media
      </div>
    )
  }

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      className="h-64"
    >
      {images.map((img, i) => (
        <SwiperSlide key={i}>
          <img src={img} className="w-full h-64 object-cover" />
        </SwiperSlide>
      ))}

      {video && (
        <SwiperSlide>
          <video
            src={video}
            controls
            className="w-full h-64 object-cover"
          />
        </SwiperSlide>
      )}
    </Swiper>
  )
}
