'use client';

import { useAssistants } from '@/hooks/useAssistants';
import { AssistantCard } from '@/components/assistants/AssistantCard';
import { useUIStore } from '@/store/useUIStore';
import { Plus, Loader2 } from 'lucide-react';

export default function HomePage() {
  const { data: assistants, isLoading, isError } = useAssistants();
  const openCreateModal = useUIStore((state) => state.openCreateModal);

  // 1. Estado de Carga (Skeleton UI manual)
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // 2. Estado de Error
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <div className="text-red-500 mb-2">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-slate-900">Error al cargar asistentes</h3>
        <p className="text-slate-500">No pudimos conectar con el servicio.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 text-blue-600 hover:underline"
        >
          Recargar página
        </button>
      </div>
    );
  }

  // 3. Estado Vacío (Sin datos)
  if (!assistants || assistants.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-800">Bienvenido a Funnelhot AI</h2>
        <p className="text-slate-500 mt-2 mb-8">No tienes asistentes creados todavía.</p>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
        >
          <Plus size={20} />
          Crear mi primer asistente
        </button>
      </div>
    );
  }

  // 4. Listado Principal (Éxito)
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis Asistentes</h1>
          <p className="text-slate-500 text-sm">Gestiona y entrena tus agentes de IA</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Nuevo Asistente
        </button>
      </div>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assistants.map((assistant) => (
          <AssistantCard key={assistant.id} assistant={assistant} />
        ))}
      </div>
    </div>
  );
}