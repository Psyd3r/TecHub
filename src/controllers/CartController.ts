
import { CartModel, CartItemModel, AddToCartData, UpdateCartItemData, CartModelValidator } from "@/models/CartModel";
import { ProductModel } from "@/models/ProductModel";
import { LocalStorageService } from "@/services/LocalStorageService";

const CART_STORAGE_KEY = 'shopping_cart';

export class CartController {
  static getCart(): CartModel {
    try {
      const items = LocalStorageService.getItem<CartItemModel[]>(CART_STORAGE_KEY) || [];
      return this.calculateCartTotals(items);
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
      return { items: [], totalItems: 0, totalPrice: 0 };
    }
  }
  
  static addToCart(product: ProductModel, data: AddToCartData): boolean {
    // Validar dados
    const validationErrors = CartModelValidator.validateAddToCart(data);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }
    
    // Verificar disponibilidade de estoque
    if (!CartModelValidator.validateStockAvailability(data.quantity, product.stockQuantity)) {
      return false; // Estoque insuficiente
    }
    
    try {
      const currentCart = this.getCart();
      const existingItemIndex = currentCart.items.findIndex(item => item.id === data.productId);
      
      if (existingItemIndex >= 0) {
        // Item já existe no carrinho - atualizar quantidade
        const existingItem = currentCart.items[existingItemIndex];
        const newQuantity = existingItem.quantity + data.quantity;
        
        if (!CartModelValidator.validateStockAvailability(newQuantity, product.stockQuantity)) {
          return false; // Estoque insuficiente para a nova quantidade
        }
        
        currentCart.items[existingItemIndex].quantity = newQuantity;
      } else {
        // Novo item no carrinho
        const newItem: CartItemModel = {
          id: data.productId, // Usar string UUID
          name: product.name,
          price: product.price,
          image: product.image || '',
          brand: product.brand,
          category: product.category,
          quantity: data.quantity,
          stockQuantity: product.stockQuantity,
          inStock: product.stockQuantity > 0
        };
        
        currentCart.items.push(newItem);
      }
      
      this.saveCart(currentCart.items);
      return true;
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      throw new Error('Erro ao adicionar produto ao carrinho');
    }
  }
  
  static updateCartItem(data: UpdateCartItemData, availableStock: number): boolean {
    // Validar dados
    const validationErrors = CartModelValidator.validateUpdateCartItem(data);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors.join(', '));
    }
    
    // Se quantidade é 0, remover item
    if (data.quantity === 0) {
      return this.removeFromCart(data.productId);
    }
    
    // Verificar disponibilidade de estoque
    if (!CartModelValidator.validateStockAvailability(data.quantity, availableStock)) {
      return false; // Estoque insuficiente
    }
    
    try {
      const currentCart = this.getCart();
      const itemIndex = currentCart.items.findIndex(item => item.id === data.productId);
      
      if (itemIndex >= 0) {
        currentCart.items[itemIndex].quantity = data.quantity;
        currentCart.items[itemIndex].stockQuantity = availableStock;
        currentCart.items[itemIndex].inStock = availableStock > 0;
        this.saveCart(currentCart.items);
        return true;
      }
      
      return false; // Item não encontrado
    } catch (error) {
      console.error('Erro ao atualizar item do carrinho:', error);
      throw new Error('Erro ao atualizar carrinho');
    }
  }
  
  static removeFromCart(productId: string): boolean { // Mudança: string em vez de number
    try {
      const currentCart = this.getCart();
      const filteredItems = currentCart.items.filter(item => item.id !== productId);
      this.saveCart(filteredItems);
      return true;
    } catch (error) {
      console.error('Erro ao remover do carrinho:', error);
      throw new Error('Erro ao remover produto do carrinho');
    }
  }
  
  static clearCart(): void {
    try {
      LocalStorageService.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar carrinho:', error);
      throw new Error('Erro ao limpar carrinho');
    }
  }
  
  static getProductQuantityInCart(productId: string): number { // Mudança: string em vez de number
    const cart = this.getCart();
    const item = cart.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }
  
  static getAvailableStock(productId: string, totalStock: number): number { // Mudança: string em vez de number
    const quantityInCart = this.getProductQuantityInCart(productId);
    return totalStock - quantityInCart;
  }
  
  static formatCartTotal(totalPrice: number): string {
    return `R$ ${totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }
  
  private static calculateCartTotals(items: CartItemModel[]): CartModel {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return {
      items,
      totalItems,
      totalPrice
    };
  }
  
  private static saveCart(items: CartItemModel[]): void {
    LocalStorageService.setItem(CART_STORAGE_KEY, items);
  }
}
