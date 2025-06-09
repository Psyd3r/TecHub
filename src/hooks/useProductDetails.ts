
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ProductData {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image?: string;
  category: string;
  brand: string;
  stock_quantity: number;
  description?: string;
  rating?: number;
}

export const useProductDetails = (id: string | undefined) => {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        console.log('Buscando produto com ID:', id);
        
        // Buscar diretamente pelo UUID
        let { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
        // Fallback: buscar por índice se não encontrar por UUID
        if (!data && !error) {
          console.log('Produto não encontrado por UUID, tentando buscar por índice...');
          const { data: allProducts, error: allError } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (allError) throw allError;
          
          const productIndex = parseInt(id) - 1;
          if (allProducts && productIndex >= 0 && productIndex < allProducts.length) {
            data = allProducts[productIndex];
          }
        }
        
        if (error) throw error;
        
        if (data) {
          setProduct(data);
        } else {
          console.log('Produto não encontrado');
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os detalhes do produto.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, toast]);

  return { product, loading };
};
