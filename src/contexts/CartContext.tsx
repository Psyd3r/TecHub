import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  processOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true);
      
      if (error) throw error;
      
      const formattedProducts = (data || []).map(product => ({
        id: parseInt(product.id),
        name: product.name,
        price: product.price,
        originalPrice: product.original_price || undefined,
        image: product.image || 'photo-1581091226825-a6a2a5aee158',
        category: product.category,
        brand: product.brand,
        inStock: product.in_stock || false,
        stockQuantity: product.stock_quantity,
      }));
      
      setProducts(formattedProducts);
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
    setItems(items.filter(item => item.id !== productId));
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
      const { error } = await supabase
        .from('products')
        .update({ stock_quantity: newStock })
        .eq('id', productId.toString());
      
      if (error) throw error;
      
      // Atualizar estado local
      setProducts(products.map(product =>
        product.id === productId
          ? { ...product, stockQuantity: newStock, inStock: newStock > 0 }
          : product
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

  const processOrder = async () => {
    // Processar pedido: reduzir estoque dos produtos
    for (const item of items) {
      const newStock = item.stockQuantity - item.quantity;
      await updateStock(item.id, newStock);
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
