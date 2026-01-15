'use client';

import { useState, useEffect, useRef, use } from 'react'; // <--- IMPORTANTE: 'use'
import { useRouter } from 'next/navigation';
import { useAssistant } from '@/hooks/useAssistants';
import { useUpdateAssistant } from '@/hooks/useAssistants';
import { ArrowLeft, Send, Save, Bot, User, Sparkles, MoreVertical } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// En Next.js 15+, params es una Promise. Definimos el tipo así:
export default function AssistantPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // 1. DESEMPAQUETAMOS EL ID (El error de consola se va con esto)
  const { id: assistantId } = use(params);
  
  // 2. Usamos el Hook mejorado (ahora nos da isLoading)
  const { assistant, isLoading } = useAssistant(assistantId);
  const updateMutation = useUpdateAssistant();

  // 3. Estado del Chat
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: '¡Hola! Soy tu asistente IA. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 4. Estado del Entrenamiento (Reglas)
  const [rules, setRules] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Cargar reglas cuando llega el asistente
  useEffect(() => {
    if (assistant) {
      setRules(assistant.rules || '');
    }
  }, [assistant]);

  // Scroll automático al chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- LÓGICA DEL CHAT SIMULADO---
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    // Agregamos mensaje del usuario
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      
      // Estas respuestas son lo suficientemente genéricas para encajar en casi cualquier demo
      const respuestasProfesionales = [
        "Comprendido. Basado en los parámetros configurados, he procesado su solicitud. ¿Desea que profundice en algún punto específico?",
        "Entendido. He analizado la información proporcionada. Aquí tiene un resumen preliminar de acuerdo a las instrucciones del sistema.",
        "Gracias por su consulta. Siguiendo las directrices de tono y estilo establecidas, sugiero el siguiente enfoque para resolver el problema planteado.",
        "He registrado esa instrucción. Procederé a generar la respuesta solicitada manteniendo el formato formal requerido.",
        "Perfecto. Estoy consultando mi base de conocimiento para ofrecerle la respuesta más precisa posible dentro del contexto definido.",
        "De acuerdo. He adaptado mi respuesta para cumplir con los criterios de longitud y tono que ha especificado en el panel de entrenamiento."
      ];

      // Elegimos una al azar para dar variedad
      const respuestaRandom = respuestasProfesionales[Math.floor(Math.random() * respuestasProfesionales.length)];
      
      // Construimos la respuesta final simulada
      const botResponse: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: respuestaRandom
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500); // 1.5s de delay para realismo
  };

  // --- LÓGICA DE GUARDADO DE REGLAS ---
  const handleSaveRules = () => {
    if (!assistant) return;
    
    updateMutation.mutate({
      id: assistant.id,
      data: { ...assistant, rules: rules }
    }, {
      onSuccess: () => {
        setIsDirty(false);
      }
    });
  };

  // --- MANEJO DE ESTADOS DE CARGA ---
  
  // Caso 1: Cargando datos del servidor
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center animate-pulse">
          <div className="h-4 w-32 bg-slate-200 rounded mb-2 mx-auto"></div>
          <p className="text-slate-400 text-sm">Cargando asistente...</p>
        </div>
      </div>
    );
  }

  // Caso 2: Ya cargó, pero no encontró el ID (404)
  if (!assistant) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800">Asistente no encontrado</h2>
          <button onClick={() => router.back()} className="text-blue-600 hover:underline mt-2">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Caso 3: Éxito (Renderizamos la UI)
  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* HEADER */}
      <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/')} // Mejor push al home por si refrescó
            className="p-2 hover:bg-slate-50 rounded-full text-slate-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-slate-800 flex items-center gap-2">
              {assistant.name}
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] uppercase font-bold rounded-full tracking-wider">
                Activo
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              {assistant.language} • {assistant.tone}
            </p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        <div className="w-1/3 border-r border-slate-100 bg-slate-50/50 flex flex-col min-w-[320px]">
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
              <Sparkles size={18} className="text-purple-600" />
              <h2>Entrenamiento</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Instrucciones del Sistema (System Prompt)
                </label>
                <textarea
                  value={rules}
                  onChange={(e) => {
                    setRules(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder="Ej: Eres un experto en ventas. Responde siempre de forma corta y persuasiva..."
                  className="w-full h-64 p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none bg-slate-50 focus:bg-white transition-all"
                />
                <p className="text-xs text-slate-400 mt-2 text-right">
                  {rules.length} caracteres
                </p>
              </div>

              {/* Stats Rápidos */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                  <span className="block text-xs text-slate-400 uppercase font-bold">Corta</span>
                  <span className="font-semibold text-slate-700">{assistant?.responseLength?.short || 0}%</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                  <span className="block text-xs text-slate-400 uppercase font-bold">Media</span>
                  <span className="font-semibold text-slate-700">{assistant?.responseLength?.medium || 0}%</span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-center">
                  <span className="block text-xs text-slate-400 uppercase font-bold">Larga</span>
                  <span className="font-semibold text-slate-700">{assistant?.responseLength?.long || 0}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Columna Izquierda */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <button
              onClick={handleSaveRules}
              disabled={!isDirty || updateMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm shadow-lg shadow-slate-200"
            >
              {updateMutation.isPending ? 'Guardando...' : isDirty ? 'Guardar Cambios' : 'Todo Guardado'}
              {!updateMutation.isPending && <Save size={16} />}
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA: CHAT PREVIEW */}
        <div className="flex-1 flex flex-col bg-white relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent z-10 opacity-50" />
          
          {/* Área de Mensajes */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[url('https://www.transparenttextures.com/patterns/subtle-light-aluminum.png')]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                    <Bot size={16} />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {/* Indicador de "Escribiendo..." */}
            {isTyping && (
              <div className="flex gap-3 justify-start animate-in fade-in duration-300">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white shrink-0 opacity-50">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-none px-4 py-4 shadow-sm flex items-center gap-1">
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form 
              onSubmit={handleSendMessage}
              className="flex gap-2 items-center bg-slate-50 border border-slate-200 rounded-xl p-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe un mensaje de prueba..."
                className="flex-1 bg-transparent px-3 py-2 outline-none text-sm text-slate-700 placeholder:text-slate-400"
                autoFocus
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <Send size={18} />
              </button>
            </form>
            <p className="text-center text-[10px] text-slate-400 mt-2">
              Este es un entorno de prueba. Las respuestas son simuladas.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}