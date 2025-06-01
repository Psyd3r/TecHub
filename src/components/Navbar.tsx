
import { useState, useEffect } from "react";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { useCart } from "@/contexts/CartContext";
import { useUserRole } from "@/hooks/useUserRole";
import { AuthButton } from "./AuthButton";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();

  const cartItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const scrollToProducts = () => {
    scrollToSection('produtos');
  };

  return (
    <nav 
      className={`fixed top-3.5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 rounded-full ${
        isScrolled
          ? 'bg-[#1B1B1B]/40 backdrop-blur-xl border border-white/10 scale-95 w-[90%] max-w-4xl'
          : 'bg-[#1B1B1B] w-[95%] max-w-6xl'
      } h-14`}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
          <ShoppingCart className="h-6 w-6 text-[#4ADE80]" />
          <span className="text-xl font-bold text-white">TechHub</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <button 
            onClick={() => scrollToSection('home')}
            className="text-white/80 hover:text-white transition-colors duration-200 font-medium"
          >
            Início
          </button>
          <button 
            onClick={scrollToProducts}
            className="text-white/80 hover:text-white transition-colors duration-200 font-medium"
          >
            Produtos
          </button>
          {isAdmin && (
            <button 
              onClick={() => navigate('/admin')}
              className="text-white/80 hover:text-white transition-colors duration-200 font-medium"
            >
              Admin
            </button>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Cart */}
          <CartDrawer />
          
          {/* Auth Button */}
          <AuthButton />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 rounded-full"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[300px] bg-[#1B1B1B]/95 backdrop-blur-xl border-l border-white/10"
            >
              <div className="flex flex-col space-y-6 mt-8">
                <div className="flex items-center space-x-2 px-4">
                  <ShoppingCart className="h-6 w-6 text-[#4ADE80]" />
                  <span className="text-xl font-bold text-white">TechHub</span>
                </div>
                
                {/* Mobile Navigation Links */}
                <div className="flex flex-col space-y-4 px-4">
                  <button 
                    onClick={() => scrollToSection('home')}
                    className="text-left text-white/80 hover:text-white transition-colors duration-200 font-medium py-2"
                  >
                    Início
                  </button>
                  <button 
                    onClick={scrollToProducts}
                    className="text-left text-white/80 hover:text-white transition-colors duration-200 font-medium py-2"
                  >
                    Produtos
                  </button>
                  {isAdmin && (
                    <button 
                      onClick={() => navigate('/admin')}
                      className="text-left text-white/80 hover:text-white transition-colors duration-200 font-medium py-2"
                    >
                      Admin
                    </button>
                  )}
                  
                  {/* Mobile Cart */}
                  <div className="flex items-center justify-between text-white/80 hover:text-white transition-colors duration-200 font-medium py-2">
                    <span>Carrinho</span>
                    <div className="relative">
                      <ShoppingCart className="h-5 w-5" />
                      {cartItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-[#4ADE80] text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                          {cartItems}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="px-4 pt-4 border-t border-white/10">
                  <AuthButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
