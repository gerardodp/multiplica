# Plan de Desarrollo: Aplicación "Multiplica-Rápido"

## 1. Visión General

Crear una aplicación web simple y visualmente atractiva para ayudar a los niños a practicar las tablas de multiplicar. La aplicación contará con un sistema de tiempo, puntuación, y permitirá la personalización y selección de las tablas a practicar.

## 2. Propuesta Tecnológica

- **Framework**: Next.js (con React y TypeScript).
- **Estilos**: Tailwind CSS.
- **Gestión de Estado**: Hooks de React (`useState`, `useContext`, `useReducer`).
- **Persistencia de Datos**: `localStorage` del navegador para todos los datos de configuración y progreso.

## 3. Almacenamiento Local (`localStorage`)

Los siguientes datos se guardarán en el navegador del usuario para una experiencia persistente:
- **Nombre del Niño**: Para personalizar la experiencia.
- **Configuración de Partida**: Últimas tablas y tiempo seleccionados.
- **Puntuación Más Alta (Récord)**: Para seguimiento del progreso.

## 4. Estructura y Componentes

### `PantallaDeConfiguracion`
- **Input de Nombre**: Campo para que el usuario introduzca su nombre.
- **Selector de Tablas**: Cuadrícula de botones (1-12) para activar/desactivar tablas.
- **Selector de Tiempo**: Botones para elegir la duración (30s, 60s, 90s).
- **Botón "¡A Jugar!"**: Inicia la partida.

### `PantallaDeJuego`
- **Mensaje de Bienvenida**: Saludo personalizado (ej: "¡Vamos, [Nombre]!").
- **Pregunta**: Muestra la multiplicación actual.
- **Campo de Respuesta**: Input para el resultado.
- **Temporizador**: Barra o contador de tiempo.
- **Puntuación Actual**: Marcador de puntos.
- **Feedback Visual**: Efectos de color para respuestas correctas/incorrectas.

### `PantallaDeResultados`
- **Mensaje de Felicitación**: "¡Buen trabajo, [Nombre]!".
- **Puntuación Final**: Resultado de la partida.
- **Puntuación Más Alta**: Comparación con el récord guardado.
- **Botón "Jugar de Nuevo"**: Vuelve a la pantalla de configuración.

## 5. Plan de Implementación por Fases

### Fase 1: Configuración del Proyecto
1. Crear el directorio `plan/`.
2. Guardar este documento como `plan/README.md`.
3. Inicializar un proyecto de Next.js con TypeScript.
4. Instalar y configurar Tailwind CSS.
5. Crear la estructura de carpetas para los componentes.

### Fase 2: Desarrollo de la Interfaz (UI)
1. Implementar el componente `PantallaDeConfiguracion` con todos sus controles (nombre, tablas, tiempo).
2. Implementar el componente `PantallaDeJuego` con su layout estático.
3. Implementar el componente `PantallaDeResultados` con su layout estático.

### Fase 3: Implementación de la Lógica y Estado
1. Desarrollar un "hook" personalizado (`useGameSettings`) para leer y escribir el nombre, la configuración y el récord en `localStorage`.
2. Gestionar el estado global de la aplicación (vista actual, datos del juego).
3. Implementar la lógica del juego: generación de preguntas, validación de respuestas, actualización de puntuación.
4. Implementar la funcionalidad del temporizador.

### Fase 4: Pulido y Acabado Final
1. Integrar la personalización del nombre en las pantallas de juego y resultados.
2. Añadir animaciones y transiciones CSS para una experiencia fluida.
3. Asegurar la responsividad completa del diseño (móvil, tablet, escritorio).
4. Realizar pruebas exhaustivas del flujo completo.
