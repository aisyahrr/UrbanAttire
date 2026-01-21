import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/libs/supabase";
import toast from "react-hot-toast";

const Login: React.FC = () => {
    const logoUrl = "/image/google.png";
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);

        // 1️⃣ Login ke Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        });

        if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
        }

        const userId = data.user.id;

        // 2️⃣ Ambil role user
        const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

        if (profileError || !profile) {
        toast.error("Gagal mengambil data akun");
        navigate("/");
        setLoading(false);
        return;
        }

        // 3️⃣ Buyer → Homepage
        if (profile.role === "buyer") {
        toast.success("Login berhasil");
        setTimeout(() => navigate("/"), 800);
        setLoading(false);
        return;
        }

        // 4️⃣ Seller → cek toko
        const { data: shop } = await supabase
        .from("shops")
        .select("id")
        .eq("owner_id", userId)
        .single();

        toast.success("Login berhasil 🎉");

        setTimeout(() => {
        if (shop) {
            navigate("/dashboard");
        } else {
            navigate("/create-shop");
        }
        }, 800);

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row justify-center bg-gradient-to-b from-white to-cyan-200">

        {/* KIRI */}
        <div className="
        md:w-1/2
        flex items-center justify-center
        py-10 md:py-0
        ">
            <h1 className="
                text-3xl md:text-6xl
                font-semibold text-brandblue
                font-pacifico
            ">
                Urban' Attire
            </h1>
        </div>
        {/* KANAN */}
        <div className="
        md:w-1/2
        flex items-start md:items-center justify-center
        px-4
        ">
        <div className="
            bg-white
            p-6 md:p-8
            rounded-xl shadow-lg
            w-full max-w-sm
        ">
            <h2 className="text-lg font-semibold text-center mb-4">Login</h2>

            <input
                type="email"
                placeholder="E-mail atau Nomor HP"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <input
                type="password"
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <div className="flex items-center mb-4">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-2 text-gray-500 text-sm">atau</span>
                <hr className="flex-grow border-t border-gray-300" />
            </div>

            <button className="w-full flex items-center justify-center border border-gray-300 rounded py-2 hover:bg-gray-100 mb-4">
                <img src={logoUrl} alt="Google" className="w-5 h-5 mr-2" />
                <span className="text-sm">Masuk dengan Google</span>
            </button>

            <button
                className="w-full bg-cyan-500 text-white py-2 rounded hover:bg-cyan-600 disabled:opacity-50"
                onClick={handleLogin}
                disabled={loading}
            >
                {loading ? "Loading..." : "Login"}
            </button>

            <p className="text-sm text-center mt-4">
                Belum Punya Akun?{" "}
                <Link to="/register" className="text-cyan-600 hover:underline">
                Daftar
                </Link>
            </p>
            </div>
        </div>
        </div>
    );
};

export default Login;
