import { Assistant } from '@/types';
import { useDeleteAssistant } from '@/hooks/useAssistants';
import { useUIStore } from '@/store/useUIStore';
import { Edit, Trash2, Bot, MessageSquare } from 'lucide-react';
import Link from 'next/link';

interface AssistantCardProps {
  assistant: Assistant;
}

export const AssistantCard = ({ assistant }: AssistantCardProps) => {
  const { mutate: deleteAssistant, isPending: isDeleting } = useDeleteAssistant();
  const openEditModal = useUIStore((state) => state.openEditModal);

  const handleDelete = () => {
    // Confirmación nativa simple y efectiva
    if (window.confirm(`¿Estás seguro de eliminar a "${assistant.name}"?`)) {
      deleteAssistant(assistant.id);
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 p-5 transition-all hover:shadow-md ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Encabezado de la tarjeta */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{assistant.name}</h3>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {assistant.tone}
            </span>
          </div>
        </div>
        {/* Badge de idioma */}
        <span className="text-xs font-medium px-2 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
          {assistant.language}
        </span>
      </div>

      <div className="h-px bg-slate-100 w-full my-3" />

      {/* Botones de Acción */}
      <div className="flex gap-2 mt-2">
        {/* Botón Editar */}
        <button 
          onClick={() => openEditModal(assistant)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
        >
          <Edit size={16} />
          Editar
        </button>

        {/* Botón Entrenar (Navegación) */}
        <Link 
          href={`/assistants/${assistant.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
        >
          <MessageSquare size={16} />
          Chat
        </Link>
        
        {/* Botón Eliminar */}
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center justify-center px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
          title="Eliminar asistente"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};