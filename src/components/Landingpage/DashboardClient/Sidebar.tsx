import React from "react";

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
    const Gopay = "/image/Gopay.png";
    const linkaja = "/image/linkaja.png";

    return (
        <>
        {/* OVERLAY */}
        {open && (
            <div
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            />
        )}

        {/* SIDEBAR */}
        <aside
            className={`
            fixed md:static z-50
            top-0 right-0 h-full w-72
            bg-white rounded-l-2xl md:rounded-2xl
            shadow border border-[#919191]/25
            transform transition-transform duration-300
            ${open ? "translate-x-0" : "translate-x-full"}
            md:translate-x-0
            `}
        >
            {/* HEADER MOBILE */}
            <div className="md:hidden flex justify-between items-center px-4 py-3 border-b border-[#919191]/25">
            <h3 className="text-lg font-semibold">Menu</h3>
            <button onClick={onClose}>✕</button>
            </div>
            
            <div className="space-y-4">
            <div className="px-4 py-2">
                <h3 className="text-lg font-semibold mb-2">Profil Saya</h3>
                <ul className="space-y-2">
                <li className="text-cyan-500">Informasi Akun</li>
                <li className="text-gray-600">Favorit</li>
                <li className="text-gray-600">Wishlist</li>
                </ul>
            </div>

            <hr className="text-[#919191]/25"/>

            <div className="px-4">
                <h3 className="text-lg font-semibold mb-2">Notifikasi</h3>
                <ul className="space-y-2">
                <li className="text-gray-600">Pemesanan</li>
                <li className="text-gray-600">Info Lainnya</li>
                </ul>
            </div>

            <hr className="text-[#919191]/25"/>

            <div className="px-4">
                <h3 className="text-lg font-semibold mb-2">Pembelian</h3>
                <ul className="space-y-2">
                <li className="text-gray-600">Daftar Transaksi</li>
                <li className="text-gray-600">Tagihan</li>
                </ul>
            </div>

            <hr className="text-[#919191]/25"/>

            <div className="px-4 pb-4 space-y-3">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src={linkaja} className="w-7 h-7" />
                    <span className="text-red-600 font-medium">LinkAja</span>
                </div>
                <button className="text-cyan-500">Hubungkan</button>
                </div>

                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src={Gopay} className="w-7 h-7" />
                    <span className="font-medium">Gopay</span>
                </div>
                <button className="text-cyan-500">Hubungkan</button>
                </div>
            </div>
            </div>
        </aside>
        </>
    );
};

export default Sidebar;
