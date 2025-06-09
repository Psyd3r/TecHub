
import { supabase } from "@/integrations/supabase/client";
import { ProductModel, CreateProductData, UpdateProductData } from "@/models/ProductModel";

export class ProductService {
  static async getAllProducts(): Promise<ProductModel[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.original_price || undefined,
        description: product.description || undefined,
        image: product.image || undefined,
        category: product.category,
        brand: product.brand,
        stockQuantity: product.stock_quantity,
        inStock: product.stock_quantity > 0,
        rating: product.rating || undefined,
        createdAt: product.created_at,
        updatedAt: product.updated_at
      }));
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new Error('Erro ao carregar produtos');
    }
  }
  
  static async getProductById(id: string): Promise<ProductModel | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Product not found
        }
        throw error;
      }
      
      return {
        id: data.id,
        name: data.name,
        price: data.price,
        originalPrice: data.original_price || undefined,
        description: data.description || undefined,
        image: data.image || undefined,
        category: data.category,
        brand: data.brand,
        stockQuantity: data.stock_quantity,
        inStock: data.stock_quantity > 0,
        rating: data.rating || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      throw new Error('Erro ao carregar produto');
    }
  }
  
  static async createProduct(productData: CreateProductData): Promise<ProductModel> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          price: productData.price,
          original_price: productData.originalPrice,
          description: productData.description,
          image: productData.image,
          category: productData.category,
          brand: productData.brand,
          stock_quantity: productData.stockQuantity,
          in_stock: productData.stockQuantity > 0
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        price: data.price,
        originalPrice: data.original_price || undefined,
        description: data.description || undefined,
        image: data.image || undefined,
        category: data.category,
        brand: data.brand,
        stockQuantity: data.stock_quantity,
        inStock: data.stock_quantity > 0,
        rating: data.rating || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw new Error('Erro ao criar produto');
    }
  }
  
  static async updateProduct(productData: UpdateProductData): Promise<ProductModel> {
    try {
      const updateData: any = {};
      
      if (productData.name !== undefined) updateData.name = productData.name;
      if (productData.price !== undefined) updateData.price = productData.price;
      if (productData.originalPrice !== undefined) updateData.original_price = productData.originalPrice;
      if (productData.description !== undefined) updateData.description = productData.description;
      if (productData.image !== undefined) updateData.image = productData.image;
      if (productData.category !== undefined) updateData.category = productData.category;
      if (productData.brand !== undefined) updateData.brand = productData.brand;
      if (productData.stockQuantity !== undefined) {
        updateData.stock_quantity = productData.stockQuantity;
        updateData.in_stock = productData.stockQuantity > 0;
      }
      
      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productData.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        id: data.id,
        name: data.name,
        price: data.price,
        originalPrice: data.original_price || undefined,
        description: data.description || undefined,
        image: data.image || undefined,
        category: data.category,
        brand: data.brand,
        stockQuantity: data.stock_quantity,
        inStock: data.stock_quantity > 0,
        rating: data.rating || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw new Error('Erro ao atualizar produto');
    }
  }
  
  static async deleteProduct(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      throw new Error('Erro ao excluir produto');
    }
  }
  
  static async updateStock(id: string, newStock: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .update({ 
          stock_quantity: newStock,
          in_stock: newStock > 0
        })
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      throw new Error('Erro ao atualizar estoque');
    }
  }
}
