import React from "react";
import type { TCard } from "../../../types/types";
import { useNavigate } from "react-router-dom";

type Props = {
  item: TCard;
};

const Card: React.FC<Props> = ({ item }) => {
  const logoUrl = "/image/Vector.png";
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/Details/${item.id}`);
  };

  return (
    <div
      className="
        w-full
        max-w-[190px] sm:max-w-[200px] md:max-w-[230px]
        rounded-2xl overflow-hidden
        shadow bg-white cursor-pointer
        transition-transform duration-200 hover:scale-[1.02]
      "
      onClick={handleClick}
    >

      <img
        src={item.image}
        alt={item.name}
        className="w-full h-36 sm:h-40 md:h-44 object-cover bg-gray-200"
      />

      <div className="px-3 py-2 sm:px-4 sm:py-3 bg-gray-100">
        <h2 className="
          text-sm sm:text-base md:text-lg
          font-semibold text-gray-800
          h-[2.5rem] sm:h-[3rem]
          line-clamp-2
        ">
          {item.name}
        </h2>
        <div className="mt-2">
          <h3 className="
            text-base sm:text-lg md:text-xl
            font-bold text-gray-900
          ">
            Rp. {item.price.toLocaleString("id-ID")}
          </h3>
          {item.oldPrice && (
            <span className="text-xs sm:text-sm text-gray-500 line-through">
              Rp. {item.oldPrice.toLocaleString("id-ID")}
            </span>
          )}

          {item.discount && (
            <span className="text-xs sm:text-sm text-red-600 font-bold ml-2">
              {item.discount}%
            </span>
          )}
        </div>

        {(item.rating || item.sold) && (
          <div className="flex items-center mt-1 text-xs sm:text-sm text-gray-600">
            <img src={logoUrl} alt="rating icon" className="w-3 h-3 sm:w-4 sm:h-4" />
            {item.rating && <span className="ml-1 font-semibold">{item.rating}</span>}
            {item.sold && <span className="ml-1">| {item.sold}rb+ terjual</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
