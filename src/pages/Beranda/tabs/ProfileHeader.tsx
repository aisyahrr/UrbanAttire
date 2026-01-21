import type { AccountTab } from "@/types/types";
import { useEffect, useState } from "react";
import { supabase } from "@/libs/supabase";

interface Props {
    activeTab: AccountTab;
    onChangeTab: (tab: AccountTab) => void;
}

const tabs: { key: AccountTab; label: string }[] = [
    { key: "biodata", label: "Identitas & Biodata" },
    { key: "address", label: "Daftar Alamat" },
    { key: "payment", label: "Pembayaran" },
    { key: "security", label: "Keamanan" },
];

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

const ProfileHeader: React.FC<Props> = ({
    activeTab,
    onChangeTab,
    }) => {
    const [user, setUser] = useState<UserAuth | null>(null);
    const [shop, setShop] = useState<ShopInfo | null>(null);

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
    }, []);

    const displayName =
        user?.role === "seller"
        ? shop?.name ?? "My Shop"
        : user?.username ?? "User";

    return (
        <div className="bg-white rounded-xl border shadow-sm border-[#919191]/25 p-6">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-4">
            {/* AVATAR / LOGO */}
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
            {user?.role === "seller" ? (
                shop?.logo ? (
                <img
                    src={shop.logo}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                />
                ) : (
                <span className="font-semibold text-xl">
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
                <span className="font-semibold text-xl">
                {user?.username?.charAt(0).toUpperCase() ?? "U"}
                </span>
            )}
            </div>

            {/* INFO */}
            <div>
            <h2 className="font-semibold">{displayName}</h2>
            <span className="text-sm text-gray-500">
                ⭐ 4.9 / 5.0
            </span>
            </div>
        </div>

        {/* TABS */}
        <div className=" flex flex-col md:flex-row gap-3 md:gap-6 justify-center border-t border-[#919191]/25 pt-4 text-base">
            {tabs.map((tab) => (
            <button
                key={tab.key}
                onClick={() => onChangeTab(tab.key)}
                className={`pb-2 transition ${
                activeTab === tab.key
                    ? "text-cyan-500 font-semibold"
                    : "text-gray-500 hover:text-cyan-400"
                }`}
            >
                {tab.label}
            </button>
            ))}
        </div>
        </div>
    );
};

export default ProfileHeader;
