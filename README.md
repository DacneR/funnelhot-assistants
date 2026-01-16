## Instrucciones para Ejecutar el proyecto 

Este proyecto utiliza **Next.js 15** (App Router) y **TypeScript**.

1.  Clonar el repositorio:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd funnelhot-assistants
    ```

2.  Instalar dependencias:
    ```bash
    npm install
    ```

3.  Ejecutar el servidor de desarrollo:
    ```bash
    npm run dev
    ```

4.  Acceder a la aplicación:
    Abre (http://localhost:3000) en tu navegador.



## Decisiones Técnicas

1. Gestión de Estado

* React Query: Para manejar la data asíncrona del CRUD simulado.
* Zustand: Para el estado visual (abrir/cerrar modales y controlar los pasos del Wizard).

2. El Reto del Formulario (Wizard)

La parte más compleja fue manejar la validación en dos pasos.

* Problema: Al usar un solo form, Zod validaba todo el esquema antes de tiempo o el "Enter" enviaba el formulario en el paso 1.
* Solución: Se implementó una arquitectura de **doble formulario**. El Paso 1 es un form aislado que solo valida y avanza; el Paso 2 es el que realmente envía la data (`onSubmit`).

3. Backend Simulado (`src/services`)

Al no tener backend real, creé un servicio en `src/services/api.ts` que:

* Mantiene los datos en memoria (persistencia por sesión).
* Incluye **datos predefinidos** (Asistente de Ventas, Soporte Técnico) para no iniciar en blanco.
* Simula delays de red y un 10% de probabilidad de fallo al eliminar para probar el manejo de errores.



## Tiempo de Dedicación

**Tiempo Total: ~7 horas**

El desarrollo se dividió en bloques enfocados por funcionalidad:

* **Arquitectura y Configuración:** ~1 hora.
* **API Mock y Gestión de Estado:** ~1.5 horas.
* **Formulario Wizard (Lógica compleja y validaciones):** ~2.5 horas.
* **Módulo de Chat y Entrenamiento:** ~1.5 horas.
* **Refinamiento final:** ~0.5 horas.
