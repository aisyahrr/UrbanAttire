import { useEffect, useState } from "react";
import { supabase } from "@/libs/supabase";
import toast from "react-hot-toast";

type Shop = {
    id: string;
    name: string;
    logo: string | null;
};

export default function ShopSettings() {
    const [shop, setShop] = useState<Shop | null>(null);
    const [name, setName] = useState("");
    const [logo, setLogo] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // 🔹 GET SHOP PROFILE
    useEffect(() => {
        const fetchShop = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
            .from("shops")
            .select("id, name, logo")
            .eq("owner_id", user.id)
            .single();

        if (!error && data) {
            setShop(data);
            setName(data.name);
        }

        setLoading(false);
        };

        fetchShop();
    }, []);

    // 🔹 UPLOAD LOGO
    const uploadLogo = async (file: File, userId: string) => {
        const fileExt = file.name.split(".").pop();
        const fileName = `${userId}.${fileExt}`;

        const { error } = await supabase.storage
        .from("shop-logos")
        .upload(fileName, file, { upsert: true });

        if (error) throw error;

        const { data } = supabase.storage
        .from("shop-logos")
        .getPublicUrl(fileName);

        return data.publicUrl;
    };

    // 🔹 SAVE CHANGES
    const handleSave = async () => {
        if (!shop) return;
        setSaving(true);

        const {
        data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        let logoUrl = shop.logo;

        try {
        if (logo) {
            logoUrl = await uploadLogo(logo, user.id);
        }

        const { error } = await supabase
            .from("shops")
            .update({
            name,
            logo: logoUrl,
            })
            .eq("id", shop.id);

        if (error) throw error;

        toast.success("Profil toko berhasil diperbarui");

        setShop({
            ...shop,
            name,
            logo: logoUrl,
        });

        setLogo(null);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: unknown) {
        console.error("UPDATE SHOP ERROR:", err);

        if (err instanceof Error) {
            toast.error(err.message);
        } else {
            toast.error("Gagal menyimpan perubahan");
        }
        }
        setSaving(false);
    };

    if (loading) {
        return <div className="p-6">Loading settings...</div>;
    }

    if (!shop) {
        return <div className="p-6">Toko tidak ditemukan</div>;
    }

    return (
        <div className="max-w-3xl space-y-6">
        {/* TITLE */}
        <div>
            <h1 className="text-2xl font-semibold">Pengaturan Toko</h1>
            <p className="text-sm text-gray-500">
            Kelola identitas dan profil toko kamu
            </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-xl shadow p-6 space-y-6 inline-block">
            {/* LOGO */}
            <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full border overflow-hidden flex items-center justify-center bg-gray-100">
                {logo ? (
                <img
                    src={URL.createObjectURL(logo)}
                    alt="Preview"
                    className="w-full h-full object-cover"
                />
                ) : shop.logo ? (
                <img
                    src={shop.logo}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                />
                ) : (
                <span className="text-2xl font-bold">
                    {shop.name.charAt(0)}
                </span>
                )}
            </div>

            <div>
                <label className="text-sm font-medium cursor-pointer text-blue-600">
                Ganti Logo
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                    setLogo(e.target.files ? e.target.files[0] : null)
                    }
                />
                </label>
                <p className="text-xs text-gray-400">
                PNG / JPG • Max 2MB
                </p>
            </div>
            </div>

            {/* NAME */}
            <div className="space-y-1">
            <label className="text-sm font-medium">Nama Toko</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
            />
            </div>

            {/* ACTION */}
            <div className="flex justify-end">
            <button
                onClick={handleSave}
                disabled={saving || !name}
                className="bg-black text-white px-6 py-2 rounded-lg disabled:opacity-50"
            >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
            </div>
        </div>
        </div>
    );
}
