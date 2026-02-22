import React from "react";

const BlockBanner = () => {
  return (
    <section className="relative h-[500px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
        style={{
          backgroundImage: `url('/newasset/facilities/banner/facilitiesBanner.png')`,
        }}
      >
        <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-[2px]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full tracking-widest">
          Youth Hockey Central
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-4 mb-6 drop-shadow-lg">
          Youth Hockey Insights & Guidance
        </h1>
        <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed">
          Clear, trusted information to help families, players, and coaches
          navigate youth hockey — from development and training to teams,
          leagues, and decision-making.
        </p>
      </div>
    </section>
  );
};

export default BlockBanner;
