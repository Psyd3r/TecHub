
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Archive } from "lucide-react";
import { StockTable } from "@/components/StockTable";
import { ProductManagement } from "@/components/ProductManagement";
import { AdminRoute } from "@/components/AdminRoute";

const ConteudoAdministracao = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-[#4ADE80]" />
              <h1 className="text-3xl font-bold text-white">Administração</h1>
            </div>
          </div>
        </div>

        {/* Tabs para diferentes seções */}
        <Tabs defaultValue="produtos" className="space-y-6">
          <TabsList className="bg-[#1B1B1B]/90 border border-white/10">
            <TabsTrigger value="produtos" className="text-white data-[state=active]:bg-[#4ADE80] data-[state=active]:text-black">
              <Package className="h-4 w-4 mr-2" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="estoque" className="text-white data-[state=active]:bg-[#4ADE80] data-[state=active]:text-black">
              <Archive className="h-4 w-4 mr-2" />
              Controle de Estoque
            </TabsTrigger>
          </TabsList>

          <TabsContent value="produtos">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="estoque">
            <Card className="bg-[#1B1B1B]/90 backdrop-blur-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-2xl flex items-center gap-2">
                  <Archive className="h-6 w-6 text-[#4ADE80]" />
                  Controle de Estoque
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StockTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Administracao = () => {
  return (
    <AdminRoute>
      <ConteudoAdministracao />
    </AdminRoute>
  );
};

export default Administracao;
