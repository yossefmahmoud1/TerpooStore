import React from "react";

const AboutSection = () => {
  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-br from-blue-50 via-white to-pink-50 shadow-lg"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row-reverse items-center p-8 md:p-0 relative overflow-hidden">
        {/* Logo/Image on the right half */}
        <div className="w-full md:w-1/2 flex items-center justify-center md:justify-end bg-gradient-to-l from-pink-50 via-white to-blue-50 md:rounded-r-2xl md:rounded-l-none p-0 md:p-12 h-48 md:h-full">
          <img
            src="/logo.png"
            alt="Terboo Store Logo"
            className="w-32 h-32 md:w-60 md:h-60 object-contain"
          />
        </div>
        {/* Text on the left half */}
        <div className="w-full md:w-1/2 text-gray-800 text-center md:text-left flex flex-col justify-center p-0 md:p-12">
          <h2 className="text-3xl font-extrabold mb-4 text-pink-600 tracking-tight">
            About Our Brand
          </h2>
          <p className="mb-3 text-lg font-semibold">
            <span className="font-bold text-blue-700">Terboo Store</span> is
            your go-to destination for the latest and original indoor sports
            shoes.
          </p>
          <p className="mb-2 text-base">
            We specialize in providing top-quality kicks designed specifically
            for indoor games — whether you play volleyball, handball, squash, or
            train indoors.
          </p>
          <p className="mb-2 text-base">
            We help you choose the perfect pair based on your sport, your role,
            and your movement needs.
          </p>
          <p className="mb-2 text-base">
            All our shoes are 100% original and carefully selected to boost your
            comfort, grip, and performance on indoor courts.
          </p>
          <div className="mt-5 flex items-center justify-center md:justify-start">
            <span className="mr-2 text-2xl" role="img" aria-label="medal">
              🏅
            </span>
            <span className="text-lg font-bold text-blue-700">
              Terboo Store — built for the game, made for you.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
