import React, { useState } from "react";
import type { TCard } from "@/types/types";
import Card from "./ui/Card";

type CardListProps = {
  data: TCard[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  filterCategory?: string; 
};


const CardList: React.FC<CardListProps> = ({
  data,
  title,
  subtitle,
  filterCategory,
}) => {
  const [showAll, setShowAll] = useState(false);

  const filteredData =
    !filterCategory || filterCategory === "all"
      ? data
      : data.filter(item =>
          item.category.some(
            c => c.trim().toUpperCase() === filterCategory.toUpperCase()
          )
        );

  const displayedData = showAll
    ? filteredData
    : filteredData.slice(0, 18);

  return (
    <div className="container mx-auto px-4">
    {title && (
      <h2 className="
        text-center
        text-xl sm:text-2xl md:text-3xl
        font-bold
        pt-6 sm:pt-8 md:pt-10
      ">
        {title}
      </h2>
    )}

    {subtitle && (
      <p className="
        text-center
        text-xs sm:text-sm md:text-base
        text-gray-500
        mt-1 sm:mt-2
      ">
        {subtitle}
      </p>
    )}


      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 py-4 px-2">
        {displayedData.map(item => (
          <Card key={item.id} item={item} />
        ))}
      </div>

      {filteredData.length > 18 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(prev => !prev)}
            className="text-sm font-semibold"
          >
            {showAll ? "Lihat Lebih Sedikit" : "Lihat Semua"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CardList;
