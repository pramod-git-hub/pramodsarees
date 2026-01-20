import MediaSlider from '../components/MediaSlider'

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>SLIDER TEST PAGE</h1>

      <MediaSlider
        images={[
          "https://picsum.photos/600/400",
          "https://picsum.photos/600/401"
        ]}
        video="https://www.w3schools.com/html/mov_bbb.mp4"
      />
    </div>
  )
}
