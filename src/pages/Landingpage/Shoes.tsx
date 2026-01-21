import React ,{useEffect,useState}  from "react";
import Slider from "react-slick";
import { supabase } from "@/libs/supabase";
import {promo} from '@/data/index';
import CardList from '@/components/Landingpage/CardList';
import type { TCard } from "@/types/types";

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
const Shoes: React.FC = () =>{
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
    return(
    <div>
        <hr className="h-[1px] bg-gray-300 border-0 rounded" />
        <div className="bg-promo">
            <div className="overflow-hidden rounded-xl h-[550px] flex justify-center items-center sm:block">
                <div className="container pb-8">
                    <Slider {...sliderSettings}>
                    {promo.map((data, index) => (
                        <div key={data.id}>
                        <div
                            className="grid h-[400px] rounded-lg shadow-xl shadow-[#4F4F4F] mx-10 my-10 grid-cols-2"
                            style={{
                            backgroundImage: `url(${data.background || ""})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            }}
                        >
                            {index === 0 ? (
                            <>
                                <div className="flex flex-col justify-center z-10 gap-1 text-left pl-56 text-white">
                                <h1 className="font-pacifico text-xl pl-4">
                                    {data.subtitle}
                                </h1>
                                <h1 className="font-playfair text-5xl">
                                    {data.title}
                                </h1>
                                <h1 className="text-4xl font-calistoga font-bold">
                                    {data.title2}
                                </h1>
                                </div>
                                <div className="flex justify-end items-center pr-36">
                                <img
                                    src={data.img}
                                    alt="Promo"
                                    className="w-[400px] h-[350px] object-contain drop-shadow-lg"
                                />
                                </div>
                            </>
                            ) : index === 1 ? (
                            <div className="relative flex justify-center items-center col-span-2">
                                <img
                                src={data.img}
                                alt="Promo"
                                className="w-[400px] h-[350px] object-contain drop-shadow-lg"
                                />
                                <button className="absolute bottom-12 right-32 text-base font-semibold rounded-lg 
                                border-black border-opacity-15 bg-black bg-opacity-70 border-2 px-5 py-2 text-white">
                                {data.title}
                                </button>
                            </div>
                            ) : null}
                        </div>
                        </div>
                    ))}
                    </Slider>
                    <div className="flex justify-center mb-3 items-center px-16 gap-80">
                    {[
                        { title: "DAFTAR SEKARANG", subtitle: "& DAPATKAN DISKON 10%" },
                        { title: "PENGIRIMAN CEPAT", subtitle: "& TEPAT WAKTU" },
                        {
                        title: "GARANSI KEPUASAN 100%",
                        subtitle: "SEMUA PRODUKNYA ORI",
                        },
                    ].map((item, idx) => (
                        <div
                        key={idx}
                        className="text-center font-sans text-xs items-center"
                        >
                        <p className="font-semibold">{item.title}</p>
                        <span>{item.subtitle}</span>
                        </div>
                    ))}
                    </div>
                </div>
            </div>
        </div>
        <CardList 
            data={products} 
            title="FOR YOU" 
            subtitle="FEATURED ITEM" 
            filterCategory="SHO"
            loading={loading}
        />
    </div>
    );
};
export default Shoes;