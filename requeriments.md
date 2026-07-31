# App Entrenamiento — Requisitos

App móvil con Capacitor para Android. Basada en SvelteKit.

## Pantallas

- **Inicio** — Widget con el entrenamiento del día (si aplica), imagen motivacional, acceso rápido al workout. Si el día actual no tiene rutina asignada: "Hoy no tienes que entrenar".
- **Agenda** — CRUD de días y ejercicios. Botón "+" (Lucide) para crear día. Cards apiladas verticalmente. Cada día: lista de ejercicios con CRUD (agregar, editar, eliminar).
- **Progreso** — Cards de los días de rutina. Al entrar a un día: lista de ejercicios. Por cada ejercicio: registrar peso realizado y peso objetivo para la semana siguiente.
- **Calendario** — Vista semanal. Cada rutina se asigna a un día de la semana (Lunes Push, Miércoles Back, Viernes Legs, etc.).
- **Perfil** — Configuración general. Cambio de tema (claro/oscuro).

## Rutinas y Ejercicios

- Días personalizables (ej: Push Day, Back Day, Legs Day)
- Botón "+" chico con SVG de Lucide para crear nuevo día/rutina
- Cada día es una card, se entra a ella para ver/manejar sus ejercicios
- CRUD completo por ejercicio: nombre, series (2 — Heavy Duty), peso actual, peso objetivo, descanso
- El formulario de ejercicio se abre en un modal: se especifican datos, se guarda y se cierra

## Progreso y Pesos

- En la pestaña Progreso aparecen las cards de los días
- Al entrar a un día: ejercicios con peso anterior registrado
- Se puede anotar peso realizado y peso a superar la próxima semana
- Si se supera la marca anterior, se actualiza el registro

## Calendario

- Asignar un día de la semana a cada rutina (L, M, Mi, J, V, S, D)
- Vista semanal mostrando los días asignados

## Flujo de Entrenamiento (Anti-salteo)

Al tocar el widget de "Entrenar" en Inicio:

1. **Pantalla de ejercicio** — Título del ejercicio, imagen cuadrada motivacional, peso anterior y peso objetivo (chico), botón "INICIAR".
2. **Ejecución** — Usuario toca "LISTO" al terminar la serie.
3. **Descanso 3:00** — Título "Descanso", imagen cuadrada, timer regresivo, barra de progreso celeste.
4. **Siguiente serie** — Vuelve a la pantalla del ejercicio (si quedan series).
5. **Descanso 5:00** — Al terminar todas las series del ejercicio.
6. **Siguiente ejercicio** — Repite hasta completar el día.
7. **Congratulations** — Pantalla final con título, confetis, imagen, texto motivacional. Tap para salir.

### Especificaciones de descanso

- **Entre series:** 3 minutos
- **Entre ejercicios:** 5 minutos
- Timer regresivo con barra de progreso celeste

### Serie Heavy Duty

- Siempre 2 series por ejercicio
- Enfoque en fuerza e hipertrofia

## Diseño

- Misma línea visual del prototipo `index.html`
- Estilo glassmorphism con blur y bordes semitransparentes
- Montserrat como tipografía
- Iconos Lucide
- Tema claro/oscuro

## Persistencia

- localStorage para almacenar días, ejercicios, pesos, progreso y preferencias
