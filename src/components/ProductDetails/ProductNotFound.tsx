
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ProductNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Produto não encontrado</h1>
        <p className="text-gray-400">O produto que você procura não existe ou foi removido.</p>
        <Button 
          onClick={() => navigate('/')} 
          className="bg-[#4ADE80] text-black hover:bg-[#22C55E]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar ao Catálogo
        </Button>
      </div>
    </div>
  );
};
