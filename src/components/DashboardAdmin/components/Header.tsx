import {
  faSearch,
  faBars,
  faBell,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface HeaderProps {
  onToggleSidebar: () => void;
  shop: {
    name: string;
    logo: string | null;
  } | null;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, shop }) => {
  return (
    <nav className="sticky z-9999 top-0 w-full bg-white shadow px-6 py-4 items-center flex justify-between">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <FontAwesomeIcon
          icon={faBars}
          className="w-10 h-10 cursor-pointer"
          onClick={onToggleSidebar}
        />

        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search"
            className="w-full rounded-full bg-gray-100 pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-2.5 text-gray-400 text-sm"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* NOTIFICATION */}
        <div className="relative">
          <FontAwesomeIcon
            icon={faBell}
            className="text-lg text-gray-600 cursor-pointer w-10 h-10"
          />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            9
          </span>
        </div>

        {/* LANGUAGE */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src="https://flagcdn.com/w40/gb.png"
            alt="UK Flag"
            className="w-5 h-5 rounded-sm"
          />
          <span className="text-sm text-gray-700">English</span>
          <FontAwesomeIcon
            icon={faChevronDown}
            className="text-xs text-gray-500"
          />
        </div>

        {/* PROFILE TOKO */}
        <div className="flex items-center gap-6 cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
            {!shop ? (
                    <div className="w-full h-full bg-gray-300 animate-pulse rounded-full" />
                ) : shop.logo ? (
                    <img
                    src={shop.logo}
                    alt={shop.name}
                    className="w-full h-full object-cover"
                    />
                ) : (
                    <span className="text-sm font-semibold">
                    {shop.name.charAt(0)}
                    </span>
                )}
            </div>

            <div className="text-sm">
            {!shop ? (
                <div className="w-20 h-3 bg-gray-300 animate-pulse rounded" />
            ) : (
                <>
                <div className="font-medium text-gray-800">{shop.name}</div>
                <div className="text-gray-500 text-xs">Seller</div>
                </>
            )}
            </div>
          </div>

          <FontAwesomeIcon
            icon={faChevronDown}
            className="text-xs text-gray-500"
          />
        </div>
      </div>
    </nav>
  );
};

export default Header;
