import { z } from 'zod';

// 1. Definimos las opciones como constantes (ReadOnly)
export const LANGUAGES = ['Español', 'Inglés', 'Portugués'] as const;
export const TONES = ['Formal', 'Casual', 'Profesional', 'Amigable'] as const;

export const assistantSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  
  // Usamos las constantes limpias
  language: z.enum(LANGUAGES),
  tone: z.enum(TONES),       
  
  responseLength: z.object({
    // 'coerce' convierte el string del input HTML a número automáticamente
    short: z.coerce.number().min(0).max(100),
    medium: z.coerce.number().min(0).max(100),
    long: z.coerce.number().min(0).max(100),
  }),
  
  audioEnabled: z.boolean().default(false),
  rules: z.string().optional(),
}).refine((data) => {
  // VALIDACIÓN MATEMÁTICA: La suma DEBE ser 100
  const sum = data.responseLength.short + data.responseLength.medium + data.responseLength.long;
  return sum === 100;
}, {
  message: "La suma de los porcentajes debe ser exactamente 100%",
  path: ["responseLength.root"], // Esto marca el error en el grupo visualmente
});

export type AssistantSchemaType = z.infer<typeof assistantSchema>;