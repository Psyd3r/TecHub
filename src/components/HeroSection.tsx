
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextGenerateEffect } from "./TextGenerateEffect";

export const HeroSection = () => {
  const scrollToProducts = () => {
    const element = document.getElementById('produtos');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <motion.section 
      id="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative container px-4 pt-40 pb-20 min-h-screen bg-black text-foreground"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-[#0A0A0A]" />
      
      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(74, 222, 128, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(74, 222, 128, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#4ADE80]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-[#22C55E]/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="inline-block mb-4 px-4 py-1.5 rounded-full glass"
      >
        <span className="text-sm font-medium">
          <ShoppingCart className="w-4 h-4 inline-block mr-2" />
          Loja de tecnologia premium
        </span>
      </motion.div>
      
      {/* Título Principal */}
      <div className="max-w-4xl relative z-10">
        <h1 className="text-5xl md:text-7xl font-normal mb-4 tracking-tight text-left">
          <span className="text-gray-200">
            <TextGenerateEffect words="Potência para quem" />
          </span>
          <br />
          <span className="text-white font-medium">
            <TextGenerateEffect words="exige performance" />
          </span>
        </h1>
        
        {/* Subtítulo */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl text-left"
        >
          Descubra a nova era da tecnologia com produtos que combinam design elegante e desempenho excepcional.{" "}
          <span className="text-white">Qualidade garantida em cada produto.</span>
        </motion.p>
        
        {/* Botões CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 items-start"
        >
          <Button 
            size="lg" 
            className="button-gradient text-white font-semibold px-8 py-4 rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#4ADE80]/25"
            onClick={scrollToProducts}
          >
            Explorar Produtos
          </Button>
          <Button size="lg" variant="link" className="text-white">
            Ver Ofertas <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </motion.div>
    </motion.section>
  );
};
