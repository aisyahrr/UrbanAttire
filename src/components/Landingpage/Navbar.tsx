import { menuLinks } from "@/data/index";
import { useNavigate, NavLink } from "react-router-dom";
import { BsHandbag } from "react-icons/bs";
import { useCart } from "../../context/CartContext";
import CartDropdown from "./ui/CartDropdown";

import {
    faSearch,
    faBars,
    faTimes,
    faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { supabase } from "@/libs/supabase";
import { mergeGuestCartToDB } from "@/utils/MergeGuestCartToDB";

type UserAuth = {
    id: string;
    role: "buyer" | "seller";
    username: string;
    avatar: string | null;
};

type ShopInfo = {
    name: string;
    logo: string | null;
};


const NavbarUrban: React.FC = () => {
    const like = "/image/heart.png";
    const line = "/image/line.png";

    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const [user, setUser] = useState<UserAuth | null>(null);
    const [shop, setShop] = useState<ShopInfo | null>(null);
    const { cart } = useCart();
    const [openCart, setOpenCart] = useState(false);

    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);

    // profile and shop
    useEffect(() => {
    const fetchUserAndShop = async () => {
        const {
        data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
        setUser(null);
        setShop(null);
        return;
        }

        const { data: profile } = await supabase
        .from("profiles")
        .select("username, avatar, role")
        .eq("id", authUser.id)
        .single();

        if (!profile) return;

        setUser({
        id: authUser.id,
        role: profile.role,
        username: profile.username || "User",
        avatar: profile.avatar || null,
        });

        if (profile.role === "seller") {
        const { data: shop } = await supabase
            .from("shops")
            .select("name, logo")
            .eq("owner_id", authUser.id)
            .single();

        setShop(shop ?? null);
        } else {
        setShop(null);
        }
    };

    fetchUserAndShop();

    // realtime update login/logout
    const {
        data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
        fetchUserAndShop();
    });

    return () => subscription.unsubscribe();
    }, []);
    useEffect(() => {
    if (!user?.id) return;

    mergeGuestCartToDB(user.id).catch(console.error);
    }, [user?.id]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        navigate("/");
    };

    return (
        <div className="w-screen bg-white">
        {/* Top Bar */}
        <div className="hidden md:flex justify-between mx-14 my-4 px-5 font-roboto font-semibold">
            <div className="flex gap-6 text-sm">
            <h1>Store Location</h1>
            <h1>Help & Contact Us</h1>
            </div>
            <div className="flex gap-2">
                <div className="relative">
                <button
                    onClick={() => setOpenCart(prev => !prev)}
                    className="relative"
                >
                    <BsHandbag className="text-xl" />

                    {totalQty > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {totalQty}
                    </span>
                    )}
                </button>

                {openCart && (
                    <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-300 rounded-xl shadow-lg z-50">
                    <CartDropdown />
                    </div>
                )}
                </div>
                <img src={line} alt="line" className="h-5 w-auto" />
                <h1 className="flex gap-3 text-sm">
                    Wishlist
                    <img src={like} alt="like" className="h-5 w-auto" />
                </h1>
            </div>
        </div>

        {/* Logo + Search + Auth Buttons */}
        <div className="flex items-center justify-between gap-2 mx-5 md:mx-14 mb-3 px-0 pt-3 lg:px-5">
            <h1
            className="font-pacifico lg:text-[23px] text-[15px] text-brandblue cursor-pointer"
            onClick={() => navigate("/")}
            >
            Urban’ Attire
            </h1>

            {/* Search */}
            <div className="lg:flex justify-center gap-3">
            <h1 className="hidden lg:block font-roboto items-center text-[20px] pt-1">
                Kategori
            </h1>
            <form className="flex items-center border rounded-md border-slate-300 h-10 w-[250px] lg:w-[660px] bg-slate-100">
                <button type="submit">
                <FontAwesomeIcon icon={faSearch} className="ml-2 pt-1" />
                </button>
                <input
                type="text"
                placeholder="Cari di Urban Attire..."
                className="ml-2 pl-2 lg:w-[600px] bg-slate-100 focus:outline-none"
                />
            </form>
            </div>

            {/* AUTH DESKTOP (UI TIDAK BERUBAH) */}
            <div className="hidden md:flex gap-2 ml-7 relative">
            {!user ? (
                <>
                <button
                    className="h-9 w-20 border rounded-md border-brandblue"
                    onClick={() => navigate("/login")}
                >
                    <h1 className="text-lg font-semibold text-brandblue">
                    Masuk
                    </h1>
                </button>
                <button
                    className="h-9 w-20 rounded-md bg-brandblue"
                    onClick={() => navigate("/register")}
                >
                    <h1 className="text-lg font-semibold text-white">
                    Daftar
                    </h1>
                </button>
                </>
            ) : (
                <div className="relative">
                <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setOpenProfile(!openProfile)}
                >
                <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {user?.role === "seller" ? (
                    shop?.logo ? (
                        <img
                        src={shop.logo}
                        alt={shop.name}
                        className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="font-semibold text-white bg-brandblue w-full h-full flex items-center justify-center">
                        {shop?.name?.charAt(0).toUpperCase() ?? "S"}
                        </span>
                    )
                    ) : user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full object-cover"
                    />
                    ) : (
                    <span className="font-semibold text-white bg-brandblue w-full h-full flex items-center justify-center">
                        {user?.username.charAt(0).toUpperCase()}
                    </span>
                    )}
                </div>

                <span className="text-sm font-medium">
                    {user?.role === "seller"
                    ? shop?.name ?? "My Shop"
                    : user?.username}
                </span>

                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`transition-transform duration-200 ${
                    openProfile ? "rotate-180" : "rotate-0"
                    }`}
                />
                </div>

                {openProfile && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow z-50">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => navigate(`/Beranda`)}
                    >
                        Profile
                    </button>
                    {user.role === "seller" && (
                        <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => navigate("/dashboard")}
                        >
                        Dashboard
                        </button>
                    )}
                    <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                    </div>
                )}
                </div>
            )}
            </div>

            {/* Hamburger */}
            <button
            className="block md:hidden text-2xl text-brandblue"
            onClick={() => setIsOpen(!isOpen)}
            >
            <FontAwesomeIcon icon={faBars} />
            </button>
        </div>

        {/* Navigation Links */}
        <div
            className={`${
            isOpen ? "right-0 z-50" : "-right-full"
            } fixed top-0 py-3 h-full w-[250px] bg-white shadow-md transition-all md:static md:h-auto md:w-auto md:shadow-none`}
        >
            <div className="flex justify-between md:hidden mx-5 pt-3">
                <h1 className="font-pacifico text-brandblue">Urban’ Attire</h1>
                <button
                    className="text-red-600 p-1 rounded-md"
                    onClick={() => setIsOpen(false)}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>

            <ul className="flex flex-col md:flex-row justify-start items-start md:justify-center gap-6 md:gap-10 p-6 font-semibold">
            {menuLinks.map((data) => (
                <li key={data.id}>
                <NavLink
                    to={data.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                    `nav ${isActive ? "active" : ""}`
                    }
                >
                    {data.name}
                </NavLink>
                </li>
                ))}
                <hr className="md:hidden border border-gray-300 w-full " />
                {/* Wishlist */}
                <li className="md:hidden">
                <button
                    className="flex items-center gap-3 text-sm font-medium"
                    onClick={() => {
                    navigate("/wishlist");
                    setIsOpen(false);
                    }}
                >
                    <h1 className="flex gap-3 text-sm">
                        <img src={like} alt="like" className="h-5 w-auto" />
                        Wishlist
                    </h1>
                </button>
                </li>

                {/* Cart */}
                <li className="md:hidden">
                <button
                    className="flex items-center gap-3 text-sm font-medium"
                    onClick={() => {
                    navigate("/Cart");
                    setIsOpen(false);
                    }}
                >
                    <BsHandbag className="text-xl" /> Cart
                    {totalQty > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {totalQty}
                    </span>
                    )}
                </button>
                </li>
            {/* AUTH MOBILE */}
            <div className="w-full flex flex-col gap-2 mt-5 md:hidden">
                {!user ? (
                <>
                    <button
                    className="h-9 w-full border rounded-md border-brandblue"
                    onClick={() => navigate("/Masuk")}
                    >
                    Masuk
                    </button>
                    <button
                    className="h-9 w-full rounded-md bg-brandblue text-white"
                    onClick={() => navigate("/register")}
                    >
                    Daftar
                    </button>
                </>
                ) : (
                <div className="relative">
                <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setOpenProfile(!openProfile)}
                >
                <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {user?.role === "seller" ? (
                    shop?.logo ? (
                        <img
                        src={shop.logo}
                        alt={shop.name}
                        className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="font-semibold text-white bg-brandblue w-full h-full flex items-center justify-center">
                        {shop?.name?.charAt(0).toUpperCase() ?? "S"}
                        </span>
                    )
                    ) : user?.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-full h-full object-cover"
                    />
                    ) : (
                    <span className="font-semibold text-white bg-brandblue w-full h-full flex items-center justify-center">
                        {user?.username.charAt(0).toUpperCase()}
                    </span>
                    )}
                </div>

                <span className="text-sm font-medium">
                    {user?.role === "seller"
                    ? shop?.name ?? "My Shop"
                    : user?.username}
                </span>

                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`transition-transform duration-200 ${
                    openProfile ? "rotate-180" : "rotate-0"
                    }`}
                />
                </div>

                {openProfile && (
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded shadow z-50">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => navigate(`/Beranda`)}
                    >
                        Profile
                    </button>
                    {user.role === "seller" && (
                        <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => navigate("/dashboard")}
                        >
                        Dashboard
                        </button>
                    )}
                    <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                    </div>
                )}
                </div>
                )}
            </div>
            </ul>
        </div>
        
        </div>
    );
};

export default NavbarUrban;
