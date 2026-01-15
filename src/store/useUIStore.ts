import { create } from 'zustand';
import { Assistant } from '@/types';

interface UIState {
  isModalOpen: boolean;
  step: number; // 1 o 2
  selectedAssistant: Assistant | null; // null = Creando, Objeto = Editando
  
  // Acciones
  openCreateModal: () => void;
  openEditModal: (assistant: Assistant) => void;
  closeModal: () => void;
  setStep: (step: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  step: 1,
  selectedAssistant: null,

  openCreateModal: () => set({ 
    isModalOpen: true, 
    selectedAssistant: null, 
    step: 1 
  }),

  openEditModal: (assistant) => set({ 
    isModalOpen: true, 
    selectedAssistant: assistant, 
    step: 1 
  }),

  closeModal: () => set({ 
    isModalOpen: false, 
    selectedAssistant: null, 
    step: 1 
  }),

  setStep: (step) => set({ step }),
}));