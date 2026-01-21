import React from "react";
const Footer: React.FC = () => {
    return(
    <footer className="mt-10 bg-slate-200 w-full h-auto lg:py-10 py-5">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 w-full p-3 lg:mx-10">
            {/* Hubungi Kami */}
            <div className="flex flex-col gap-4">
              <h1 className="font-sans font-bold">Hubungi Kami</h1>
              <div>
                <h2 className="font-sans font-bold">Jam Operasional</h2>
                <p className="font-normal">Jam 9:00 - 20:00 WIB</p>
              </div>
              <div>
                <h2 className="font-sans font-bold ">Layanan Pengaduan Konsumen</h2>
                <p className="font-normal">
                  PT AA DKK Indonesia / www.urbanattire.id
                </p>
                <p className="font-normal">Call Center: 1500***</p>
                <p className="font-normal">WhatsApp: 0812 8009 ****</p>
                <p className="font-normal">Email: cs@urbanattire.id</p>
              </div>
              <div>
                <h2 className="font-sans font-bold">
                  Direktorat Jenderal Perlindungan Konsumen
                </h2>
                <p className="font-normal">Kementerian Perdagangan RI</p>
                <p className="font-normal">Call Center: 1500***</p>
                <p className="font-normal">WhatsApp: +62853 1111 1010</p>
              </div>
            </div>

            {/* Shopping With Urban Attire */}
            <div className="flex flex-col gap-4">
              <h1 className="font-sans font-bold ">Shopping With Urban Attire </h1>
              <div>
                <p className="font-normal">Size Guide</p>
                <p className="font-normal">Store Location</p>
              </div>
            </div>

            {/* Customer Care */}
            <div className="flex flex-col gap-4">
              <h1 className="font-sans font-bold">Customer Care</h1>
              <div>
                <p className="font-normal">Delivery & Returns</p>
                <p className="font-normal">Payment Information</p>
                <p className="font-normal">Help & Contact Us</p>
                <p className="font-normal">Track My Order</p>
                <p className="font-normal">FAQ</p>
              </div>
            </div>

            {/* Information */}
            <div className="flex flex-col gap-4">
              <h1 className="font-sans font-bold">Information</h1>
              <div>
                <p className="font-normal">Career</p>
                <p className="font-normal">About Us</p>
                <p className="font-normal">Urban Attire Fashion</p>
              </div>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-4">
              <h1 className="font-sans font-bold">Legal</h1>
              <div>
                <p className="font-normal">Term & Conditions</p>
                <p className="font-normal">Privacy & Cookies</p>
              </div>
            </div>
          </div>
          <h1 className="justify-center text-center items-center font-sans text-slate-400">
            Copyright © 2024 Urban Attire All rights reserved.
          </h1>
    </footer>
    );
};
export default Footer;