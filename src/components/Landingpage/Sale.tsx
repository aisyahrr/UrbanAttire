import React, { useState, useEffect } from "react";
import {sale} from '@/data/index';
const Sale: React.FC = () => {
    const right = "/image/right.png";
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
      const countdownDate = new Date().getTime() + 3 * 60 * 60 * 1000; // 3 jam dari sekarang

        const updateTimer = () => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            clearInterval(interval);
            setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            return;
        }

        setTimeLeft({
            hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((distance / (1000 * 60)) % 60),
            seconds: Math.floor((distance / 1000) % 60),
        });
    };

        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
<div className="w-screen bg-custom py-6">
  <div className="md:w-[1300px] mx-auto bg-white rounded-lg shadow-xl p-4">
    {/* HEADER */}
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl md:text-2xl font-bold text-brandblue">
          Urban Sale
        </h2>

        <div className="flex items-center bg-brandblue text-white px-3 py-1 rounded-lg font-semibold text-xs md:text-sm">
          {String(timeLeft.hours).padStart(2, "0")} :{" "}
          {String(timeLeft.minutes).padStart(2, "0")} :{" "}
          {String(timeLeft.seconds).padStart(2, "0")}
        </div>
      </div>

      <button className="hidden md:flex p-2 border border-brandblue rounded-md hover:bg-gray-100">
        <img src={right} alt="next" className="h-5 w-auto" />
      </button>
    </div>

    {/* PRODUCT LIST */}
    <div
      className="
        flex gap-3
        overflow-x-auto
        px-1 py-2
        scrollbar-hide
        snap-x snap-mandatory
      "
    >
      {sale.map((item) => (
        <div
          key={item.id}
          className="
            snap-start
            min-w-[150px]
            md:min-w-[200px]
            bg-white
            shadow
            rounded-xl
          "
        >
          <div className="relative">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-36 md:h-48 object-cover rounded-t-xl"
            />

            <span
              className="
                absolute bottom-0 left-0
                bg-red-500 text-white
                text-[10px] font-bold
                px-2 py-[2px]
                rounded-tr-md
              "
            >
              {item.discount}%
            </span>
          </div>

          <div className="p-2">
            <p className="text-sm font-semibold">
              Rp {item.price.toLocaleString()}
            </p>
            <p className="text-[10px] text-gray-400 line-through">
              Rp {item.oldPrice.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

    );
};
export default Sale;