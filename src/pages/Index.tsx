
import { Navbar } from "@/components/Navbar";
import { HeroSectionNew } from "@/components/HeroSectionNew";
import { ProductCatalog } from "@/components/ProductCatalog";

const Index = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <HeroSectionNew />
      <ProductCatalog />
    </div>
  );
};

export default Index;
