import Slider from "react-slick";
import {event} from '../../../data/index';

const Event: React.FC = () =>{
    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: "ease-in-out",
        pauseOnHover: true,
        pauseOnFocus: true,
    };
return (
    <div className="overflow-hidden rounded-xl h-[350px] flex justify-center items-center sm:block">
        <div className="container pb-8">
            <Slider {...sliderSettings}>
            {event.map((data) => (
                <div key={data.id}>
                <div
                    className="grid h-[300px] gap-10 rounded-md mx-10 my-10 grid-cols-2"
                    style={{
                    backgroundImage: `url(${data.background || ""})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    }}
                >
                    {/* Image Content */}
                    <div className="flex justify-center items-center my-10 relative">
                    <img
                        src={data.img}
                        className="absolute w-[300px] h-[310px] object-contain -left-[7px] drop-shadow-[-8px_4px_6px_rgba(0,0,0,.4)] z-40 my-14"
                    />
                    </div>
                </div>
                </div>
            ))}
            </Slider>
        </div>
    </div>
  );
};

export default Event;