
import { useState, useEffect } from "react";
import { Command, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { name: "Features", href: "#features", onClick: () => scrollToSection('features') },
  { name: "Prices", href: "#pricing", onClick: () => scrollToSection('pricing') },
  { name: "Testimonials", href: "#testimonials", onClick: () => scrollToSection('testimonials') },
];

const scrollToSection = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    const navbarHeight = 80; // Account for fixed navbar height
    const elementPosition = element.offsetTop - navbarHeight;
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, onClick: () => void) => {
    e.preventDefault();
    onClick();
    setIsMobileMenuOpen(false);
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
        <div className="flex items-center space-x-2">
          <Command className="h-6 w-6 text-[#4ADE80]" />
          <span className="text-xl font-bold text-white">TechHub</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.onClick)}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <Button className="button-gradient text-white font-medium px-6 py-2 rounded-full hover:scale-105 transition-transform duration-200">
            Get Started
          </Button>
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
                  <Command className="h-6 w-6 text-[#4ADE80]" />
                  <span className="text-xl font-bold text-white">TechHub</span>
                </div>
                
                <div className="flex flex-col space-y-4 px-4">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.onClick)}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium text-lg py-2"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                
                <div className="px-4 pt-4">
                  <Button className="button-gradient text-white font-medium w-full py-3 rounded-full hover:scale-105 transition-transform duration-200">
                    Get Started
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
