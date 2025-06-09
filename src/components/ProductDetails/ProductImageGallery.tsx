
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  isOutOfStock: boolean;
}

export const ProductImageGallery = ({ images, productName, isOutOfStock }: ProductImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="relative overflow-hidden bg-gray-900/50 border-gray-800">
        <div className="relative aspect-square lg:aspect-[4/3]">
          <img 
            src={images[currentImageIndex]?.startsWith('http') 
              ? images[currentImageIndex] 
              : `https://images.unsplash.com/${images[currentImageIndex] || 'photo-1581091226825-a6a2a5aee158'}?w=600&h=600&fit=crop`
            }
            alt={productName}
            className="w-full h-full object-cover"
          />

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <span className="text-white font-semibold text-lg">Fora de Estoque</span>
                <p className="text-gray-300 text-sm mt-1">Produto indisponível</p>
              </div>
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </Card>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                currentImageIndex === index 
                  ? 'border-[#4ADE80] ring-2 ring-[#4ADE80]/50' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <img 
                src={image?.startsWith('http') 
                  ? image 
                  : `https://images.unsplash.com/${image}?w=100&h=100&fit=crop`
                }
                alt={`${productName} - imagem ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
