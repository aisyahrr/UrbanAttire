import React from "react";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";

interface HeaderProps {
    onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const navigate = useNavigate();

        return (
            <header className="flex items-center justify-between">
                <h1
                    className="font-pacifico lg:text-[23px] text-[20px] text-brandblue cursor-pointer"
                    onClick={() => navigate("/")}
                >
                    Urban’ Attire
                </h1>

                {/* BURGER BUTTON (MOBILE ONLY) */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden "
                >
                <RxHamburgerMenu size={25}/>
                </button>
            </header>
        );
};

export default Header;
