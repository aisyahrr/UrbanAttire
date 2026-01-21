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
        <div
        className="
            overflow-hidden rounded-xl
            h-[150px] md:h-[300px] lg:h-[350px]
            flex justify-center items-center
        "
        >
        <div className="container ">
            <Slider {...sliderSettings}>
            {event.map((data) => (
                <div key={data.id}>
                <div
                    className="
                    grid grid-cols-2
                    h-[100px] sm:h-[220px] md:h-[280px] lg:h-[300px]
                    gap-6 sm:gap-8 lg:gap-10
                    rounded-md
                    mx-4 sm:mx-6 lg:mx-10
                    my-4 sm:my-6 lg:my-10
                    "
                    style={{
                    backgroundImage: `url(${data.background || ""})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    }}
                >
                    {/* IMAGE CONTENT */}
                    <div className="flex justify-center items-center relative">
                    <img
                        src={data.img}
                        alt="Promo"
                        className="
                        absolute
                        w-[140px] h-[103px]
                        sm:w-[180px] sm:h-[190px]
                        md:w-[240px] md:h-[260px]
                        lg:w-[300px] lg:h-[310px]
                        object-contain
                        -left-[26px]
                        drop-shadow-[-8px_4px_6px_rgba(0,0,0,.4)]
                        z-40
                        my-10 sm:my-12 lg:my-14
                        "
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