import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/libs/supabase";
import { FaShoppingCart } from "react-icons/fa";
import { BsChatSquareText } from "react-icons/bs";
import { RiShareForwardLine } from "react-icons/ri";
import { IoMdHeartEmpty } from "react-icons/io";
import { FiSend } from "react-icons/fi";
import { AiTwotoneLike } from "react-icons/ai";
import { reviews } from "@/data";
import { useCart } from "../../context/CartContext";

type ProductDetail = {
    id: string;
    name: string;
    description: string | null;
    price: number;
        old_price: number | null;
        discount: number | null;
    code_product: string;
    stock: number;

    images: string[];

    shop: {
        id: number;
        name: string;
        logo: string | null;
    } | null;

    product_images: {
        image_url: string;
        is_primary: boolean;
    }[];

    product_categories: {
        category_codes: {
        id: string;
        code: string;
        category: string;
        };
  }[];

  product_variants: {
    id: string;
    size: string;
    sku: string | null;
    stock: number;
    variant_colors: {
      color: string;
    }[];
  }[];
};


const Details: React.FC = () => {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [jumlahPesanan, setJumlahPesanan] = useState<number>(1);
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<ProductDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const logoUrl = "/image/Vector.png";
    const clock = "/image/Clock.png";
    const location = "/image/Location.png";
    const line = "/image/line.png";
    const right = "/image/right.png";

    useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
        setLoading(true);

        const { data, error } = await supabase
        .from("products")
        .select(`
            id,
            name,
            description,
            price,
            old_price,
            discount,
            code_product,

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
            ),

            product_variants!product_variants_product_id_fkey (
            id,
            size,
            sku,
            stock,
            variant_colors!variant_colors_variant_id_fkey (
                color
            )
            ),
            shop: shops!products_shop_id_fkey (
            id,
            name,
            logo
            )
        `)
        .eq("id", id)
        .single<ProductDetail>();
        console.log("SHOP DATA =>", data?.shop);

        if (error || !data) {
        console.error(error);
        setProduct(null);
        setLoading(false);
        return;
        }

        const images = [...data.product_images]
        .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
        .slice(0, 3)
        .map(img => img.image_url);

        const totalStock = data.product_variants.reduce(
        (sum, v) => sum + v.stock,
        0
        );

        setProduct({
        ...data,
        images,
        stock: totalStock,
        });

        setLoading(false);
    };

    fetchProduct();
    }, [id]);
    const selectedVariant = product?.product_variants.find(v =>
    v.size === selectedSize &&
    v.variant_colors.some(c => c.color === selectedColor)
    );

    const uniqueSizes = Array.from(
    new Set(product?.product_variants.map(v => v.size))
    );

    const allColors = Array.from(
    new Set(
        product?.product_variants.flatMap(v =>
        v.variant_colors.map(c => c.color)
        )
    )
    );
    const availableColorsBySize = selectedSize
    ? Array.from(
        new Set(
            product?.product_variants
            .filter(v => v.size === selectedSize)
            .flatMap(v => v.variant_colors.map(c => c.color))
        )
        )
    : [];

    // Pilihan warna & ukuran
    const handleColorClick = (color: string) => setSelectedColor(prev => (prev === color ? null : color));
    const handleSizeClick = (size: string) => setSelectedSize(prev => (prev === size ? null : size));

    // Jumlah pesanan
    const tambahPesanan = () => {
        const stok = selectedVariant?.stock ?? 0;
        if (jumlahPesanan < stok) setJumlahPesanan(prev => prev + 1);
    };

    const kurangiPesanan = () => {
        if (jumlahPesanan > 1) setJumlahPesanan(prev => prev - 1);
    };

    // Subtotal otomatis sesuai harga produk
    const subTotal = product ? jumlahPesanan * product.price : 0;
    // add cart 
    const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addToCart({
        productId: product.id,
        variantId: selectedVariant.id,

        name: product.name,
        image: product.images?.[0] ?? "",

        price: product.price,
        stock: selectedVariant.stock,

        attributes: {
            size: selectedVariant.size,
            color: selectedVariant.variant_colors[0].color,
        },

        qty: jumlahPesanan,
        selected: true,
    });
    };



    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (!product) return <h2 className="text-center mt-10">Produk tidak ditemukan</h2>;

