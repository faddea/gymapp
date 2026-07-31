import { writable, derived } from 'svelte/store';
import type { Dia, MobilityExercise } from '$lib/types';

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
