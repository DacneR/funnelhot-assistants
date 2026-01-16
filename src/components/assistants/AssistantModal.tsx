'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assistantSchema, LANGUAGES, TONES } from '@/lib/schemas';
import { useUIStore } from '@/store/useUIStore';
import { useCreateAssistant, useUpdateAssistant } from '@/hooks/useAssistants';
import { X, ChevronRight, ChevronLeft, Save, AlertCircle } from 'lucide-react';

export const AssistantModal = () => {
  const { isModalOpen, step, selectedAssistant, closeModal, setStep } = useUIStore();
  
  const createMutation = useCreateAssistant();
  const updateMutation = useUpdateAssistant();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // 1. SETUP DEL FORMULARIO
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    watch,
    formState: { errors },
  } = useForm({ // Sin genérico para evitar conflictos con Zod
    resolver: zodResolver(assistantSchema),
    defaultValues: {
      name: '',
      language: 'Español',
      tone: 'Profesional',
      responseLength: { short: 30, medium: 50, long: 20 },
      audioEnabled: false,
      rules: '',
    },
    shouldUnregister: false, 
  });

  const lengths = watch('responseLength') as { short: number; medium: number; long: number } | undefined;

  const totalPercentage = Number(lengths?.short || 0) + Number(lengths?.medium || 0) + Number(lengths?.long || 0);

  // 2. EFECTO DE CARGA DE DATOS
  useEffect(() => {
    if (isModalOpen) {
      if (selectedAssistant) {
        reset({
          name: selectedAssistant.name,
          language: selectedAssistant.language,
          tone: selectedAssistant.tone,
          responseLength: selectedAssistant.responseLength,
          audioEnabled: selectedAssistant.audioEnabled,
          rules: selectedAssistant.rules || '',
        });
      } else {
        reset({
          name: '',
          language: 'Español',
          tone: 'Profesional',
          responseLength: { short: 30, medium: 50, long: 20 },
          audioEnabled: false,
          rules: '',
        });
      }
    }
  }, [isModalOpen, selectedAssistant, reset]);

  // 3. HANDLER PASO 1: SOLO NAVEGACIÓN
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    const isValid = await trigger(['name', 'language', 'tone']); 
    if (isValid) {
      setStep(2); 
    }
  };

  // 4. HANDLER PASO 2: GUARDADO FINAL
  // FIX: Usamos 'any' aquí para callar el error de TypeScript. 
  // Zod ya validó que esto es un AssistantSchemaType válido.
  const onFinalSubmit = (data: any) => {
    const finalData = {
      ...data,
      rules: data.rules || "" 
    };

    if (selectedAssistant) {
      updateMutation.mutate({ id: selectedAssistant.id, data: finalData }, {
        onSuccess: closeModal
      });
    } else {
      createMutation.mutate(finalData, {
        onSuccess: closeModal
      });
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {selectedAssistant ? 'Editar Asistente' : 'Nuevo Asistente'}
            </h2>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-1">
              <span className={`transition-colors ${step === 1 ? 'text-blue-600 font-bold' : ''}`}>1. Datos</span>
              <ChevronRight size={12} />
              <span className={`transition-colors ${step === 2 ? 'text-blue-600 font-bold' : ''}`}>2. Configuración</span>
            </div>
          </div>
          <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* FORMULARIO PASO 1 */}
          {step === 1 && (
            <form id="step1-form" onSubmit={handleStep1Submit} className="space-y-4 animate-in slide-in-from-left-4 duration-300">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Asistente <span className="text-red-500">*</span></label>
                <input
                  {...register('name')}
                  placeholder="Ej: Ventas B2B"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all focus:border-blue-500"
                  autoFocus
                />
                {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Idioma <span className="text-red-500">*</span></label>
                  <select {...register('language')} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    {LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tono <span className="text-red-500">*</span></label>
                  <select {...register('tone')} className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    {TONES.map(tone => (
                      <option key={tone} value={tone}>{tone}</option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          )}

          {/* FORMULARIO PASO 2 */}
          {step === 2 && (
            <form id="step2-form" onSubmit={handleSubmit(onFinalSubmit)} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium text-slate-700">Longitud de Respuestas</label>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full transition-colors ${totalPercentage === 100 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    Suma: {totalPercentage}%
                  </span>
                </div>

                <div className="space-y-4">
                  {(['short', 'medium', 'long'] as const).map((type) => (
                    <div key={type} className="flex items-center gap-3">
                      <span className="w-16 text-xs font-bold uppercase text-slate-500 tracking-wider">
                        {type === 'short' ? 'Corta' : type === 'medium' ? 'Media' : 'Larga'}
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        {...register(`responseLength.${type}`)}
                        className="flex-1 accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="relative">
                        <input
                          type="number"
                          {...register(`responseLength.${type}`)}
                          className="w-16 text-center text-sm border border-slate-200 rounded-md p-1 pl-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <span className="absolute right-2 top-1.5 text-xs text-slate-400">%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {errors.responseLength?.root && (
                  <div className="mt-4 flex items-start gap-2 text-red-600 text-xs bg-red-50 p-3 rounded-lg border border-red-100">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span className="font-medium">{errors.responseLength.root.message}</span>
                  </div>
                )}
              </div>

              <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                <input 
                  type="checkbox" 
                  {...register('audioEnabled')}
                  className="w-5 h-5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 transition-all"
                />
                <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                  Habilitar respuestas de audio
                </span>
              </label>
            </form>
          )}

        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-200/50"
            >
              <ChevronLeft size={16} /> Atrás
            </button>
          ) : (
            <div />
          )}

          {step === 1 ? (
            <button
              type="submit"
              form="step1-form"
              className="bg-slate-900 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center gap-2"
            >
              Siguiente <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="submit"
              form="step2-form"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Asistente'} <Save size={16} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};