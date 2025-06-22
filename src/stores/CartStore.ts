
import { create } from 'zustand';
import { CartModel, CartItemModel } from '@/models/CartModel';
import { ProductModel } from '@/models/ProductModel';
import { CartController } from '@/controllers/CartController';
import { ProductController } from '@/controllers/ProductController';
import { OrderController } from '@/controllers/OrderController';

interface Product {
  id: string; // Mudança: usar string UUID em vez de number
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  inStock: boolean;
  stockQuantity: number;
  uuid?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartStoreState extends CartModel {
  loading: boolean;
  error: string | null;
  products: Product[];
  
  // Actions
  loadCart: () => void;
  loadProducts: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>; // Mudança: string em vez de number
  removeItem: (productId: string) => void; // Mudança: string em vez de number
  clearCart: () => void;
  getProductQuantity: (productId: string) => number; // Mudança: string em vez de number
  getAvailableStock: (productId: string) => number; // Mudança: string em vez de number
  getProductStock: (productId: string) => number; // Mudança: string em vez de number
  updateStock: (productId: string, newStock: number) => Promise<void>; // Mudança: string em vez de number
  processOrder: (paymentData: any, userId: string) => Promise<string>;
  clearError: () => void;
}

export const useCartStore = create<CartStoreState>((set, get) => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  error: null,
  products: [],
  
  loadCart: () => {
    try {
      const cart = CartController.getCart();
      set({ 
        items: cart.items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice
      });
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar carrinho'
      });
    }
  },

  loadProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await ProductController.getAllProducts();
      
      // Correção: usar UUID como ID principal e manter consistência
      const formattedProducts = products.map((product) => ({
        id: product.id, // Usar UUID diretamente
        uuid: product.id, // Manter compatibilidade
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image || 'photo-1581091226825-a6a2a5aee158',
        category: product.category,
        brand: product.brand,
        inStock: product.inStock,
        stockQuantity: product.stockQuantity,
      }));
      
      set({ 
        products: formattedProducts,
        loading: false
      });

      // Limpar itens do carrinho que não têm mais estoque
      const { items } = get();
      const validItems = items.filter(item => {
        const product = formattedProducts.find(p => p.id === item.id);
        return product && product.stockQuantity > 0;
      }).map(item => {
        const product = formattedProducts.find(p => p.id === item.id);
        if (product && item.quantity > product.stockQuantity) {
          return { ...item, quantity: product.stockQuantity };
        }
        return item;
      });

      if (validItems.length !== items.length) {
        // Atualizar carrinho se houve mudanças
        CartController.clearCart();
        validItems.forEach(item => {
          const product = formattedProducts.find(p => p.id === item.id);
          if (product) {
            CartController.addToCart(product as any, { 
              productId: item.id, 
              quantity: item.quantity 
            });
          }
        });
        get().loadCart();
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar produtos',
        loading: false,
        products: []
      });
    }
  },
  
  addToCart: async (product, quantity = 1) => {
    try {
      const success = CartController.addToCart(product as any, { 
        productId: product.id, 
        quantity 
      });
      
      if (success) {
        const cart = CartController.getCart();
        set({ 
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
          error: null
        });
        return true;
      } else {
        set({ error: 'Estoque insuficiente' });
        return false;
      }
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      set({ error: error instanceof Error ? error.message : 'Erro ao adicionar ao carrinho' });
      return false;
    }
  },
  
  updateQuantity: async (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return true;
    }

    const { products } = get();
    const product = products.find(p => p.id === productId);
    if (!product) return false;

    if (quantity > product.stockQuantity) {
      set({ error: 'Estoque insuficiente' });
      return false;
    }

    try {
      const success = CartController.updateCartItem(
        { productId, quantity },
        product.stockQuantity
      );
      
      if (success) {
        const cart = CartController.getCart();
        set({ 
          items: cart.items,
          totalItems: cart.totalItems,
          totalPrice: cart.totalPrice,
          error: null
        });
        return true;
      } else {
        set({ error: 'Estoque insuficiente' });
        return false;
      }
    } catch (error) {
      console.error('Erro ao atualizar carrinho:', error);
      set({ error: error instanceof Error ? error.message : 'Erro ao atualizar carrinho' });
      return false;
    }
  },
  
  removeItem: (productId) => {
    try {
      CartController.removeFromCart(productId);
      const cart = CartController.getCart();
      set({ 
        items: cart.items,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
        error: null
      });
    } catch (error) {
      console.error('Erro ao remover item:', error);
      set({ error: error instanceof Error ? error.message : 'Erro ao remover item' });
    }
  },
  
  clearCart: () => {
    try {
      CartController.clearCart();
      set({ 
        items: [],
        totalItems: 0,
        totalPrice: 0,
        error: null
      });
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      set({ error: error instanceof Error ? error.message : 'Erro ao limpar carrinho' });
    }
  },
  
  getProductQuantity: (productId) => {
    return CartController.getProductQuantityInCart(productId);
  },
  
  getAvailableStock: (productId) => {
    const { products } = get();
    const product = products.find(p => p.id === productId);
    if (!product) return 0;
    return CartController.getAvailableStock(productId, product.stockQuantity);
  },

  getProductStock: (productId) => {
    const { products } = get();
    const product = products.find(p => p.id === productId);
    return product ? product.stockQuantity : 0;
  },

  updateStock: async (productId, newStock) => {
    const { products } = get();
    const product = products.find(p => p.id === productId);
    if (!product) {
      console.error('Produto não encontrado');
      return;
    }

    try {
      await ProductController.updateStock(product.id, newStock);
      
      // Atualizar estado local
      set(state => ({
        products: state.products.map(p =>
          p.id === productId
            ? { ...p, stockQuantity: newStock, inStock: newStock > 0 }
            : p
        ),
        error: null
      }));
      
      // Atualizar itens do carrinho se necessário
      const { items } = get();
      const updatedItems = items.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.min(item.quantity, newStock);
          return { ...item, quantity: newQuantity, stockQuantity: newStock, inStock: newStock > 0 };
        }
        return item;
      }).filter(item => item.quantity > 0);

      // Recalcular carrinho
      CartController.clearCart();
      for (const item of updatedItems) {
        const product = products.find(p => p.id === item.id);
        if (product) {
          CartController.addToCart(product as any, { 
            productId: item.id, 
            quantity: item.quantity 
          });
        }
      }
      get().loadCart();
      
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      set({ error: 'Erro ao atualizar estoque' });
    }
  },

  processOrder: async (paymentData, userId) => {
    const { items, products } = get();
    
    try {
      // Mapear itens com UUID string para processamento do pedido
      const itemsForOrder = items.map(item => {
        const product = products.find(p => p.id === item.id);
        return {
          id: item.id, // Manter como string UUID
          uuid: item.id, // UUID é o mesmo que id agora
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          brand: item.brand,
          stockQuantity: item.stockQuantity
        };
      });

      const orderNumber = await OrderController.processOrder(
        userId,
        itemsForOrder,
        paymentData
      );

      // Limpar carrinho após pedido processado
      get().clearCart();
      
      return orderNumber;
    } catch (error) {
      console.error('Erro ao processar pedido:', error);
      throw error;
    }
  },
  
  clearError: () => set({ error: null })
}));
