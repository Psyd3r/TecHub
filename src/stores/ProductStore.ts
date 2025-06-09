
import { create } from 'zustand';
import { ProductModel, ProductFilters } from '@/models/ProductModel';
import { ProductController } from '@/controllers/ProductController';

interface ProductStoreState {
  products: ProductModel[];
  filteredProducts: ProductModel[];
  filters: ProductFilters;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadProducts: () => Promise<void>;
  setFilters: (filters: Partial<ProductFilters>) => void;
  addProduct: (product: ProductModel) => void;
  updateProduct: (product: ProductModel) => void;
  removeProduct: (id: string) => void;
  clearError: () => void;
}

export const useProductStore = create<ProductStoreState>((set, get) => ({
  products: [],
  filteredProducts: [],
  filters: {
    searchTerm: '',
    category: 'Todos',
    priceRange: [0, 20000],
    sortBy: 'relevance',
    showInStock: false
  },
  loading: false,
  error: null,
  
  loadProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await ProductController.getAllProducts();
      const { filters } = get();
      const filteredProducts = ProductController.filterProducts(products, filters);
      
      set({ 
        products, 
        filteredProducts,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Erro ao carregar produtos',
        loading: false 
      });
    }
  },
  
  setFilters: (newFilters) => {
    const { products } = get();
    const updatedFilters = { ...get().filters, ...newFilters };
    const filteredProducts = ProductController.filterProducts(products, updatedFilters);
    
    set({ 
      filters: updatedFilters,
      filteredProducts 
    });
  },
  
  addProduct: (product) => {
    const { products, filters } = get();
    const updatedProducts = [...products, product];
    const filteredProducts = ProductController.filterProducts(updatedProducts, filters);
    
    set({ 
      products: updatedProducts,
      filteredProducts 
    });
  },
  
  updateProduct: (updatedProduct) => {
    const { products, filters } = get();
    const updatedProducts = products.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    );
    const filteredProducts = ProductController.filterProducts(updatedProducts, filters);
    
    set({ 
      products: updatedProducts,
      filteredProducts 
    });
  },
  
  removeProduct: (id) => {
    const { products, filters } = get();
    const updatedProducts = products.filter(p => p.id !== id);
    const filteredProducts = ProductController.filterProducts(updatedProducts, filters);
    
    set({ 
      products: updatedProducts,
      filteredProducts 
    });
  },
  
  clearError: () => set({ error: null })
}));
