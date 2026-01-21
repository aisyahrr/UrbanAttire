import React, { useState } from "react";
import Sidebar from "@/components/Landingpage/DashboardClient/Sidebar";
import Header from "@/components/Landingpage/DashboardClient/Header";
import Footer from "@/components/Landingpage/Footer";
import { Outlet } from "react-router-dom";

const Landingpage: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
        {/* Header */}
        <div className="md:px-20 px-5 py-5">
            <Header onMenuClick={() => setOpen(true)} />
        </div>

        <div className="flex flex-col md:flex-row gap-6 overflow-x-hidden md:px-20 px-5">
            {/* Sidebar */}
            <Sidebar open={open} onClose={() => setOpen(false)} />

            {/* Konten */}
            <main className="flex-1">
            <Outlet />
            </main>
        </div>

        {/* Footer */}
        <Footer />
        </>
  );
};

export default Landingpage;
