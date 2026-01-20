
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

export default function MediaSlider({ images = [], video }) {
  if ((!images || images.length === 0) && !video) return null

  return (
    <Swiper spaceBetween={10} slidesPerView={1}>
      {images.map((img, i) => (
        <SwiperSlide key={i}>
          <img src={img} style={{ width: '100%', borderRadius: 8 }} />
        </SwiperSlide>
      ))}
      {video && (
        <SwiperSlide>
          <video controls style={{ width: '100%', borderRadius: 8 }}>
            <source src={video} type="video/mp4" />
          </video>
        </SwiperSlide>
      )}
    </Swiper>
  )
}
