import { Assistant, AssistantFormData } from '@/types';

// 1. Datos base quemados
let assistants: Assistant[] = [
  {
    id: '1',
    name: 'Asistente de Ventas',
    language: 'Español',
    tone: 'Profesional',
    responseLength: { short: 30, medium: 50, long: 20 },
    audioEnabled: true,
    rules: 'Eres un experto en ventas B2B. Sé cordial y persuasivo.',
  },
  {
    id: '2',
    name: 'Soporte Técnico',
    language: 'Inglés',
    tone: 'Amigable',
    responseLength: { short: 20, medium: 30, long: 50 },
    audioEnabled: false,
    rules: 'Ayuda paso a paso a resolver problemas técnicos.',
  },
];

// Simulamos un delay de red (entre 200ms y 500ms)
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // GET: Listar
  getAssistants: async (): Promise<Assistant[]> => {
    await delay();
    return [...assistants]; // Retornamos una copia para evitar mutaciones directas
  },

  // POST: Crear
  createAssistant: async (data: AssistantFormData): Promise<Assistant> => {
    await delay();
    const newAssistant: Assistant = {
      ...data,
      id: crypto.randomUUID(), // Generamos ID único
    };
    assistants.push(newAssistant);
    return newAssistant;
  },

  // PUT: Editar
  updateAssistant: async (id: string, data: AssistantFormData): Promise<Assistant> => {
    await delay();
    const index = assistants.findIndex((a) => a.id === id);
    
    if (index === -1) throw new Error('Asistente no encontrado');
    
    const updatedAssistant = { ...assistants[index], ...data };
    assistants[index] = updatedAssistant;
    return updatedAssistant;
  },

  // DELETE: Eliminar (Con el 10% de error simulado que pide la prueba)
  deleteAssistant: async (id: string): Promise<void> => {
    await delay(300); // Un poco menos de delay para que se sienta ágil
    
    // Simulación de error aleatorio (10% probabilidad)
    if (Math.random() < 0.1) {
      throw new Error('Error de conexión al eliminar (Simulado)');
    }

    const index = assistants.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Asistente no encontrado');
    
    assistants = assistants.filter((a) => a.id !== id);
  },
};