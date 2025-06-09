
import { Cpu, HardDrive, MemoryStick, Monitor, Mouse, Keyboard, Headphones, Zap, Box, Fan } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  icon: any;
  description: string;
}

export const PRODUCT_CATEGORIES: Category[] = [
  {
    id: "todos",
    name: "Todos",
    icon: Box,
    description: "Todas as categorias de produtos"
  },
  {
    id: "processadores",
    name: "Processadores",
    icon: Cpu,
    description: "CPUs Intel e AMD"
  },
  {
    id: "placas-video",
    name: "Placas de Vídeo",
    icon: Monitor,
    description: "GPUs NVIDIA e AMD"
  },
  {
    id: "placas-mae",
    name: "Placas-Mãe",
    icon: Cpu,
    description: "Motherboards para Intel e AMD"
  },
  {
    id: "memoria-ram",
    name: "Memória RAM",
    icon: MemoryStick,
    description: "Módulos DDR4 e DDR5"
  },
  {
    id: "armazenamento",
    name: "Armazenamento",
    icon: HardDrive,
    description: "SSDs, HDDs e NVMe"
  },
  {
    id: "fontes",
    name: "Fontes",
    icon: Zap,
    description: "Fontes modulares e não modulares"
  },
  {
    id: "gabinetes",
    name: "Gabinetes",
    icon: Box,
    description: "Cases ATX, micro-ATX e mini-ITX"
  },
  {
    id: "coolers",
    name: "Coolers",
    icon: Fan,
    description: "Coolers para CPU e gabinete"
  },
  {
    id: "perifericos",
    name: "Periféricos",
    icon: Mouse,
    description: "Teclados, mouses e headsets"
  }
];

// Helper functions
export const getCategoryById = (id: string): Category | undefined => {
  return PRODUCT_CATEGORIES.find(category => category.id === id);
};

export const getCategoryNames = (): string[] => {
  return PRODUCT_CATEGORIES.map(category => category.name);
};

export const getCategoryNamesExceptAll = (): string[] => {
  return PRODUCT_CATEGORIES.filter(category => category.id !== "todos").map(category => category.name);
};
