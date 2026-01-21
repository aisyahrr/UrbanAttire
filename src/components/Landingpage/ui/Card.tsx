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
      className="rounded-2xl overflow-hidden shadow-lg bg-white cursor-pointer transition-transform"
      onClick={handleClick}
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-44 object-cover bg-gray-200"
      />

      <div className="px-4 py-3 bg-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 h-[3rem]">
          {item.name}
        </h2>

        <div className="mt-2">
          <h3 className="text-lg font-bold text-gray-900">
            Rp. {item.price.toLocaleString("id-ID")}
          </h3>

          {item.oldPrice && (
            <span className="text-sm text-gray-500 line-through">
              Rp. {item.oldPrice.toLocaleString("id-ID")}
            </span>
          )}

          {item.discount && (
            <span className="text-sm text-red-600 font-bold ml-2">
              {item.discount}%
            </span>
          )}
        </div>

        {(item.rating || item.sold) && (
          <div className="flex items-center mt-2 text-gray-600">
            <img src={logoUrl} alt="rating icon" />
            {item.rating && (
              <span className="ml-1 font-semibold">{item.rating}</span>
            )}
            {item.sold && (
              <span className="ml-1">| {item.sold}rb+ terjual</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
