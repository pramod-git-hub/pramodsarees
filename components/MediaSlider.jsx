import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

export default function MediaSlider({ images = [], video }) {
  return (
    <Swiper spaceBetween={10} slidesPerView={1}>
      {images.map((img, i) => (
        <SwiperSlide key={i}>
          <img src={img} style={{ width: '100%' }} />
        </SwiperSlide>
      ))}

      {video && (
        <SwiperSlide>
          <video controls style={{ width: '100%' }}>
            <source src={video} type="video/mp4" />
          </video>
        </SwiperSlide>
      )}
    </Swiper>
  )
}

