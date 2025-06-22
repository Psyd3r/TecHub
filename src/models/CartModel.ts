
export interface CartItemModel {
  id: string; // Mudança: string em vez de number
  name: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  quantity: number;
  stockQuantity: number;
  inStock: boolean;
}

export interface CartModel {
  items: CartItemModel[];
  totalItems: number;
  totalPrice: number;
}

export interface AddToCartData {
  productId: string; // Mudança: string em vez de number
  quantity: number;
}

export interface UpdateCartItemData {
  productId: string; // Mudança: string em vez de number
  quantity: number;
}

export class CartModelValidator {
  static validateAddToCart(data: AddToCartData): string[] {
    const errors: string[] = [];
    
    if (!data.productId || data.productId.trim().length === 0) {
      errors.push("ID do produto inválido");
    }
    
    if (!data.quantity || data.quantity <= 0) {
      errors.push("Quantidade deve ser maior que zero");
    }
    
    return errors;
  }
  
  static validateUpdateCartItem(data: UpdateCartItemData): string[] {
    const errors: string[] = [];
    
    if (!data.productId || data.productId.trim().length === 0) {
      errors.push("ID do produto inválido");
    }
    
    if (data.quantity < 0) {
      errors.push("Quantidade não pode ser negativa");
    }
    
    return errors;
  }
  
  static validateStockAvailability(requestedQuantity: number, availableStock: number): boolean {
    return requestedQuantity <= availableStock;
  }
}
