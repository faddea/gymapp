# ITRAIN

## Tech Stack

- **Framework:** SvelteKit
- **Styling:** Tailwind CSS (config con colores glass, overlay, tipografía Montserrat — ver `index.html` como referencia de diseño)
- **Icons:** Lucide
- **Mobile:** Capacitor (Android)
- **Persistence:** localStorage

## Build Android (Capacitor)

La app empaquetada para Android usa Capacitor. Todo el tooling de build está **dentro del proyecto** (self-contained), sin depender de instalaciones en el sistema:

| Carpeta | Contenido |
|---------|-----------|
| `.android-sdk/` | Android SDK (platform-tools, platforms;android-36, build-tools) |
| `.jdk/jdk-21.0.12+8/` | JDK 21 (Capacitor 8 requiere Java 21) |
| `.gradle/` | Caché de Gradle (wrapper + dependencias) |

> Estas carpetas están en `.gitignore` y **no se deben commitear**.

**Configuración:**
- `capacitor.config.ts` — appId `com.itraing.app`, appName `itraing`, webDir `build`, splash oscuro (`backgroundColor: #0a0a0a`).
- `android/local.properties` — `sdk.dir=../.android-sdk`.
- `android/gradle.properties` — `org.gradle.java.home` y `org.gradle.user.home` apuntando al `.jdk`/`.gradle` del proyecto.
- `src/routes/+layout.ts` — `export const ssr = false` (CSR-only: la app usa `localStorage`/`window`).

**Flujo de build:**
```sh
npm run build          # genera la web estática en build/
npx cap sync android   # copia la web + plugins al proyecto Android
npm run apk            # compila el APK debug (usa build-apk.sh)
```

> Usar siempre `npm run apk` (o `./build-apk.sh`): fuerza `GRADLE_USER_HOME` a la caché del proyecto. Ejecutar `gradlew` directo sin `GRADLE_USER_HOME` recrea `~/.gradle` en el home.

**APK resultante:** `android/app/build/outputs/apk/debug/app-debug.apk`

**Icono y splash:** se generan desde `static/icons/splash.png` (1024×1024) con `@capacitor/assets` (fuentes en `assets/`). El splash es oscuro (`#0a0a0a`) tanto en Android 12+ (`windowSplashScreenBackground`) como en versiones anteriores.

### Nota sobre `~/.android`

El directorio `~/.android/` del home (contiene `debug.keystore`, `analytics.settings`, `cache`) es **preexistente y ajeno a este proyecto** — no lo genera el build. Se deja como está: lo usa Gradle para firmar el APK de debug y también otros proyectos del equipo. **No borrar.**

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