return (
    <div className="w-full max-w-[1280px] mx-auto px-3 md:px-4">
        {/*Grid 1*/}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 space-y-1.5 justify-center">
                {/* Foto Produk */}
                <div className="col-span-1 mt-3">
                    <div className="relative border-3 border-gray-300 rounded-sm  md:h-[500px] p-3">
                        <div className="flex justify-center items-center p-1 h-64 md:h-72">
                            <img
                                src={product.images[0] ?? "/placeholder.png"}
                                alt={product.name}
                                className="w-full h-full object-cover rounded-sm"
                            />
                        </div>
                        <div className="flex gap-2">
                            <div className="w-[175px] h-[180px]">
                            <img
                                src={product.images[1] ?? "/placeholder.png"}
                                alt="Product image 2"
                                className="w-full h-full object-cover rounded-md"
                            />
                            </div>

                            <div className="w-[175px] h-[180px]">
                            <img
                                src={product.images[2] ?? "/placeholder.png"}
                                alt="Product image 3"
                                className="w-full h-full object-cover rounded-md"
                            />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Detail Produk */}
                <div className="col-span-1 justify-center">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">{product.name}</h1>
                    <p className="text-gray-600">
                        Terjual 0 | ⭐ 0 (0 Rating)
                    </p>

                    <div className="flex mt-4 gap-2">
                        <p className="text-sm sm:text-base text-gray-500 line-through">
                        Rp. {product.old_price?.toLocaleString("id-ID")}
                        </p>
                        <p className="text-sm sm:text-base text-red-600 font-bold">{product.discount}%</p>
                    </div>
                    <p className="text-lg font-bold">
                        Rp. {product.price.toLocaleString("id-ID")}
                    </p>

                    <div className="mt-3 md:mt-7  border-gray-400 py-3">
                        <hr className="w-full border-t border-gray-400" />
                        <div className="flex gap-6 sm:gap-10 justify-center items-center my-2">
                        <p className="font-semibold text-sm sm:text-base">Info Produk</p>
                        <p className="font-semibold text-sm sm:text-base">Ulasan</p>
                        <p className="font-semibold text-sm sm:text-base">Diskusi</p>
                        </div>
                        <hr className="w-full border-t border-gray-400" />
                        <div className="py-2 font-poppins">
                                <p className="font-semibold text-sm sm:text-base">
                                    {product.name}
                                </p>
                                <p className="text-justify text-sm sm:text-base text-gray-700 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        <hr className="w-full border-t border-gray-400" />
                        <div className="flex justify-between items-center my-4">
                            <div className="flex gap-5 justify-center items-center">
                                <img
                                src={product.shop?.logo || "/placeholder.png"}
                                alt=""
                                className="h-10 w-10 sm:h-14 sm:w-14 rounded-full"
                                />
                                <div className="justify-center items-center">
                                    <p className="font-bold text-sm sm:text-lg">
                                    {product.shop?.name}
                                    </p>

                                    <p className="text-xs sm:text-sm text-gray-500">
                                    Online Kemarin
                                    </p>
                                </div>
                            </div>
                            <button
                            className="
                                flex w-24 sm:w-28 h-8 sm:h-9
                                border border-brandblue rounded-lg
                                items-center justify-center
                                text-sm sm:text-base font-roboto
                                text-brandblue hover:bg-brandblue hover:text-white
                            "
                            >
                            Follow
                            </button>
                        </div>
                        <p className="
                        text-sm sm:text-base
                        text-black font-semibold
                        flex items-center mt-4 gap-1
                        ">
                            <img src={logoUrl} alt="" className="h-3 w-3 sm:h-4 sm:w-4" />
                            4.7 Rating
                            <span className="font-normal text-gray-600 text-xs sm:text-sm">
                                (128)
                            </span>
                        </p>
                        <p className="
                        text-sm sm:text-base
                        text-black font-semibold
                        flex items-center gap-1
                        ">
                            <img src={clock} alt="" className="h-3 w-3 sm:h-4 sm:w-4" />
                            ± 30 menit
                            <span className="font-normal text-gray-600 text-xs sm:text-sm">
                                pesanan diproses
                            </span>
                        </p>
                        <hr className="w-full border-t-1 border-gray-400 mt-3" />
                        <div className="mt-2 gap-1">
                        <p className="pb-1 font-bold text-sm sm:text-base">
                            Pengiriman
                        </p>

                        <p className="
                            text-gray-600 font-normal
                            text-xs sm:text-sm
                            flex items-center gap-1
                        ">
                            <img src={location} alt="" className="h-3 w-3 sm:h-4 sm:w-4" />
                            Dikirim dari
                            <span className="font-semibold text-black">
                            Jakarta Barat
                            </span>
                        </p>

                        <p className="pl-5 text-xs sm:text-sm font-semibold">
                            Ongkir Mulai Rp.9000
                        </p>

                        <p className="
                            text-gray-600 font-normal
                            text-xs sm:text-sm
                            flex items-center mt-2
                        ">
                            <FiSend className="h-3 w-3 sm:h-4 sm:w-4 text-black" />
                            <span className="pl-1">
                            Regular | estimasi tiba besok - 26 Januari
                            </span>
                        </p>
                        </div>
                        <hr className="w-full border-t-1 border-gray-400 mt-4" />
                        <div className="mt-2 flex justify-between items-center">
                            <p className="text-sm sm:text-base text-gray-600">
                                Produk tidak sesuai?
                            </p>
                            <p className="text-sm sm:text-base font-medium text-black">
                                Laporkan
                            </p>
                        </div>
                    </div>
                </div>
                {/* Detail Produk */}
                {/* Pilihan dan Checkout */}
                <div className="col-span-1 pr-5 justify-center">
                    <div className="relative">
                        <p className="font-semibold text-sm sm:text-base">
                        Pilih Ukuran
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                        {uniqueSizes.map(size => (
                                <button
                                key={size}
                                className={`
                                    px-3 sm:px-4 py-1.5 sm:py-2
                                    text-xs sm:text-sm
                                    rounded-sm
                                    ${
                                    selectedSize === size
                                        ? "bg-brandblue text-white font-bold"
                                        : "bg-gray-300 text-black"
                                    }
                                `}
                                onClick={() => handleSizeClick(size)}
                                >
                                {size}
                                </button>
                            ))}
                        </div>
                        <p className="font-semibold text-sm sm:text-base mt-3">
                        Pilih Warna
                        </p>
                        <div className="flex flex-wrap gap-1 my-2">
                        {allColors.map(color => {
                            const isAvailable = availableColorsBySize?.includes(color);
                            return (
                            <button
                                key={color}
                                onClick={() => isAvailable && handleColorClick(color)}
                                disabled={!isAvailable}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2
                                    text-xs sm:text-sm
                                    rounded-sm transition
                                ${
                                    selectedColor === color
                                    ? "bg-brandblue text-white font-bold"
                                    : isAvailable
                                    ? "bg-gray-300 text-black"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }
                                `}
                            >
                                {color}
                            </button>
                            );
                        })}
                        </div>
                    </div>
                    <div className="w-full flex md:justify-start">
                        <div className="relative w-fit h-auto">
                            <div className="  border-2 border-gray-300
                                mt-4 sm:mt-5
                                p-3 rounded-lg
                                w-full max-w-[400px]">
                                <p className="font-semibold text-sm sm:text-base">Atur Jumlah Pemesanan</p>
                                {/* tombol menambah pesanan */}
                                <div className=" flex items-center mt-4">
                                    <div className="flex items-center justify-center
                                    p-2 h-9 sm:h-10 w-28 sm:w-32
                                    border-2 border-gray-300 rounded-lg">
                                        <button
                                            className="flex justify-center items-center
                                            h-5 w-5 sm:h-6 sm:w-6
                                            bg-gray-400 text-white
                                            rounded-md text-sm sm:text-base font-bold"
                                            onClick={kurangiPesanan}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="text"
                                            value={jumlahPesanan}
                                            readOnly
                                            className="w-16 text-center "
                                        />
                                        <button
                                            className="flex justify-center items-center
                                            h-5 w-5 sm:h-6 sm:w-6
                                            bg-gray-400 text-white
                                            rounded-md text-sm sm:text-base font-bold"
                                            onClick={tambahPesanan}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className="ml-3 text-xs sm:text-sm">
                                    Stok : 
                                    <span className="font-bold"> {product.stock}</span>
                                    </p>
                                </div>
                                <p className="mt-4 flex justify-between text-sm sm:text-base">
                                Sub total{" "}
                                <span className="font-bold text-black">
                                    Rp. {subTotal.toLocaleString("id-ID")}
                                </span>
                                </p>
                                <div className="mt-4 flex gap-2 sm:gap-3">
                                    <button className="
                                        border px-3 sm:px-4 py-2
                                        rounded-lg w-full sm:w-36
                                        text-sm sm:text-base
                                        hover:bg-brandblue hover:text-white
                                    ">
                                        Beli
                                    </button>

                                    <button
                                        onClick={handleAddToCart}
                                        className="
                                        bg-brandblue text-white
                                        px-3 sm:px-4 py-2
                                        w-full sm:w-36
                                        rounded-lg
                                        flex items-center justify-center gap-2
                                        text-sm sm:text-base
                                        "
                                    >
                                        <FaShoppingCart className="text-sm sm:text-base" />
                                        Keranjang
                                    </button>
                                </div>
                            </div>
                            <div className="
                                flex items-center justify-center
                                p-2 gap-3 mt-2
                                text-xs sm:text-sm
                                ">
                                <p className="flex items-center gap-1">
                                    <BsChatSquareText className="h-3 w-3 sm:h-4 sm:w-4" />
                                    Chat
                                </p>

                                <img src={line} alt="" className="h-4 sm:h-5 w-auto" />

                                <p className="flex items-center gap-1">
                                    <IoMdHeartEmpty className="h-3 w-3 sm:h-4 sm:w-4" />
                                    Wishlist
                                </p>

                                <img src={line} alt="" className="h-4 sm:h-5 w-auto" />

                                <p className="flex items-center gap-1">
                                    <RiShareForwardLine className="h-3 w-3 sm:h-4 sm:w-4" />
                                    Share
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Pilihan dan Checkout */}
            {/*Ulasan Pribadi*/}
            <div className="flex gap-4">
                <div className="w-full md:w-2/3">

                    <hr className="w-full border-t border-gray-400" />
                    <p className="py-3 font-bold text-sm sm:text-base">Ulasan Pembeli</p>
                    
                    <div className="flex h-auto shadow-md p-4 rounded-lg">
                        <div className="flex gap-2 items-center">
                        <div>
                            <div className="flex items-center">
                            <span className="text-yellow-500 text-lg sm:text-xl">⭐</span>
                            <span className="text-lg sm:text-xl font-bold ml-1">4.7</span>
                            <span className="text-gray-500 text-xs sm:text-sm ml-1">
                                / 5.0
                            </span>
                            </div>

                            <p className="flex text-gray-500 text-xs sm:text-sm mt-1 gap-1 items-center">
                            86%
                            <span>|</span>
                            <span>861 Ulasan</span>
                            </p>
                        </div>
                        </div>
                        <div className="
                        grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3
                        gap-2 p-2 sm:p-3
                        text-xs sm:text-sm
                        ">
                        <p className="flex items-center gap-1">⭐ 5 <span>(476 ulasan)</span></p>
                        <p className="flex items-center gap-1">⭐ 4 <span>(241 ulasan)</span></p>
                        <p className="flex items-center gap-1">⭐ 3 <span>(112 ulasan)</span></p>
                        <p className="flex items-center gap-1">⭐ 2 <span>(26 ulasan)</span></p>
                        <p className="flex items-center gap-1">⭐ 1 <span>(6 ulasan)</span></p>
                        </div>

                    </div>
                    {/*review text*/}
                    <div className="mt-4">
                        {reviews.map((review, index) => (
                            <div key={index} className="flex items-start gap-5 p-4 border-b border-b-gray-200">
                                {/* Profile Image */}
                                <img
                                    src={review.imageProfile}
                                    alt={review.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div className="items-center justify-start">
                                    {/* Name & Date */}
                                    <h2 className="font-semibold text-base sm:text-lg pb-1 ">{review.name}</h2>
                                    <p className="text-sm pb-1">⭐⭐⭐⭐⭐</p>
                                    <p className="text-gray-500 text-sm sm:text-base pb-1">{review.date}</p>
                                    <p className="text-gray-600 text-sm sm:text-base pt-1">
                                        Variasi : {review.variasi}
                                    </p>
                                    {/* Ulasan */}
                                    <p className="text-black mt-2 text-justify text-sm sm:text-base">{review.ulasan}</p>
                                    {/* Gambar Ulasan */}
                                    <div className="flex gap-2 mt-2">
                                        <img src={review.imageUlasan} alt="" className="w-16 h-16 rounded-md"/>
                                        <img src={review.imageUlasan2} alt="" className="w-16 h-16 rounded-md"/>
                                    </div>
                                    <div className="flex items-center gap-1 mt-3">
                                        <AiTwotoneLike className="h-full w-4"/> <span className="text-gray-600 items-center">{review.like}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        {/*Grid 1*/}

        {/*Product Lain*/}
        {/*Rekomendasi*/}
        <div className="mt-6 pt-9 justify-center">
            <p className="font-bold text-base">Rekomendasi Untukmu</p>
            <p className="flex justify-center items-center my-5 pt-5 text-brandblue">Lihat Rekomendasi Lainnya <img src={right} alt="" className="flex h-full w-5 items-center" /></p>
        </div>
    </div>
    );
};
export default Details;