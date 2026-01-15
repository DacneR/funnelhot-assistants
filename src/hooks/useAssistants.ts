import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Assistant, AssistantFormData } from '@/types';
import { toast } from 'sonner';

// Hook para leer datos (GET)
export const useAssistants = () => {
  return useQuery({
    queryKey: ['assistants'],
    queryFn: api.getAssistants,
  });
};

// Hook para crear (POST)
export const useCreateAssistant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: api.createAssistant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
      toast.success('Asistente creado exitosamente');
    },
    onError: () => toast.error('Error al crear el asistente'),
  });
};

// Hook para editar (PUT)
export const useUpdateAssistant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssistantFormData }) => 
      api.updateAssistant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
      toast.success('Asistente actualizado');
    },
    onError: () => toast.error('Error al actualizar'),
  });
};

// Hook para eliminar (DELETE) - Sin Optimistic Update complejo para mantenerlo simple y sólido
export const useDeleteAssistant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteAssistant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistants'] });
      toast.success('Asistente eliminado');
    },
    onError: (error) => {
      // Aquí atrapamos el error del 10% simulado
      toast.error(error.message || 'No se pudo eliminar el asistente');
    },
  });
};