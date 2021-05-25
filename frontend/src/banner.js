import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore, { EffectFade, Navigation } from "swiper"
import "swiper/swiper.scss"
import "swiper/components/navigation/navigation.scss"
import "swiper/components/effect-fade/effect-fade.scss"
import Slide1 from "./imgs/slide-01.jpg"
import Slide2 from "./imgs/slide-02.jpg"
import Slide3 from "./imgs/slide-03.jpg"
import "./banner.css"

SwiperCore.use([Navigation, EffectFade])

function Banner() {
	return (
		<div className='banner' id="home">
			<Swiper
				effect='fade'
				pagination={{ clickable: true }}
				grabCursor={true}
				centeredSlides={true}
				mousewheel={true}
				autoplay={true}
				loop={true}
				slidesPerView='auto'
				navigation>
				<SwiperSlide
					style={{
						backgroundImage: `url(${Slide1})`,
					}}>
						<div className="slide-text">
							Check out the NEW ARRIVALS!!
						</div>
					</SwiperSlide>
				<SwiperSlide
					style={{
						backgroundImage: `url(${Slide2})`,
					}}>
					<div className="slide-text">
						Latest season collection has come
					</div></SwiperSlide>
				<SwiperSlide
					style={{
						backgroundImage: `url(${Slide3})`,
					}}>
					<div className="slide-text">
						Flat 70% sale!!*<br/>
						<span>*on selected merch only</span>
					</div></SwiperSlide>
			</Swiper>
		</div>
	)
}

export default Banner
