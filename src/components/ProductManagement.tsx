
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ProductController } from "@/controllers/ProductController";
import { ProductModel } from "@/models/ProductModel";
import { ProductForm } from "./ProductForm";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const ProductManagement = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductModel | undefined>();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductController.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreateProduct = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: ProductModel) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      await ProductController.deleteProduct(productId);
      
      toast({
        title: "Produto excluído!",
        description: "O produto foi excluído com sucesso.",
      });
      
      fetchProducts();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir produto.",
        variant: "destructive",
      });
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingProduct(undefined);
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white">Carregando produtos...</div>
      </div>
    );
  }

  return (
    <Card className="bg-[#1B1B1B]/90 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-2xl flex items-center gap-2">
            <Package className="h-6 w-6 text-[#4ADE80]" />
            Gerenciar Produtos
          </CardTitle>
          <Button 
            onClick={handleCreateProduct}
            className="bg-[#4ADE80] text-black hover:bg-[#22C55E]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Nenhum produto cadastrado</h3>
            <p className="text-gray-400 mb-4">
              Comece criando seu primeiro produto para o catálogo.
            </p>
            <Button 
              onClick={handleCreateProduct}
              className="bg-[#4ADE80] text-black hover:bg-[#22C55E]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Produto
            </Button>
          </div>
        ) : (
          <div className="rounded-md border border-gray-700">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Produto</TableHead>
                  <TableHead className="text-gray-300">Categoria</TableHead>
                  <TableHead className="text-gray-300">Preço</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="border-gray-700">
                    <TableCell className="text-white">
                      <div className="flex items-center gap-3">
                        {product.image && (
                          <img
                            src={product.image.startsWith('http') ? product.image : `https://images.unsplash.com/${product.image}?w=50&h=50&fit=crop`}
                            alt={product.name}
                            className="w-10 h-10 rounded-md object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium">{product.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{product.category}</TableCell>
                    <TableCell className="text-green-400 font-medium">
                      {ProductController.formatPrice(product.price)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditProduct(product)}
                          className="text-blue-400 hover:bg-blue-400/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="bg-[#1B1B1B] border-gray-700 max-w-4xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingProduct ? "Editar Produto" : "Novo Produto"}
              </DialogTitle>
            </DialogHeader>
            <ProductForm
              product={editingProduct}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
