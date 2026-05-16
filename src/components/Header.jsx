import { useState, useRef, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  UserRound,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoImage from "../assets/images/icons/mediglow_logo.png";

function Header() {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [desktopSearch, setDesktopSearch] = useState("");
  const [mobileSearch, setMobileSearch] = useState("");
  const hasDesktopSearchInteracted = useRef(false);
  const hasMobileSearchInteracted = useRef(false);

  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // ✅ CLOSE USER MENU
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ LIVE SEARCH (DEBOUNCE)
  useEffect(() => {
    if (!hasDesktopSearchInteracted.current) return;

    const delay = setTimeout(() => {
      const term = desktopSearch.trim();

      if (!term) {
        navigate("/collection");
      } else {
        navigate(`/collection?search=${encodeURIComponent(term)}`);
      }
    }, 500); // ⏱ delay

    return () => clearTimeout(delay);
  }, [desktopSearch]);

  // ✅ MOBILE LIVE SEARCH
  useEffect(() => {
    if (!hasMobileSearchInteracted.current) return;

    const delay = setTimeout(() => {
      const term = mobileSearch.trim();

      if (!term) {
        navigate("/collection");
      } else {
        navigate(`/collection?search=${encodeURIComponent(term)}`);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [mobileSearch]);

  return (
    <header className="border-b border-slate-200 bg-black sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-3">
        <div className="flex items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center h-16 md:h-20 overflow-hidden">
            <img
              src={logoImage}
              alt="MediGlow Logo"
              onClick={() => navigate("/")}
              className="cursor-pointer 
               h-10 md:h-12 
               w-auto object-contain"
            />
          </div>



          {/* Desktop Search */}
          <div className="hidden flex-1 justify-center md:flex">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search for products..."
                value={desktopSearch}
                onChange={(e) => {
                  hasDesktopSearchInteracted.current = true;
                  setDesktopSearch(e.target.value);
                }}
                className="w-full rounded-lg border border-gray-400 bg-[#f9fafb] py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none focus:border-[#00607a] focus:ring-2 focus:ring-violet-50"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 md:gap-4">

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              className="md:hidden"
            >
              {isMobileSearchOpen ? (
                <X className="h-6 w-6 text-slate-700" />
              ) : (
                <Search className="h-6 w-6 text-slate-700" />
              )}
            </button>

             {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-[#00607a] sm:text-base cursor-pointer"
            >
              <ShoppingCart className="h-6 w-7" />


              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 h-5 w-5 flex items-center justify-center rounded-full bg-[#00607a] text-xs text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User */}
            {user ? (
              <div className="flex items-center gap-4">
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen((p) => !p)}
                    className="flex items-center text-sm font-medium text-slate-700 hover:text-[#00607a] sm:text-base cursor-pointer"
                  >
                    <UserRound className="h-6 w-6" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-32 rounded-lg border border-gray-400 bg-white shadow-lg z-50">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate("/profile");
                        }}
                        className="w-full px-2 py-1 text-sm hover:bg-[#207a6e] hover:text-white rounded-sm cursor-pointer"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate("/orders");
                        }}
                        className="w-full px-2 py-1 text-sm hover:bg-[#207a6e] hover:text-white rounded-sm cursor-pointer"
                      >
                        Order History
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                          navigate("/login");
                        }}
                        className="w-full px-2 py-1 text-sm text-red-600 hover:bg-gray-300 rounded-sm cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-[#207a6e] sm:text-base cursor-pointer"
              >
                <UserRound className="h-5 w-5" />
                <span className="">Login</span>
              </button>
            )}

           
          </div>
        </div>

        {/* Mobile Search */}
        <div className={`md:hidden ${isMobileSearchOpen ? "mb-2" : "hidden"}`}>
          <input
            type="text"
            placeholder="Search..."
            value={mobileSearch}
            onChange={(e) => {
              hasMobileSearchInteracted.current = true;
              setMobileSearch(e.target.value);
            }}
            className="w-full rounded-lg border border-gray-500 px-4 py-2"
          />
        </div>
      </div>
    </header>
  );
}

export default Header;    
