import { useState } from "react";
import ProfileHeader from "./tabs/ProfileHeader";
import type { AccountTab } from "@/types/types";
import Biodata from "./tabs/Biodata";

const AccountPage = () => {
    const [activeTab, setActiveTab] =
        useState<AccountTab>("biodata");

    return (
        <div className="space-y-6">
            <ProfileHeader
                activeTab={activeTab}
                onChangeTab={setActiveTab}
            />

            <div className="bg-white rounded-xl border shadow-sm border-[#919191]/25 p-6 ">
                {activeTab === "biodata" && <Biodata/>}
                {activeTab === "address" && <div>Alamat</div>}
                {activeTab === "payment" && <div>Pembayaran</div>}
                {activeTab === "security" && <div>Keamanan</div>}
            </div>
        </div>
    );
};

export default AccountPage;
