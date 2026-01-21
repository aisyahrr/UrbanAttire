import { brands} from "../../../data/index";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Brands: React.FC = () => {
    // const sliderSettings = {
    //     infinite: true,
    //     speed: 1500,
    //     slidesToShow: 3,
    //     slidesToScroll: 1,
    //     autoplay: true,
    //     autoplaySpeed: 0,
    //     cssEase: "linear",
    //     arrows: false,
    //     pauseOnHover: false,
    //     variableWidth: true,
    // };
    const sliderSettings = {
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    pauseOnHover: false,
    slidesToShow: 3,
    responsive: [
        {
        breakpoint: 640, // mobile
        settings: {
            slidesToShow: 3,
        },
        },
        {
        breakpoint: 1024, // desktop
        settings: {
            slidesToShow: 2,
        },
        },
    ],
    };


    return (
        <>    
        <div className="hidden md:flex overflow-hidden rounded-xl justify-center items-center">
            <div className="container ">
                <Slider {...sliderSettings}>
                {brands.map((data) => (
                    <div key={data.id} className="px-6">
                    <div className="flex justify-center items-center">
                        <img
                        src={data.img}
                        alt="Brand"
                        className="w-[350px] h-[300px] object-contain"
                        />
                    </div>
                    </div>
                ))}
                </Slider>
            </div>
        </div>
        <div
        className="
            md:hidden overflow-hidden rounded-xl
            h-[100px] sm:h-[200px] md:h-[260px]
            flex justify-center items-center
        "
        >
        <div className="container">
            <Slider {...sliderSettings}>
            {brands.map((data) => (
                <div key={data.id} className="px-2 sm:px-3 md:px-4">
                <div className="flex justify-center items-center">
                    <img
                    src={data.img}
                    alt="Brand"
                    className="
                        w-[160px] h-[120px]
                        md:w-[300px] md:h-[220px]
                        object-contain
                    "
                    />
                </div>
                </div>
            ))}
            </Slider>
        </div>
        </div>
        </>
        
    );
};
export default Brands;