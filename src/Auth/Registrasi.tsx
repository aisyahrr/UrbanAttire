import { useState } from "react";
import { supabase } from "../libs/supabase";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

type UserRole = "buyer" | "seller";

export default function Register() {
    const navigate = useNavigate();
    const [role, setRole] = useState<UserRole>("buyer");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
        // 1️⃣ AUTH (EMAIL + PASSWORD)
        const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: import.meta.env.VITE_SITE_URL,
        },
        });


        if (error) {
            toast.error(error.message);
            return;
        }

        const userId = data.user?.id;
        if (!userId) {
            toast.error("Gagal mendapatkan user ID");
            return;
        }

        // 2️⃣ INSERT PROFILE (USERNAME + ROLE)
        const { error: profileError } = await supabase
            .from("profiles")
            .insert({
            id: userId,
            username,
            role,
            avatar: null,
            });

        if (profileError) {
            toast.error(profileError.message);
            return;
        }

        // ✅ SUKSES
        toast.success("Akun berhasil dibuat");

        setTimeout(() => {
            if (role === "seller") {
            navigate("/create-shop");
            } else {
            navigate("/");
            }
        }, 1200);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err: unknown) {
        toast.error("Terjadi kesalahan saat registrasi");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="flex h-screen">
        {/* KIRI */}
        <div className="w-1/2 bg-gradient-to-b from-white to-cyan-200 flex items-center justify-center">
            <h1 className="text-6xl font-semibold text-brandblue font-pacifico">
            Urban' Attire
            </h1>
        </div>

        {/* KANAN */}
        <div className="w-1/2 bg-gradient-to-b from-white to-cyan-200 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold text-center mb-4">
                Daftar Akun
            </h2>

            <form onSubmit={handleRegister} className="space-y-3">
                <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
                />
                {/* EMAIL */}
                <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />

                {/* PASSWORD */}
                <input
                type="password"
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />

                {/* ROLE */}
                <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                <option value="buyer">Sebagai Pembeli</option>
                <option value="seller">Sebagai Penjual</option>
                </select>

                {/* BUTTON */}
                <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 text-white py-2 rounded hover:bg-cyan-600 disabled:opacity-50"
                >
                {loading ? "Loading..." : "Daftar"}
                </button>
            </form>

            <p className="text-sm text-center mt-4">
                Sudah punya akun?{" "}
                <Link to="/login" className="text-cyan-600 hover:underline">
                Login
                </Link>
            </p>
            </div>
        </div>
        </div>
    );
}
