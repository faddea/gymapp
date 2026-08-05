import { writable, derived } from 'svelte/store';
import type { Dia, Ejercicio, MobilityExercise, ModoEntrenamiento } from '$lib/types';

const INITIAL_DIAS: Dia[] = [];

export const MOBILITY_EXERCISES: MobilityExercise[] = [
	{
		id: 'mob-1',
		titulo: '1. Extensión Torácica',
		descripcion: 'Abre la caja torácica y mejora la postura para preses de pecho.',
		duracion: '45 segundos'
	},
	{
		id: 'mob-2',
		titulo: '2. Estiramiento Pectoral en Pared',
		descripcion: 'Alivia la tensión del pectoral menor y estabilizadores de hombro.',
		duracion: '45s por lado'
	},
	{
		id: 'mob-3',
		titulo: '3. Rotadores de Hombro',
		descripcion: 'Salud articular para prevenir pinzamientos y preparar el supraespinoso.',
		duracion: '60 segundos'
	}
];

const isBrowser = typeof window !== 'undefined';

function createDiasStore() {
	const initial = isBrowser ? JSON.parse(localStorage.getItem('hyper_dias') || 'null') || INITIAL_DIAS : INITIAL_DIAS;
	const { subscribe, set, update } = writable<Dia[]>(initial);

	return {
		subscribe,
		set: (value: Dia[]) => {
			if (isBrowser) localStorage.setItem('hyper_dias', JSON.stringify(value));
			set(value);
		},
		update: (fn: (dias: Dia[]) => Dia[]) => {
			update((dias) => {
				const updated = fn(dias);
				if (isBrowser) localStorage.setItem('hyper_dias', JSON.stringify(updated));
				return updated;
			});
		}
	};
}

export const diasStore = createDiasStore();

// Tienda derivada para el día actual
export const rutinaDeHoy = derived(diasStore, ($dias) => {
	const todayIndex = new Date().getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
	return $dias.find((d) => d.diaSemana === todayIndex) || null;
});

function createThemeStore() {
	const initial = isBrowser ? localStorage.getItem('theme') || 'light' : 'light';
	const { subscribe, set } = writable<string>(initial);

	return {
		subscribe,
		toggle: () => {
			if (!isBrowser) return;
			const isDark = document.documentElement.classList.contains('dark');
			const nextTheme = isDark ? 'light' : 'dark';
			if (nextTheme === 'dark') {
				document.documentElement.classList.add('dark', 'dark-mode');
				document.documentElement.classList.remove('light-mode');
			} else {
				document.documentElement.classList.add('light-mode');
				document.documentElement.classList.remove('dark', 'dark-mode');
			}
			localStorage.setItem('theme', nextTheme);
			set(nextTheme);
		}
	};
}

export const themeStore = createThemeStore();

function createPesoCorporalStore() {
	const initial = isBrowser ? parseFloat(localStorage.getItem('hyper_peso_corporal') || '') || 78.4 : 78.4;
	const { subscribe, set } = writable<number>(initial);

	return {
		subscribe,
		set: (value: number) => {
			if (isBrowser) localStorage.setItem('hyper_peso_corporal', String(value));
			set(value);
		}
	};
}

export const pesoCorporalStore = createPesoCorporalStore();

function createModoEntrenamientoStore() {
	const initial: ModoEntrenamiento = isBrowser
		? localStorage.getItem('modo_entrenamiento') === 'home'
			? 'home'
			: 'gym'
		: 'gym';
	const { subscribe, set } = writable<ModoEntrenamiento>(initial);

	return {
		subscribe,
		set: (value: ModoEntrenamiento) => {
			if (isBrowser) localStorage.setItem('modo_entrenamiento', value);
			set(value);
		}
	};
}

export const modoEntrenamientoStore = createModoEntrenamientoStore();

