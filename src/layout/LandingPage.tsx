import React from "react";
import Navbar from '@/components/Landingpage/Navbar'
import Footer from '@/components/Landingpage/Footer'
import { Outlet } from "react-router-dom";
import { Title, Meta, Link } from "react-head";

const Landingpage: React.FC = () =>{
    return(
        <>
            <Title>Urban Attire</Title>
            <Meta name="Urban Attire" content="Toko fashion Urban Attire online" />
            <Link rel="icon" href="public/image/icon.png" />
            {/* Header */}
            <Navbar  />
            <div className="flex flex-col md:flex-row gap-6 overflow-x-hidden"> 
                {/* Konten utama */}
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