
import { TextGenerateEffect } from "./TextGenerateEffect";

const scrollToProducts = () => {
  const element = document.getElementById('produtos');
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
};

export const HeroSectionNew = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#4ADE80]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div className="space-y-8">
          <TextGenerateEffect 
            words="Bem-vindo ao TechHub" 
            className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-white via-gray-100 to-[#4ADE80] bg-clip-text text-transparent"
          />
          
          <div className="pt-8">
            <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Descubra os melhores produtos de tecnologia com preços incríveis. 
              Qualidade garantida e entrega rápida para todo o Brasil.
            </p>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          onClick={scrollToProducts}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center hover:border-[#4ADE80] transition-colors duration-300"
        >
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </button>
      </div>
    </section>
  );
};
