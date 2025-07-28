import { Link } from "react-router-dom";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Offline } from "react-detect-offline";

const categories = [
  {
    name: "Shoes",
    sub: [
      "adidas",
      "Asics",
      "Hummel",
      "Kempa",
      "Mizuno",
      "Nike",
      "Puma",
      "View All",
    ],
  },
  {
    name: "Clothing",
    sub: ["Shirts", "Shorts", "Socks", "Jackets", "View All"],
  },
  {
    name: "Handballs",
    sub: ["Select", "Kempa", "Molten", "adidas", "View All"],
  },
  {
    name: "Gear",
    sub: ["Bags", "Protection", "Accessories", "View All"],
  },
  {
    name: "Brands",
    sub: [
      "adidas",
      "Asics",
      "Hummel",
      "Kempa",
      "Mizuno",
      "Nike",
      "Puma",
      "View All",
    ],
  },
];

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    const updateName = () =>
      setFirstName(localStorage.getItem("firstName") || "");
    updateName();
    window.addEventListener("storage", updateName);
    return () => window.removeEventListener("storage", updateName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("firstName");
    localStorage.setItem("isAdmin", "false");
    setFirstName("");
    // يمكنك هنا عمل window.location.reload() لو أردت ريفرش كامل
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo only on mobile */}
        <Link to="/" className="flex items-center mx-auto md:mx-0">
          <span className="text-2xl md:text-3xl font-extrabold tracking-widest text-pink-600 flex items-center gap-1 select-none">
            TERB
            <span className="inline-block align-middle">
              {/* كرة مكان O */}
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="14"
                  cy="14"
                  r="13"
                  fill="#f43f5e"
                  stroke="#fff"
                  strokeWidth="2"
                />
                <circle
                  cx="14"
                  cy="14"
                  r="7"
                  fill="#fff"
                  stroke="#f43f5e"
                  strokeWidth="2"
                />
              </svg>
            </span>
            STORE
          </span>
        </Link>

        {/* Main Nav - hidden on mobile */}
        <div className="flex-1 flex justify-center">
          <ul className="hidden md:flex gap-8 text-base font-semibold uppercase tracking-wide">
            <li>
              <Link
                to="/"
                className="text-gray-800 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-blue-50"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/shop"
                className="text-gray-800 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-blue-50"
              >
                Shop
              </Link>
            </li>
            <li>
              <a
                href="/#about"
                className="text-gray-800 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-blue-50"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/#contact"
                className="text-gray-800 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-blue-50"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Burger Menu Icon - only on mobile */}
        <button
          className="md:hidden ml-2 p-2 rounded hover:bg-gray-100 focus:outline-none"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-7 h-7 text-gray-700" />
        </button>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-4">
          <Offline>
            <span className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold shadow text-sm uppercase tracking-wide ml-2">
              Offline: No Internet Connection
            </span>
          </Offline>
          {firstName ? (
            <>
              <span className="px-4 py-2 bg-pink-600 text-white rounded-lg font-semibold shadow text-sm uppercase tracking-wide">
                Welcome, {firstName}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition-colors text-sm uppercase tracking-wide"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-pink-600 text-white rounded-lg font-semibold shadow hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm uppercase tracking-wide"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Sidebar Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 flex justify-end">
            <div className="w-64 bg-white h-full shadow-lg p-6 flex flex-col">
              <button
                className="self-end mb-8 text-gray-500 hover:text-blue-600 text-3xl font-bold focus:outline-none"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ×
              </button>
              <nav className="flex flex-col gap-6 text-lg font-semibold uppercase tracking-wide">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-800 hover:text-blue-600 transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-800 hover:text-blue-600 transition-colors"
                >
                  Shop
                </Link>
                <a
                  href="/#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-800 hover:text-blue-600 transition-colors"
                >
                  About
                </a>
                <a
                  href="/#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-800 hover:text-blue-600 transition-colors"
                >
                  Contact
                </a>
                <hr className="my-2 border-gray-200" />
                {firstName ? (
                  <>
                    <span className="px-4 py-2 bg-pink-600 text-white rounded-lg font-semibold shadow text-sm uppercase tracking-wide text-center">
                      Welcome, {firstName}
                    </span>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="mt-2 px-3 py-2 bg-red-600 text-white rounded-lg font-semibold shadow hover:bg-red-700 transition-colors text-sm uppercase tracking-wide"
                    >
                      Log out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2 bg-pink-600 text-white rounded-lg font-semibold shadow hover:bg-pink-700 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm uppercase tracking-wide text-center"
                  >
                    Login
                  </Link>
                )}
              </nav>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
          </div>
        )}
      </nav>
    </header>
  );
}
