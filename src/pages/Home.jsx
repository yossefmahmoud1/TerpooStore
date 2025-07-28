import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Users,
  Award,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
// Images are now referenced directly from public folder
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../components/ui/carousel";
import autoScroll from "embla-carousel-auto-scroll";
import { ClipLoader } from "react-spinners";
import { useProducts } from "../hooks/useProducts";
import AboutSection from "../components/AboutSection";
import emailjs from "@emailjs/browser";
const Home = () => {
  const [formData, setFormData] = useState({
    from_name: "",
    from_email: "",
    message: "",
  });
  const form = useRef();
  const [formErrors, setFormErrors] = useState({});

  const {
    data: allProducts = [],
    isLoading: loadingProducts,
    error: productsError,
  } = useProducts();

  const bestSellers = allProducts.filter((p) => p.bestSeller);

  const heroRef = useRef(null);
  const bestSellersRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    let errors = {};
    if (!formData.from_name) errors.from_name = "Name is required";
    if (!formData.from_email) errors.from_email = "Email is required";
    if (!formData.message) errors.message = "Message is required";
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    emailjs
      .sendForm(
        "service_v854c7e",
        "template_n3azux9",
        form.current,
        "AbYOOzjElPdO9oLZh"
      )
      .then(
        (result) => {
          // استخراج الاسم من الفورم (قبل @ إذا كان إيميل، أو الاسم كما هو)
          let name = formData.from_name;
          if (!name && formData.from_email) {
            name = formData.from_email.split("@")[0];
          }
          toast.success(
            `Thank you for contacting us, ${name}! We will get back to you as soon as possible.`
          );
          setFormData({ from_name: "", from_email: "", message: "" }); // تفريغ الحقول
          setFormErrors({});
        },
        (error) => {
          console.error(error.text);
          toast.error(
            "There was a problem sending your message. Please try again."
          );
        }
      );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100); // wait for render
      }
    }
  }, []);
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    {
      title: "PREMIUM QUALITY",
      subtitle: "Professional Handball Equipment",
      image: "/Main slider/1.jpg",
    },
    {
      title: "CHAMPION'S CHOICE",
      subtitle: "Elite Performance Gear",
      image: "/Main slider/2.jpg",
    },
    {
      title: "New Offers Coming Soon!",
      subtitle: "Stay tuned for the latest at Terpoo Store!",
      image: "/Main slider/3.jpg",
    },
  ];

  // Hero Slider (main slider)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);

    // لا توقف السلايدر عند التفاعل
    return () => clearInterval(interval);
  }, [slides.length]);

  // Handler for dot click
  const handleDotClick = (index) => {
    setActiveIndex(index);
  };
  return (
    <div className="min-h-screen">
      {/* Hero Auto-Playing Image Slider */}
      <section className="w-full pt-2 bg-gradient-to-r from-[#e0e7ff] via-[#fce7f3] to-[#cffafe]">
        <div className="relative w-full h-[400px] md:h-[550px] overflow-hidden rounded-xl shadow-lg bg-white">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ${
                activeIndex === idx
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/40 rounded-2xl">
                {slide.title && (
                  <h1
                    className="text-[60px] md:text-[100px] font-extrabold text-white uppercase tracking-tight drop-shadow-2xl"
                    style={{
                      WebkitTextStroke: "0px",
                      textShadow:
                        "4px 4px 16px #000, 0 2px 8px #000, 0 0 2px #000",
                    }}
                  >
                    {slide.title}
                  </h1>
                )}
                {slide.subtitle && (
                  <p
                    className="text-2xl md:text-4xl text-white font-semibold mt-2 drop-shadow-2xl"
                    style={{ textShadow: "2px 2px 8px #000, 0 1px 4px #000" }}
                  >
                    {slide.subtitle}
                  </p>
                )}
              </div>
              <img
                src={slide.image}
                alt={slide.title || `Slide ${idx + 1}`}
                className="w-full h-full object-cover rounded-2xl bg-gray-800"
              />
            </div>
          ))}
          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-30">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition duration-300 border-2 border-white ${
                  activeIndex === index
                    ? "bg-pink-500 scale-125 shadow-lg"
                    : "bg-gray-300 hover:bg-pink-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Products Section */}
      <motion.section
        ref={bestSellersRef}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="py-24 bg-white"
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <h2
              className="text-4xl md:text-5xl font-extrabold text-pink-600 tracking-tight uppercase mb-0"
              style={{ letterSpacing: "0.02em" }}
            >
              Best Sellers
            </h2>
          </motion.div>
          {loadingProducts ? (
            <div className="flex justify-center items-center py-16">
              <ClipLoader color="#2563eb" size={56} />
            </div>
          ) : (
            <div className="max-w-5xl mx-auto relative">
              <Carousel
                opts={{ align: "start", loop: true }}
                plugins={[
                  autoScroll({
                    speed: 1,
                    delay: 0, // اجعل التأخير صفر
                    stopOnInteraction: false, // لا يتوقف عند التفاعل
                  }),
                ]}
              >
                <CarouselContent>
                  {/* Render the rest of your bestSellers as before */}
                  {bestSellers.map((product, index) => (
                    <CarouselItem
                      key={product.id}
                      className="px-1 sm:px-3 basis-full sm:basis-1/2 lg:basis-1/3 flex max-w-xs mx-auto"
                    >
                      <ProductCard product={product} index={index} small />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex items-center justify-center bg-white shadow-lg border border-gray-200 w-10 h-10 rounded-full absolute z-10 left-0 top-1/2 -translate-x-full -translate-y-1/2 hover:bg-gray-100 transition" />
                <CarouselNext className="hidden md:flex items-center justify-center bg-white shadow-lg border border-gray-200 w-10 h-10 rounded-full absolute z-10 right-0 top-1/2 translate-x-full -translate-y-1/2 hover:bg-gray-100 transition" />
              </Carousel>
            </div>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-purple-800 hover:scale-105 transition-all duration-300"
            >
              <span>View All Products</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </motion.section>
      {/* Special Offers Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            className="text-4xl md:text-5xl font-extrabold text-pink-600 tracking-tight uppercase mb-12 text-center"
            style={{ letterSpacing: "0.02em" }}
          >
            Special Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Adidas */}
            <div className="rounded-2xl overflow-hidden shadow-lg relative group">
              <img
                src="/addidas specaial.png"
                alt="Adidas Shoe Special Offer"
                className="w-full h-96 object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black/50 py-4 text-center">
                <span className="text-white font-extrabold text-xl tracking-wide">
                  ADIDAS
                </span>
              </div>
            </div>
            {/* Nike */}
            <div className="rounded-2xl overflow-hidden shadow-lg relative group">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop"
                alt="Nike"
                className="w-full h-96 object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black/50 py-4 text-center">
                <span className="text-white font-extrabold text-xl tracking-wide">
                  NIKE
                </span>
              </div>
            </div>
            {/* Under Armour */}
            <div className="rounded-2xl overflow-hidden shadow-lg relative group">
              <img
                src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&h=600&fit=crop"
                alt="Under Armour"
                className="w-full h-96 object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black/50 py-4 text-center">
                <span className="text-white font-extrabold text-xl tracking-wide">
                  UNDER ARMOUR
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* All Our Brands Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2
            className="text-4xl md:text-5xl font-extrabold text-pink-600 tracking-tight uppercase mb-8"
            style={{ letterSpacing: "0.02em" }}
          >
            ALL OUR BRANDS
          </h2>
          {/* Mobile grid view with next/prev buttons */}
          <div className="block md:hidden mb-8">
            <MobileBrandGridWithButtons />
          </div>
          {/* Desktop slider view */}
          <div className="hidden md:block">
            <BrandLogosPaginated />
          </div>
        </div>
      </section>
      {/* About Us Section */}
      <AboutSection />
      {/* Contact Us Section */}
      <motion.section
        ref={contactRef}
        id="contact"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="py-24 bg-gradient-to-br from-blue-50 via-white to-pink-50 shadow-lg"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-center mb-12"
          >
            <h2
              className="text-4xl md:text-5xl font-extrabold text-pink-600 tracking-tight uppercase mb-0"
              style={{ letterSpacing: "0.02em" }}
            >
              GET IN TOUCH
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-2xl shadow-lg border border-gray-100"
            >
              <form onSubmit={handleSubmit} ref={form} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-blue-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="from_name"
                    value={formData.from_name}
                    onChange={handleChange}
                    className={`w-full px-5 py-3 border-2 rounded-xl transition-all bg-white font-bold text-gray-900 shadow-md outline-none ${
                      formErrors.from_name
                        ? "border-red-500"
                        : "border-blue-200"
                    } focus:ring-2 focus:ring-blue-700 focus:border-blue-700`}
                    placeholder="Your name"
                  />
                  {formErrors.from_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.from_name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="from_email"
                    value={formData.from_email}
                    onChange={handleChange}
                    className={`w-full px-5 py-3 border-2 rounded-xl transition-all bg-white font-bold text-gray-900 shadow-md outline-none ${
                      formErrors.from_email
                        ? "border-red-500"
                        : "border-blue-200"
                    } focus:ring-2 focus:ring-blue-700 focus:border-blue-700`}
                    placeholder="your@email.com"
                  />
                  {formErrors.from_email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.from_email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-700 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-5 py-3 border-2 rounded-xl transition-all bg-white font-bold text-gray-900 shadow-md outline-none ${
                      formErrors.message ? "border-red-500" : "border-blue-200"
                    } focus:ring-2 focus:ring-blue-700 focus:border-blue-700 resize-none`}
                    placeholder="Your message..."
                  />
                  {formErrors.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-600 to-blue-700 text-white py-3 rounded-xl font-extrabold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div>
                <h3 className="text-2xl font-extrabold text-pink-600 mb-6">
                  Contact Information
                </h3>
                <div className="space-y-5">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <div className="font-bold text-blue-700">Email</div>
                      <div className="text-pink-600">terboostore@gmail.com</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <div className="font-bold text-blue-700">Phone</div>
                      <div className="text-pink-600">0102 292 6386</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <div className="font-bold text-blue-700">Address</div>
                      <div className="text-pink-600">cairo egypt</div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-extrabold text-purple-900 mb-4">
                  Follow Us
                </h4>
                <div className="flex space-x-4">
                  <a
                    href="https://www.facebook.com/share/16YkB8xGH6/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 text-white rounded-xl flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300"
                  >
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
            </motion.div>
          </div>{" "}
          {/* end grid */}
        </div>{" "}
        {/* end container */}
      </motion.section>
    </div>
  );
};

export default Home;

function BrandLogosPaginated() {
  const logos = [
    { src: "/Logos/hummel.png", alt: "Hummel" },
    { src: "/Logos/kempa.png", alt: "Kempa" },
    { src: "/Logos/select.png", alt: "Select" },
    { src: "/Logos/adidas_v2.png", alt: "Adidas" },
    { src: "/Logos/mizuno.png", alt: "Mizuno" },
    { src: "/Logos/asics.png", alt: "Asics" },
    { src: "/Logos/mcdavid.png", alt: "McDavid" },
    { src: "/Logos/craft.png", alt: "Craft" },
    { src: "/Logos/erima.png", alt: "Erima" },
    { src: "/Logos/errea.png", alt: "Errea" },
    { src: "/Logos/molten.png", alt: "Molten" },
    { src: "/Logos/puma.png", alt: "Puma" },
    { src: "/Logos/salming.png", alt: "Salming" },
    { src: "/Logos/tremblay_ct.png", alt: "Tremblay CT" },
  ];
  const [start, setStart] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const pageSize = 7;
  const canPrev = start > 0;
  const canNext = start + pageSize < logos.length;
  const visible = logos.slice(start, start + pageSize);
  const pageKey = start;

  const handlePrev = () => {
    setDirection(-1);
    setStart(start - pageSize);
  };
  const handleNext = () => {
    setDirection(1);
    setStart(start + pageSize);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-end mb-2">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          disabled={!canPrev}
          className="bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-100 transition disabled:opacity-40 mr-2"
          aria-label="Scroll left"
        >
          <span className="text-2xl">&#8249;</span>
        </button>
        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!canNext}
          className="bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-100 transition disabled:opacity-40"
          aria-label="Scroll right"
        >
          <span className="text-2xl">&#8250;</span>
        </button>
      </div>
      <div className="overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={pageKey}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="flex flex-row items-center justify-center gap-10 py-4 w-full select-none"
            style={{ overflow: "hidden" }}
          >
            {visible.map((logo) => (
              <img
                key={logo.src}
                src={logo.src}
                alt={logo.alt}
                className="h-12 w-auto opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition"
                draggable="false"
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function MobileBrandGridWithButtons() {
  const logos = [
    { src: "/Logos/hummel.png", alt: "Hummel" },
    { src: "/Logos/mizuno.png", alt: "Mizuno" },
    { src: "/Logos/kempa.png", alt: "Kempa" },
    { src: "/Logos/asics.png", alt: "Asics" },
    { src: "/Logos/select.png", alt: "Select" },
    { src: "/Logos/mcdavid.png", alt: "McDavid" },
    { src: "/Logos/adidas_v2.png", alt: "Adidas" },
    { src: "/Logos/salming.png", alt: "Salming" },
    { src: "/Logos/craft.png", alt: "Craft" },
    { src: "/Logos/erima.png", alt: "Erima" },
    { src: "/Logos/errea.png", alt: "Errea" },
    { src: "/Logos/molten.png", alt: "Molten" },
    { src: "/Logos/puma.png", alt: "Puma" },
    { src: "/Logos/tremblay_ct.png", alt: "Tremblay CT" },
  ];
  const pageSize = 6; // 3x2 grid per page
  const [start, setStart] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const canPrev = start > 0;
  const canNext = start + pageSize < logos.length;
  let visible = logos.slice(start, start + pageSize);
  // Fill with placeholders if less than 6
  if (visible.length < pageSize) {
    visible = [
      ...visible,
      ...Array(pageSize - visible.length).fill({ placeholder: true }),
    ];
  }
  const pageKey = start;

  const handlePrev = () => {
    setDirection(-1);
    setStart(start - pageSize);
  };
  const handleNext = () => {
    setDirection(1);
    setStart(start + pageSize);
  };

  return (
    <div className="max-w-xs mx-auto">
      {/* Move arrows here, under the section title */}
      <div className="flex justify-center gap-4 mb-4">
        <button
          onClick={handlePrev}
          disabled={!canPrev}
          className="bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-100 transition disabled:opacity-40"
          aria-label="Previous"
        >
          <span className="text-2xl">&#8249;</span>
        </button>
        <button
          onClick={handleNext}
          disabled={!canNext}
          className="bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center shadow hover:bg-gray-100 transition disabled:opacity-40"
          aria-label="Next"
        >
          <span className="text-2xl">&#8250;</span>
        </button>
      </div>
      <div className="overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={pageKey}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="grid grid-cols-2 grid-rows-3 gap-6"
          >
            {visible.map((logo, idx) =>
              logo.placeholder ? (
                <div key={"ph-" + idx} className="h-12" />
              ) : (
                <img
                  key={logo.src}
                  src={logo.src}
                  alt={logo.alt}
                  className="h-12 w-auto opacity-50 grayscale mx-auto"
                />
              )
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
