
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  inStock: boolean;
  stockQuantity: number;
  uuid?: string; // Adicionar UUID
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  products: Product[];
  addItem: (product: Product) => boolean;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => boolean;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getProductStock: (productId: number) => number;
  updateStock: (productId: number, newStock: number) => void;
  loadProducts: () => void;
  processOrder: (paymentData: any) => Promise<string>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useLocalStorage<CartItem[]>('cart-items', []);
  const [products, setProducts] = useState<Product[]>([]);
  const { user } = useAuth();

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedProducts = (data || []).map((product, index) => ({
        id: index + 1, // ID sequencial para compatibilidade
        uuid: product.id, // Guardar o UUID real
        name: product.name,
        price: product.price,
        originalPrice: product.original_price || undefined,
        image: product.image || 'photo-1581091226825-a6a2a5aee158',
        category: product.category,
        brand: product.brand,
        inStock: product.stock_quantity > 0,
        stockQuantity: product.stock_quantity,
      }));
      
      setProducts(formattedProducts);
      
      // Limpar itens do carrinho que não têm mais estoque
      setItems(prevItems => {
        const validItems = prevItems.filter(item => {
          const product = formattedProducts.find(p => p.id === item.id);
          if (!product || product.stockQuantity === 0) {
            console.log(`Removendo item ${item.name} do carrinho (sem estoque)`);
            return false;
          }
          return true;
        }).map(item => {
          const product = formattedProducts.find(p => p.id === item.id);
          if (product && item.quantity > product.stockQuantity) {
            console.log(`Ajustando quantidade de ${item.name} de ${item.quantity} para ${product.stockQuantity}`);
            return { ...item, quantity: product.stockQuantity };
          }
          return item;
        });
        
        return validItems;
      });
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addItem = (product: Product): boolean => {
    const existingItem = items.find(item => item.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    
    if (currentQuantity >= product.stockQuantity) {
      return false;
    }

    if (existingItem) {
      setItems(items.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setItems([...items, { ...product, quantity: 1 }]);
    }
    return true;
  };

  const removeItem = (productId: number) => {
    console.log('Removendo item com ID:', productId);
    setItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== productId);
      console.log('Items após remoção:', newItems);
      return newItems;
    });
  };

  const updateQuantity = (productId: number, quantity: number): boolean => {
    if (quantity <= 0) {
      removeItem(productId);
      return true;
    }

    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stockQuantity) {
      return false;
    }

    setItems(items.map(item =>
      item.id === productId
        ? { ...item, quantity }
        : item
    ));
    return true;
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getProductStock = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.stockQuantity : 0;
  };

  const updateStock = async (productId: number, newStock: number) => {
    try {
      // Encontrar o UUID real do produto
      const product = products.find(p => p.id === productId);
      if (!product?.uuid) {
        console.error('UUID do produto não encontrado');
        return;
      }

      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', product.uuid);
      
      if (error) throw error;
      
      // Atualizar estado local
      setProducts(products.map(p =>
        p.id === productId
          ? { ...p, stockQuantity: newStock, inStock: newStock > 0 }
          : p
      ));
      
      // Atualizar itens do carrinho se necessário
      setItems(items.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.min(item.quantity, newStock);
          return { ...item, quantity: newQuantity, stockQuantity: newStock, inStock: newStock > 0 };
        }
        return item;
      }).filter(item => item.quantity > 0));
      
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
    }
  };

  const processOrder = async (paymentData: any): Promise<string> => {
    if (!user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      // Validar estoque novamente antes de processar
      for (const item of items) {
        const product = products.find(p => p.id === item.id);
        if (!product) {
          throw new Error(`Produto "${item.name}" não encontrado`);
        }
        if (product.stockQuantity < item.quantity) {
          throw new Error(`Estoque insuficiente para "${item.name}"`);
        }
      }

      // Gerar número do pedido
      const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
      
      // Salvar pedido no banco
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            brand: item.brand
          })),
          total_amount: getTotalPrice(),
          payment_method: paymentData.paymentType,
          payment_status: 'completed' // Simulando pagamento bem-sucedido
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Reduzir estoque dos produtos
      for (const item of items) {
        const newStock = item.stockQuantity - item.quantity;
        await updateStock(item.id, newStock);
      }

      return orderNumber;
    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      throw error;
    }
  };

  const value = {
    items,
    products,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getProductStock,
    updateStock,
    loadProducts,
    processOrder
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
