
export const HeroSection = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center pt-20">
      <div className="text-center max-w-4xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Welcome to <span className="text-[#4ADE80]">TechHub</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
          The ultimate platform for modern technology solutions and innovation
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="button-gradient text-white font-medium px-8 py-4 rounded-full hover:scale-105 transition-transform duration-200">
            Explore Features
          </button>
          <button className="border border-white/20 text-white font-medium px-8 py-4 rounded-full hover:bg-white/10 transition-colors duration-200">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};
