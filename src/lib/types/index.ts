export interface Serie {
	id: string;
	numero: number;
	pesoActual: number;
	pesoObjetivo: number;
	repsRealizadas?: number;
	completada: boolean;
}

export interface Ejercicio {
	id: string;
	nombre: string;
	series: Serie[];
	descansoSeriesSegundos?: number; // Por defecto 180s (3m)
	descansoEjercicioSegundos?: number; // Por defecto 300s (5m)
	notas?: string;
}

export interface Dia {
	id: string;
	nombre: string;
	subtitulo?: string;
	diaSemana?: number; // 1 = Lunes, 2 = Martes, 3 = Miércoles, 4 = Jueves, 5 = Viernes, 6 = Sábado, 0 = Domingo
	ejercicios: Ejercicio[];
}

export interface MobilityExercise {
	id: string;
	titulo: string;
	descripcion: string;
	duracion: string;
}
