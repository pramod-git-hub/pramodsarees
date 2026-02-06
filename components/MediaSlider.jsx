import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

export default function MediaSlider({ images, video }) {
  const safeImages = Array.isArray(images) ? images : []

  // If no images and no video, show nothing
  if (safeImages.length === 0 && !video) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-100 text-gray-400">
        No media
      </div>
    )
  }

  return (
    <Swiper spaceBetween={10} slidesPerView={1}>
      {safeImages.map((img, i) => (
        <SwiperSlide key={i}>
          <img
            src={img}
            alt="saree"
            className="w-full h-64 object-cover"
          />
        </SwiperSlide>
      ))}

      {video && (
        <SwiperSlide>
          <video
            controls
            className="w-full h-64 object-cover"
          >
            <source src={video} />
          </video>
        </SwiperSlide>
      )}
    </Swiper>
  )
}



