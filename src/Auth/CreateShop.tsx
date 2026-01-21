import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../libs/supabase";

export default function CreateShop() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkShop = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: shop } = await supabase
        .from("shops")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (shop) {
        navigate("/dashboard");
      }
    };

    checkShop();
  }, [navigate]);

  const uploadLogo = async (file: File, userId: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}.${fileExt}`;

    const { error } = await supabase.storage
      .from("shop-logos")
      .upload(fileName, file, {
        upsert: true,
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("shop-logos")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleCreateShop = async () => {
    if (!name) return;
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    let logoUrl: string | null = null;

    if (logo) {
      logoUrl = await uploadLogo(logo, user.id);
    }

    await supabase.from("shops").insert({
      name,
      owner_id: user.id,
      logo: logoUrl,
    });

    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* TITLE */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Buat Toko Kamu</h1>
          <p className="text-sm text-gray-500">
            Lengkapi data toko sebelum mulai berjualan
          </p>
        </div>

        {/* LOGO UPLOAD */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-24 h-24 rounded-full border flex items-center justify-center overflow-hidden">
            {logo ? (
              <img
                src={URL.createObjectURL(logo)}
                className="w-full h-full object-cover"
                alt="Logo Preview"
              />
            ) : (
              <span className="text-xs text-gray-400">Logo</span>
            )}
          </div>

          <label className="text-sm cursor-pointer text-blue-600">
            Upload Logo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setLogo(e.target.files ? e.target.files[0] : null)
              }
            />
          </label>
        </div>

        {/* SHOP NAME */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Nama Toko</label>
          <input
            type="text"
            placeholder="Contoh: Positive Pulse"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleCreateShop}
          disabled={!name || loading}
          className="w-full bg-black text-white py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Membuat Toko..." : "Buat Toko"}
        </button>
      </div>
    </div>
  );
}
