# ITRAIN

## Tech Stack

- **Framework:** SvelteKit 2 (Svelte 5, runes mode)
- **Styling:** Tailwind CSS v4 + glassmorphism (`.glass-card`), tipografía Montserrat
- **Icons:** lucide-svelte
- **Mobile:** Capacitor 8 (Android)
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

**Icono de launcher (adaptativo):** se regenera desde `static/icons/splash.png` (todas las densidades en `ic_launcher_foreground.png`). El fondo adaptativo es oscuro `#0a0a0a` (`res/values/ic_launcher_background.xml`). Se eliminó el ícono por defecto de Capacitor (vector `drawable-v24/ic_launcher_foreground.xml`). El mismo `ic_launcher_foreground` es el que usa el splash de Android 12+ (`windowSplashScreenAnimatedIcon`).

**Barras del sistema (edge-to-edge):**
- `src/app.html` — viewport con `viewport-fit=cover` para que el WebView dibuje detrás de las barras del sistema.
- `res/values/styles.xml` — `statusBarColor` y `navigationBarColor` transparentes; el tema de splash usa íconos claros (`windowLightStatusBar/NavigationBar = false`) sobre fondo oscuro.
- Safe-area con `env(safe-area-inset-*)` en `src/routes/+layout.svelte` (padding superior) y `src/lib/components/BottomNav.svelte` (padding inferior) para que el contenido no quede bajo las barras.

**Botón "atrás" físico de Android:** `@capacitor/app` está instalado y registrado (`npx cap sync`). El botón físico navega el historial del SPA; sin historial, cierra la app (comportamiento por defecto). Se usa `Capacitor.getPlatform()` para UI condicional en Android (p.ej. `agenda/[id]` oculta el botón "volver" en Android nativo).

**Watch de Vite (dev):** `vite.config.ts` → `server.watch.ignored` excluye `.android-sdk/`, `.jdk/`, `.gradle/`, `android/` y `build/`. Sin esto, `npm run dev` agota el límite de watchers del sistema (`ENOSPC`).

### Nota sobre `~/.android`

El directorio `~/.android/` del home (contiene `debug.keystore`, `analytics.settings`, `cache`) es **preexistente y ajeno a este proyecto** — no lo genera el build. Se deja como está: lo usa Gradle para firmar el APK de debug y también otros proyectos del equipo. **No borrar.**

## Modo de Entrenamiento (Gym / Home)

Selector en **Perfil** (Segmented Control "Gym | Home", persistido en `localStorage` vía `modoEntrenamientoStore`):

- **Gym** → las cargas se registran en kg (input numérico con stepper).
- **Home** → las cargas son texto libre (ej: "el balde con una pesa y un disco"), porque en casa no siempre se sabe el peso exacto.

En el modelo, `Serie` guarda `pesoActual`/`pesoObjetivo` (kg) y además `pesoActualTexto`/`pesoObjetivoTexto` (descripción, modo Home). Los kg se conservan aunque se registre en Home, así no se pierde nada al cambiar de modo.

La visualización usa `formatearCarga(serie, campo, modo)` (`src/lib/utils/carga.ts`): en modo Home muestra el texto si existe (si no, cae a `X kg`); en modo Gym siempre `X kg`. Aplica a `agenda/[id]` y `progreso/[id]`.

## Estado del entrenamiento del día

En la Home, el botón "Entrenar" abre un modal para marcar el entrenamiento como completado ("¿Terminaste el entrenamiento?").

- `entrenamientoHechoStore` guarda un registro `{ [fecha]: true }` en `localStorage` (clave `hyper_entrenamiento_hecho`).
- `entrenamientoHoyHecho` (derived) indica si ya se completó hoy (clave por fecha vía `getFechaClave()`, formato `YYYY-MM-DD`).
- Al completarlo, el hero de la Home pasa a imagen de descanso (URL) y muestra "HOY · Hecho / Ya entrené hoy" hasta el día siguiente.

## Pantallas (Bottom Nav)

| Icono | Ruta | Nombre | Descripción |
|-------|------|--------|-------------|
| home | `/` | Inicio | Hero con imagen dinámica (por tipo de día; cardio con recorte superior `object-[0%_22%]`). "Entrenar" abre el modal de completar entrenamiento. Estado de descanso si no hay rutina hoy o si ya se entrenó. |
| calendar | `/agenda` | Agenda | CRUD de días de rutina y ejercicios. Los días se ordenan por día de la semana (Lunes→Domingo). `agenda/[id]` **no muestra pesos** (solo etiqueta de series) y oculta el botón "volver" en Android nativo. |
| trending-up | `/progreso` | Progreso | Cards de los días de rutina. Dentro de un día, cada ejercicio muestra la carga realizada y el objetivo (según modo Gym/Home) y permite registrar nuevo peso. |
| calendar-days | `/calendario` | Calendario | Vista semanal con los días asignados a cada rutina. |
| user | `/perfil` | Perfil | Configuración: tema claro/oscuro, peso corporal, y Segmented Control de Lugar de Entrenamiento (Gym/Home). |

## Estructura del Proyecto

```
src/
├── routes/
│   ├── +layout.svelte        # Layout con bottom nav, tema y safe-area
│   ├── +layout.ts            # ssr = false (CSR-only)
│   ├── +page.svelte          # Home — widget del día + modal "terminaste el entrenamiento"
│   ├── agenda/
│   │   ├── +page.svelte      # CRUD de días (ordenados por día de semana)
│   │   └── [id]/
│   │       └── +page.svelte  # Ejercicios de un día (sin pesos, sin "volver" en Android)
│   ├── progreso/
│   │   ├── +page.svelte      # Cards de días
│   │   └── [id]/
│   │       └── +page.svelte  # Cargas por ejercicio (Gym/Home)
│   ├── calendario/
│   │   └── +page.svelte      # Vista semanal
│   └── perfil/
│       └── +page.svelte      # Config, tema, peso corporal, modo Gym/Home
├── lib/
│   ├── stores/
│   │   └── entrenamiento.ts  # Stores: días, modo Gym/Home, tema, peso corporal, entrenamiento del día
│   ├── utils/
│   │   ├── carga.ts          # formatearCarga (texto o kg según modo)
│   │   └── imagenes.ts       # getDiaImagen (imágenes por tipo de rutina)
│   ├── components/
│   │   ├── BottomNav.svelte
│   │   ├── Input.svelte
│   │   ├── Modal.svelte
│   │   ├── MobilityModal.svelte
│   │   ├── NavBar.svelte
│   │   ├── SegmentedControl.svelte
│   │   ├── Select.svelte
│   │   └── ThemeToggle.svelte
│   └── types/
│       └── index.ts          # Tipos: Dia, Ejercicio, Serie, ModoEntrenamiento
└── app.html                  # viewport-fit=cover, tema precargado
```

## Diseño

- **Fuente:** Montserrat (Google Fonts)
- **Estilo:** Glassmorphism — `backdrop-filter: blur(12px)`, bordes semitransparentes, sombra suave (`.glass-card` en `src/app.css`)
- **Modo oscuro:** Clase `.dark` en `<html>` con `@custom-variant dark` en Tailwind v4; el tema se precarga en `app.html` según `localStorage`/`prefers-color-scheme`
- **Iconos:** lucide-svelte
- **Imágenes:** Cuadradas, con overlay degradado y efecto de mezcla
