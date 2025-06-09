
import { useState, useEffect, memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Settings } from "lucide-react";
import { PiDetectiveBold } from "react-icons/pi";
import { useCartStore } from "@/stores/CartStore";
import { useAuthStore } from "@/stores/AuthStore";
import { useUserRole } from "@/hooks/useUserRole";
import { CartDrawer } from "./CartDrawer";
import { AuthButton } from "./AuthButton";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = memo(() => {
  const { totalItems } = useCartStore();
  const { user } = useAuthStore();
  const { isAdmin } = useUserRole();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAnimatingHome, setIsAnimatingHome] = useState(false);
  const navigate = useNavigate();

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { href: "/", label: "Início" },
    { href: "/#produtos", label: "Produtos" },
  ];

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, []);

  const handleNavClick = useCallback((href: string, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (href === "/") {
      // Animação especial para navegação ao início
      setIsAnimatingHome(true);
      scrollToTop();
      
      // Remove a animação após 600ms
      setTimeout(() => {
        setIsAnimatingHome(false);
      }, 600);
    } else if (href.startsWith("/#")) {
      // Handle anchor links
      const element = document.querySelector(href.substring(1));
      if (element) {
        const navbarHeight = 80; // Account for navbar height
        const elementPosition = (element as HTMLElement).offsetTop - navbarHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth"
        });
      }
    } else {
      // Handle regular navigation
      navigate(href);
    }
    
    // Close mobile menu
    setIsMobileMenuOpen(false);
  }, [navigate, scrollToTop]);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsAnimatingHome(true);
    scrollToTop();
    
    // Remove a animação após 600ms
    setTimeout(() => {
      setIsAnimatingHome(false);
    }, 600);
    
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  }, [scrollToTop]);

  const handleAdminClick = useCallback(() => {
    navigate("/admin");
    setIsMobileMenuOpen(false);
  }, [navigate]);

  return (
    <>
      <nav 
        className={`fixed top-3.5 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 rounded-full ${
          isScrolled
            ? "w-[90%] max-w-4xl bg-background/80 backdrop-blur-xl border border-white/10 scale-95"
            : "w-[95%] max-w-6xl bg-transparent scale-100"
        }`}
      >
        <div className="px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo com PiDetectiveBold */}
            <button 
              onClick={handleLogoClick}
              className={`flex items-center space-x-2 flex-shrink-0 transition-all duration-300 ${
                isAnimatingHome ? 'animate-bounce scale-110' : 'hover:scale-105'
              }`}
            >
              <div className={`w-8 h-8 bg-gradient-to-r from-[#4ADE80] to-[#22C55E] rounded-lg flex items-center justify-center transition-all duration-300 ${
                isAnimatingHome ? 'animate-pulse shadow-lg shadow-[#4ADE80]/50' : ''
              }`}>
                <PiDetectiveBold className="h-5 w-5 text-black" />
              </div>
              <span className={`text-white font-bold text-xl transition-all duration-300 ${
                isAnimatingHome ? 'text-[#4ADE80] animate-pulse' : ''
              }`}>
                TechHub
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(link.href, e)}
                  className={`text-muted-foreground hover:text-foreground transition-all duration-300 text-sm font-medium cursor-pointer ${
                    link.href === "/" && isAnimatingHome ? 'text-[#4ADE80] animate-pulse scale-110' : ''
                  } ${link.href === "/" ? 'hover:text-[#4ADE80] hover:scale-105' : ''}`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Admin shortcut */}
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAdminClick}
                  className="text-white hover:bg-white/10"
                  title="Painel Administrativo"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
              <CartDrawer />
              <AuthButton />
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center space-x-2">
              <CartDrawer />
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/10 p-2"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-[300px] bg-background border-border"
                >
                  <div className="flex flex-col space-y-6 mt-8">
                    {/* Mobile Logo */}
                    <button 
                      onClick={handleLogoClick}
                      className={`flex items-center space-x-2 px-2 transition-all duration-300 ${
                        isAnimatingHome ? 'animate-bounce scale-110' : 'hover:scale-105'
                      }`}
                    >
                      <div className={`w-8 h-8 bg-gradient-to-r from-[#4ADE80] to-[#22C55E] rounded-lg flex items-center justify-center transition-all duration-300 ${
                        isAnimatingHome ? 'animate-pulse shadow-lg shadow-[#4ADE80]/50' : ''
                      }`}>
                        <PiDetectiveBold className="h-5 w-5 text-black" />
                      </div>
                      <span className={`text-foreground font-bold text-xl transition-all duration-300 ${
                        isAnimatingHome ? 'text-[#4ADE80] animate-pulse' : ''
                      }`}>
                        TechHub
                      </span>
                    </button>

                    {/* Mobile Navigation Links */}
                    <div className="flex flex-col space-y-4">
                      {navLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={(e) => handleNavClick(link.href, e)}
                          className={`text-foreground hover:text-[#4ADE80] transition-all duration-300 text-lg font-medium px-2 py-2 cursor-pointer ${
                            link.href === "/" && isAnimatingHome ? 'text-[#4ADE80] animate-pulse scale-105' : ''
                          } ${link.href === "/" ? 'hover:scale-105' : ''}`}
                        >
                          {link.label}
                        </a>
                      ))}
                      
                      {/* Admin shortcut mobile */}
                      {isAdmin && (
                        <button
                          onClick={handleAdminClick}
                          className="text-foreground hover:text-[#4ADE80] transition-colors duration-200 text-lg font-medium px-2 py-2 flex items-center gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          Painel Admin
                        </button>
                      )}
                    </div>

                    {/* Mobile Auth */}
                    <div className="px-2 pt-4 border-t border-border">
                      <AuthButton />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-20" />
    </>
  );
});

Navbar.displayName = 'Navbar';

export { Navbar };
