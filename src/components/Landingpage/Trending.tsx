import {data} from "@/data/index";
import { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";

const Trending: React.FC = () => {
  const [showAll] = useState(false);
  return (
    <div className="md:py-5">
      <div className="container">
        <h2 className="text-center justify-center text-xl lg:text-2xl font-bold pt-10 pb-5 text-transparent bg-gradient-to-r from-brandblue to-blue-900 bg-clip-text">
          Trending Now
        </h2>
        <div
          className="grid gap-2 lg:gap-4 px-3 md:px-0"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridTemplateRows: "repeat(3, auto)",
            gridAutoRows: "minmax(50px, 1fr)",
          }}
        >
          {data.map(({ imageUrl, column, row }, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden"
              style={{
                gridColumn: column,
                gridRow: row,
              }}
            >
              <img
                src={imageUrl}
                alt={`Image ${index}`}
                className="w-full h-auto object-cover hover:scale-125 hover:rotate-5 transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-center ">
        <button
          className="flex justify-center items-center text-xs md:text-base font-semibold py-5 text-black hover:text-brandblue"
        >
          {showAll ? "Lihat Lebih Sedikit" : "Lihat Semua"}
          <MdKeyboardArrowRight className="w-5 h-auto" />
        </button>
      </div>
    </div>
  );
}
export default Trending;