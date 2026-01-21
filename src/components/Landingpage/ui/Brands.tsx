import { brands} from "../../../data/index";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Brands: React.FC = () => {
    const sliderSettings = {
        infinite: true,
        speed: 1500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 0,
        cssEase: "linear",
        arrows: false,
        pauseOnHover: false,
        variableWidth: true,
    };

    return (
        <div className="overflow-hidden rounded-xl h-[300px] flex justify-center items-center">
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
    );
};
export default Brands;