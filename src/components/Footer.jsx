import { Link } from "react-router-dom";
import { ShoppingBag, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 mt-20 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-200 rounded-xl flex items-center justify-center shadow-md">
                <ShoppingBag className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                TERBOO STORE
              </span>
            </Link>
            <p className="text-gray-50 mb-4 leading-relaxed font-medium">
              Everything you need, customized just for you
              <br />, will be confirmed right here.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/share/16YkB8xGH6/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300"
              >
                {/* Facebook SVG */}
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.406.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/terboostore/profilecard/?igsh=ZDZieW16Nml6Z25w"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-12 h-12 bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300"
              >
                {/* Instagram SVG */}
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.242-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.567 5.783 2.295 7.15 2.233 8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.771.131 4.659.363 3.678 1.344 2.697 2.325 2.465 3.437 2.406 4.718 2.347 6 .334 6.409.334 12c0 5.591.013 5.999.072 7.282.059 1.281.291 2.393 1.272 3.374.981.981 2.093 1.213 3.374 1.272C8.332 23.987 8.741 24 12 24s3.668-.013 4.948-.072c1.281-.059 2.393-.291 3.374-1.272.981-.981 1.213-2.093 1.272-3.374.059-1.283.072-1.691.072-7.282 0-5.591-.013-5.999-.072-7.282-.059-1.281-.291-2.393-1.272-3.374-.981-.981-2.093-1.213-3.374-1.272C15.668.013 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                </svg>
              </a>
              <a
                href="https://wa.me/201022926386"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 text-white rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300"
              >
                {/* WhatsApp SVG */}
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.004 2.003c-5.522 0-10 4.477-10 10 0 1.77.46 3.44 1.27 4.91L2 22l5.2-1.36c1.38.75 2.96 1.17 4.8 1.17 5.523 0 10-4.478 10-10s-4.477-10-10-10zm0 18.18c-1.57 0-3.03-.43-4.28-1.18l-.31-.18-3.08.81.82-3.01-.2-.31c-.73-1.26-1.14-2.71-1.14-4.21 0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.38-5.78c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12s-.62.78-.76.94c-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.42-1.34-1.66-.14-.24-.01-.36.11-.48.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.42-.54-.42h-.46c-.16 0-.42.06-.64.3s-.84.82-.84 2c0 1.18.86 2.34.98 2.5.12.16 1.68 2.56 4.1 3.58.57.25 1.02.39 1.36.5.57.18 1.1.16 1.52.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@terboostore?_t=ZS-8y38kqRDk4F&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-12 h-12 bg-gradient-to-br from-black to-gray-700 text-white rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300"
              >
                {/* TikTok SVG */}
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16.5 0c.2 1.8 1.7 3.2 3.5 3.4v3.2c-1.3.1-2.6-.2-3.8-.8v7.5c0 4.2-3.5 7.6-7.8 7.3-3.9-.2-7-3.4-7.1-7.3-.2-4.2 3.2-7.8 7.3-7.8.5 0 1 .1 1.5.2v3.3c-.5-.2-1-.3-1.5-.3-2.2 0-4 1.8-4 4s1.8 4 4 4c2.1 0 3.8-1.6 4-3.6V0h3.9z" />
                </svg>
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h2
              className="text-2xl font-extrabold text-white tracking-tight uppercase mb-4"
              style={{ letterSpacing: "0.02em" }}
            >
              Quick Links
            </h2>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "/" },
                { name: "Shop", href: "/shop" },
                { name: "About Us", href: "/#about" },
                { name: "Contact", href: "/#contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-100 hover:text-orange-500 transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Categories */}
          <div>
            <h2
              className="text-2xl font-extrabold text-white tracking-tight uppercase mb-4"
              style={{ letterSpacing: "0.02em" }}
            >
              Categories
            </h2>
            <ul className="space-y-2">
              {[
                "Elite Performance",
                "Professional",
                "Youth Training",
                "Basic Comfort",
              ].map((category) => (
                <li key={category}>
                  <a
                    href="/shop"
                    className="text-gray-100 hover:text-orange-500 transition-colors font-medium"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h2
              className="text-2xl font-extrabold text-white tracking-tight uppercase mb-4"
              style={{ letterSpacing: "0.02em" }}
            >
              Contact Info
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-50">
                <Mail className="w-5 h-5 text-orange-400" />
                <span className="text-sm">terboostore@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-50">
                <Phone className="w-5 h-5 text-orange-400" />
                <span className="text-sm">0102 292 6386</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-50">
                <MapPin className="w-5 h-5 text-orange-400 mt-0.5" />
                <span className="text-sm">cairo egypt</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
