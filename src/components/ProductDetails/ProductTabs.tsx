
import { Card, CardContent } from "@/components/ui/card";

interface ProductTabsProps {
  description?: string;
  category: string;
  brand: string;
}

export const ProductTabs = ({ description, category, brand }: ProductTabsProps) => {
  const defaultDescription = `${brand} apresenta este excelente produto da categoria ${category}. 
    Desenvolvido com tecnologia de ponta e materiais de alta qualidade, oferece performance excepcional 
    e durabilidade. Ideal para quem busca qualidade, inovação e confiabilidade em um só produto.`;

  return (
    <div className="w-full">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">Sobre o Produto</h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed text-base">
              {description || defaultDescription}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
