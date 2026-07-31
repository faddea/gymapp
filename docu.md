# App Entrenamiento

## Tech Stack

- **Framework:** SvelteKit
- **Styling:** Tailwind CSS (config con colores glass, overlay, tipografía Montserrat — ver `index.html` como referencia de diseño)
- **Icons:** Lucide
- **Mobile:** Capacitor (Android)
- **Persistence:** localStorage

## Pantallas (Bottom Nav)

| Icono | Ruta | Nombre | Descripción |
|-------|------|--------|-------------|
| home | `/` | Inicio | Widget del día, imagen motivacional. Si hay entrenamiento asignado al día actual, muestra card para empezar. Si no, mensaje "Hoy no tienes que entrenar". |
| calendar | `/agenda` | Agenda | CRUD de días de rutina y ejercicios. Botón "+" crea un día (ej: Push Day). Cada día expande sus ejercicios. CRUD por ejercicio. |
| trending-up | `/progreso` | Progreso | Cards de los días de rutina. Al entrar a un día, lista de ejercicios con peso anterior y peso objetivo. Se puede registrar nuevo peso. |
| calendar-days | `/calendario` | Calendario | Vista semanal con los días asignados a cada rutina (Lunes = Push, Miércoles = Back, etc.). |
| user | `/perfil` | Perfil | Configuración, cambio de tema claro/oscuro. |

## Flujo de Workout (Anti-salteo)

Secuencia guiada al tocar "Entrenar" en la Home:

1. **Splash del ejercicio** — Título del ejercicio arriba, imagen cuadrada motivacional al centro, peso anterior y peso objetivo abajo (en chico), botón "INICIAR".
2. **Ejecución** — Usuario hace el ejercicio, toca "LISTO" al terminar.
3. **Descanso (3:00)** — Título "Descanso", imagen cuadrada, timer regresivo de 3:00, barra de progreso celeste que avanza con el tiempo.
4. **Siguiente serie** — Vuelve a splash del mismo ejercicio (si tiene más series). (Siempre 2 series — Heavy Duty).
5. **Descanso largo (5:00)** — Al terminar todas las series del ejercicio, descanso de 5:00 antes del siguiente ejercicio.
6. **Siguiente ejercicio** — Repite desde paso 1.
7. **Congratulations** — Al terminar todos los ejercicios del día: título, animación de confetis, imagen cuadrada, texto motivacional, tap para salir.

## Estructura del Proyecto

```
src/
├── routes/
│   ├── +layout.svelte        # Layout con bottom nav y tema
│   ├── +page.svelte          # Home — widget del día
│   ├── agenda/
│   │   ├── +page.svelte      # CRUD de días de rutina
│   │   └── [id]/
│   │       └── +page.svelte  # Ejercicios de un día
│   ├── progreso/
│   │   ├── +page.svelte      # Cards de días
│   │   └── [id]/
│   │       └── +page.svelte  # Pesos por ejercicio
│   ├── calendario/
│   │   └── +page.svelte      # Vista semanal
│   ├── perfil/
│   │   └── +page.svelte      # Config y tema
│   └── workout/
│       └── [diaId]/
│           └── +page.svelte  # Flujo guiado de entrenamiento
├── lib/
│   ├── stores/
│   │   └── entrenamiento.ts  # Stores (días, ejercicios, pesos, progreso)
│   ├── components/
│   │   ├── NavBar.svelte
│   │   ├── DiaCard.svelte
│   │   ├── EjercicioCard.svelte
│   │   ├── ThemeToggle.svelte
│   │   ├── WorkoutTimer.svelte    # Timer 3:00 / 5:00
│   │   ├── ProgressBar.svelte     # Barra de progreso celeste
│   │   └── ConfettiOverlay.svelte  # Animación de confetis
│   └── types/
│       └── index.ts           # Tipos: Dia, Ejercicio, Serie, etc.
└── app.html
```

## Diseño (Referencia index.html)

El prototipo `index.html` define la línea visual a seguir:

- **Fuente:** Montserrat (Google Fonts)
- **Estilo:** Glassmorphism — `backdrop-filter: blur(12px)`, bordes semitransparentes, sombra suave
- **Colores glass:** `rgba(255,255,255,0.4)` en light, `rgba(0,0,0,0.55)` en dark
- **Modo oscuro:** Clase `.dark` en `<html>`, transiciones suaves
- **Iconos:** Lucide con carga dinámica (`lucide.createIcons()`)
- **Imágenes:** Cuadradas, con overlay degradado y efecto de mezcla

