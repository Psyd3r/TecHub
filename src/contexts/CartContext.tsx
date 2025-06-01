
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  brand: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  inStock: boolean;
  stockQuantity: number;
}

interface CartContextType {
  items: CartItem[];
  products: Product[];
  addItem: (product: any) => boolean;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => boolean;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getProductStock: (id: number) => number;
  updateStock: (id: number, quantity: number) => void;
  processOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

// Dados mockados de produtos com estoque
const initialProducts: Product[] = [
  {
    id: 1,
    name: "MacBook Pro 16\" M3 Pro",
    price: 15999,
    originalPrice: 17999,
    image: "photo-1486312338219-ce68d2c6f44d",
    category: "Laptops",
    brand: "Apple",
    rating: 5,
    inStock: true,
    stockQuantity: 5
  },
  {
    id: 2,
    name: "Dell XPS 13 Plus",
    price: 8999,
    originalPrice: 9999,
    image: "photo-1488590528505-98d2b5aba04b",
    category: "Laptops",
    brand: "Dell",
    rating: 4,
    inStock: true,
    stockQuantity: 8
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 Ultra",
    price: 6999,
    image: "photo-1581091226825-a6a2a5aee158",
    category: "Smartphones",
    brand: "Samsung",
    rating: 5,
    inStock: false,
    stockQuantity: 0
  },
  {
    id: 4,
    name: "iPad Pro 12.9\" M2",
    price: 9999,
    originalPrice: 11999,
    image: "photo-1649972904349-6e44c42644a7",
    category: "Tablets",
    brand: "Apple",
    rating: 5,
    inStock: true,
    stockQuantity: 3
  },
  {
    id: 5,
    name: "Lenovo ThinkPad X1 Carbon",
    price: 12999,
    image: "photo-1518770660439-4636190af475",
    category: "Laptops",
    brand: "Lenovo",
    rating: 4,
    inStock: true,
    stockQuantity: 12
  },
  {
    id: 6,
    name: "HP Spectre x360",
    price: 7999,
    originalPrice: 8999,
    image: "photo-1488590528505-98d2b5aba04b",
    category: "Laptops",
    brand: "HP",
    rating: 4,
    inStock: true,
    stockQuantity: 7
  },
  {
    id: 7,
    name: "iPhone 15 Pro Max",
    price: 8999,
    image: "photo-1581091226825-a6a2a5aee158",
    category: "Smartphones",
    brand: "Apple",
    rating: 5,
    inStock: true,
    stockQuantity: 15
  },
  {
    id: 8,
    name: "Samsung Galaxy Tab S9 Ultra",
    price: 5999,
    originalPrice: 6499,
    image: "photo-1649972904349-6e44c42644a7",
    category: "Tablets",
    brand: "Samsung",
    rating: 4,
    inStock: false,
    stockQuantity: 0
  }
];

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const getProductStock = (id: number): number => {
    const product = products.find(p => p.id === id);
    return product ? product.stockQuantity : 0;
  };

  const updateStock = (id: number, newQuantity: number) => {
    setProducts(prev => prev.map(product => 
      product.id === id 
        ? { 
            ...product, 
            stockQuantity: newQuantity,
            inStock: newQuantity > 0 
          }
        : product
    ));
  };

  const addItem = (product: any): boolean => {
    const currentStock = getProductStock(product.id);
    const currentInCart = items.find(item => item.id === product.id)?.quantity || 0;
    
    if (currentStock <= currentInCart) {
      return false; // Não há estoque suficiente
    }

    setItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        brand: product.brand
      }];
    });
    return true;
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number): boolean => {
    if (quantity <= 0) {
      removeItem(id);
      return true;
    }

    const currentStock = getProductStock(id);
    if (quantity > currentStock) {
      return false; // Não há estoque suficiente
    }

    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
    return true;
  };

  const processOrder = () => {
    // Atualizar estoque baseado nos itens do carrinho
    items.forEach(item => {
      const currentStock = getProductStock(item.id);
      updateStock(item.id, currentStock - item.quantity);
    });
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

  return (
    <CartContext.Provider value={{
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
      processOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};