export function getFechaClave(d: Date = new Date()): string {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function createEntrenamientoHechoStore() {
	const initial: Record<string, boolean> = isBrowser
		? JSON.parse(localStorage.getItem('hyper_entrenamiento_hecho') || '{}')
		: {};
	const { subscribe, update } = writable<Record<string, boolean>>(initial);

	return {
		subscribe,
		completarHoy: () => {
			update((record) => {
				const next = { ...record, [getFechaClave()]: true };
				if (isBrowser) localStorage.setItem('hyper_entrenamiento_hecho', JSON.stringify(next));
				return next;
			});
		}
	};
}

export const entrenamientoHechoStore = createEntrenamientoHechoStore();

export const entrenamientoHoyHecho = derived(entrenamientoHechoStore, ($hecho) => !!$hecho[getFechaClave()]);

// --- Funciones Auxiliares CRUD para Ejercicios ---

export function agregarEjercicio(
	diaId: string,
	nombre: string,
	pesoActual: number,
	pesoObjetivo: number,
	pesoActualTexto?: string,
	pesoObjetivoTexto?: string
) {
	diasStore.update((dias) => {
		return dias.map((d) => {
			if (d.id !== diaId) return d;
			const nuevoEjercicio: Ejercicio = {
				id: crypto.randomUUID(),
				nombre,
				series: [
					{ id: crypto.randomUUID(), numero: 1, pesoActual, pesoObjetivo, pesoActualTexto, pesoObjetivoTexto, completada: false },
					{ id: crypto.randomUUID(), numero: 2, pesoActual, pesoObjetivo, pesoActualTexto, pesoObjetivoTexto, completada: false }
				],
				descansoSeriesSegundos: 180,
				descansoEjercicioSegundos: 300
			};
			return {
				...d,
				ejercicios: [...d.ejercicios, nuevoEjercicio]
			};
		});
	});
}

export function editarEjercicio(
	diaId: string,
	ejercicioId: string,
	nombre: string,
	pesoActual: number,
	pesoObjetivo: number,
	pesoActualTexto?: string,
	pesoObjetivoTexto?: string
) {
	diasStore.update((dias) => {
		return dias.map((d) => {
			if (d.id !== diaId) return d;
			return {
				...d,
				ejercicios: d.ejercicios.map((ej) => {
					if (ej.id !== ejercicioId) return ej;
					return {
						...ej,
						nombre,
						series: ej.series.map((s) => ({
							...s,
							pesoActual,
							pesoObjetivo,
							pesoActualTexto,
							pesoObjetivoTexto
						}))
					};
				})
			};
		});
	});
}

export function eliminarEjercicio(diaId: string, ejercicioId: string) {
	diasStore.update((dias) => {
		return dias.map((d) => {
			if (d.id !== diaId) return d;
			return {
				...d,
				ejercicios: d.ejercicios.filter((ej) => ej.id !== ejercicioId)
			};
		});
	});
}

export function actualizarPesosEjercicio(
	diaId: string,
	ejercicioId: string,
	pesoActual: number,
	pesoObjetivo: number,
	pesoActualTexto?: string,
	pesoObjetivoTexto?: string
) {
	diasStore.update((dias) => {
		return dias.map((d) => {
			if (d.id !== diaId) return d;
			return {
				...d,
				ejercicios: d.ejercicios.map((ej) => {
					if (ej.id !== ejercicioId) return ej;
					return {
						...ej,
						series: ej.series.map((s) => ({
							...s,
							pesoActual,
							pesoObjetivo,
							pesoActualTexto,
							pesoObjetivoTexto
						}))
					};
				})
			};
		});
	});
}

export function moverEjercicioDeDia(ejercicioId: string, origenDiaId: string, destinoDiaId: string) {
	diasStore.update((dias) => {
		let ejercicioAMover: Ejercicio | null = null;

		// Remover del origen
		const diasLimpios = dias.map((d) => {
			if (d.id === origenDiaId) {
				ejercicioAMover = d.ejercicios.find((e) => e.id === ejercicioId) || null;
				return {
					...d,
					ejercicios: d.ejercicios.filter((e) => e.id !== ejercicioId)
				};
			}
			return d;
		});

		if (!ejercicioAMover) return dias;

		// Agregar al destino
		return diasLimpios.map((d) => {
			if (d.id === destinoDiaId) {
				return {
					...d,
					ejercicios: [...d.ejercicios, ejercicioAMover!]
				};
			}
			return d;
		});
	});
}

export function reordenarEjercicio(diaId: string, ejercicioId: string, direccion: 'subir' | 'bajar') {
	diasStore.update((dias) => {
		return dias.map((d) => {
			if (d.id !== diaId) return d;
			const index = d.ejercicios.findIndex((e) => e.id === ejercicioId);
			if (index === -1) return d;

			const nuevosEjercicios = [...d.ejercicios];
			if (direccion === 'subir' && index > 0) {
				const temp = nuevosEjercicios[index];
				nuevosEjercicios[index] = nuevosEjercicios[index - 1];
				nuevosEjercicios[index - 1] = temp;
			} else if (direccion === 'bajar' && index < nuevosEjercicios.length - 1) {
				const temp = nuevosEjercicios[index];
				nuevosEjercicios[index] = nuevosEjercicios[index + 1];
				nuevosEjercicios[index + 1] = temp;
			}
			return {
				...d,
				ejercicios: nuevosEjercicios
			};
		});
	});
}
