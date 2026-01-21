import React from "react";
import Slider from "react-slick";
import {slider} from '../../data/index';
import Trending from '../../components/Landingpage/Trending';
import Sale from '../../components/Landingpage/Sale';
import CardList from '../../components/Landingpage/CardList';
import { supabase } from "@/libs/supabase";
import type { TCard } from "@/types/types";
import { useEffect, useState } from "react";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ProductCategoryRow {
    category_codes: {
        id: string;
        code: string;
        category: string;
    };
}
interface ProductRow {
    id: string;
    name: string;
    price: number;
    old_price: number | null;
    discount: string | null;
    product_images: {
        image_url: string;
        is_primary: boolean;
    }[];
    product_categories: ProductCategoryRow[];
}
// DIMENSI YANG MEMPENGARUHI SIZE
type ProductDimension = "TOP" | "BOT" | "SHO" | "DRS" | "BAG";

// SEMUA CATEGORY CODE DI DB
type CategoryCode =
    | ProductDimension
    | "OUT"
    | "GEN"
    | "STY"
    | "MAT";
const Home: React.FC = () => {
    const [index, setIndex] = useState(0);
    const [products, setProducts] = useState<TCard[]>([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
        setLoading(true);
            const { data, error } = await supabase
            .from("products")
            .select(`
                id,
                name,
                price,
                old_price,
                discount,
                product_images (
                image_url,
                is_primary
                ),
                product_categories (
                category_codes (
                    id,
                    code,
                    category
                )
                )
            `)
            .eq("is_active", true)
            .order("created_at", { ascending: false })
            .limit(24);
        if (error) {
            console.error("Fetch products error:", error);
            setLoading(false);
            return;
        }

        const mapped: TCard[] = (data as unknown as ProductRow[]).map((p) => {
            const primaryImage =
            p.product_images.find((img) => img.is_primary)?.image_url ||
            "/placeholder.png";

            return {
            id: p.id,
            name: p.name,
            price: p.price,
            oldPrice: p.old_price || undefined,
            discount: p.discount || undefined,
            image: primaryImage,
            category: p.product_categories.map(
            pc => pc.category_codes.code.trim().toUpperCase() as CategoryCode
            ),
            rating: 4.8, 
            sold: 12,    
            };
        });

        setProducts(mapped);
        setLoading(false);
        };

        fetchProducts();
    }, []);

    //slider
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        autoplay: true,
        autoplaySpeed: 1000,
        cssEase: "ease-in-out",
        pauseOnHover: true,
        pauseOnFocus: true,
    };

    const infoBoxes = [
        { title: "DAFTAR SEKARANG", subtitle: "& DAPATKAN DISKON 10%" },
        { title: "PENGIRIMAN CEPAT", subtitle: "& TEPAT WAKTU" },
        { title: "GARANSI KEPUASAN 100%", subtitle: "SEMUA PRODUKNYA ORI" },
    ];
    useEffect(() => {
        const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % infoBoxes.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);
    
    
    return(
        <>
            <div>
                {/* Promo Section */}
                <div className="bg-primary text-black w-full">
                    {/* MOBILE */}
                    <div className="md:hidden text-center py-2 text-xs">
                        <p className="font-semibold">
                        {infoBoxes[index].title}
                        </p>
                        <span>{infoBoxes[index].subtitle}</span>
                    </div>

                    {/* DESKTOP */}
                    <div className="hidden md:flex justify-center gap-32 py-3">
                        {infoBoxes.map((item, i) => (
                        <div key={i} className="text-center text-xs">
                            <p className="font-semibold">{item.title}</p>
                            <span>{item.subtitle}</span>
                        </div>
                        ))}
                    </div>
                </div>
                {/* Slider Dekstop*/}
                <div className="hidden md:flex container overflow-hidden rounded-3xl min-h-[600px] justify-center items-center ">
                    <div className="container pb-8">
                        <Slider {...sliderSettings}>
                            {slider.map((data) => (
                            <div key={data.id}>
                                <div
                                className="grid h-[500px] rounded-md mx-10 my-10 grid-cols-2"
                                style={{
                                    backgroundImage: `url(${data.background || ""})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                                >
                                {/* Text Content */}
                                <div className="flex relative flex-col justify-center z-10 gap-4 order-2 ml-16 py-20 text-center">
                                    <h1 className="font-pacifico pt-12 pl-10 text-white text-4xl translate-y-4">
                                    {data.subtitle}
                                    </h1>
                                    <h1 className="uppercase font-pangolin font-bold text-5xl xl:text-[130px] sm:text-[80px] text-slate-100 tracking-widest">
                                    {data.title}
                                    </h1>
                                    <h1 className="text-right font-pangolin text-3xl text-gray-300 -translate-y-5">
                                    {data.title2}
                                    </h1>
                                    <button className="text-base font-semibold font-sans h-[45px] w-[130px] rounded-3xl bg-transparent border-2 border-white/50 backdrop-blur-[20px] shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:text-brandblue dark:border-white text-white">
                                    Shop Now
                                    </button>
                                </div>

                                {/* Image Content */}
                                <div className="flex justify-center items-center my-10 order-2 relative">
                                    <img
                                    src={data.img}
                                    alt="Slider Image"
                                    className="w-[330px] h-[320px] scale-110 object-contain mx-auto drop-shadow-[-8px_4px_6px_rgba(0,0,0,.4)] absolute z-40 my-14 ml-10 -rotate-12"
                                    />
                                </div>
                                </div>
                            </div>
                            ))}
                        </Slider>
                    </div>
                </div>
                {/* Slider Mobile */}
                <div className="flex md:hidden container overflow-hidden h-[250px] mt-5 justify-center items-center ">
                    <div className="container pb-5">
                        <Slider {...sliderSettings}>
                            {slider.map((data) => (
                            <div key={data.id}>
                                {/* CARD */}
                                <div
                                className="
                                    relative
                                    h-[250px]
                                    rounded-md
                                    mx-3 my-10
                                    flex items-center justify-center
                                    overflow-hidden
                                "
                                style={{
                                    backgroundImage: `url(${data.background || ""})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                                >

                                {/* TEXT CONTENT */}
                                <div className="relative z-10 flex flex-col items-center text-center gap-2">
                                    <h1 className="font-pacifico absolute -top-6 left-2 text-white text-[10px] translate-y-4">
                                    {data.subtitle}
                                    </h1>
                                    <h1 className="uppercase font-pangolin font-bold text-[39px] text-slate-100 tracking-widest">
                                    {data.title}
                                    </h1>
                                    <h1 className="absolute text-right font-pangolin -bottom-8 right-2 text-sm text-gray-300 -translate-y-5">
                                    {data.title2}
                                    </h1>
                                </div>

                                {/* IMAGE CONTENT */}
                                <img
                                    src={data.img}
                                    alt="Slider Image"
                                    className="
                                    absolute
                                    w-[220px]
                                    object-contain
                                    drop-shadow-[-8px_4px_6px_rgba(0,0,0,.4)]
                                    -rotate-12
                                    z-20
                                    pointer-events-none
                                    "
                                />
                                </div>
                            </div>
                            ))}
                        </Slider>
                    </div>
                </div>

                <Trending/>
                <Sale/>
                <CardList
                data={products}
                title="FOR YOU"
                subtitle="FEATURED ITEM"
                filterCategory="all"
                loading={loading}
                />

            </div>
        </>
    );
};

export default Home;