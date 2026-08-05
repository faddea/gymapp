import type { ModoEntrenamiento, Serie } from '$lib/types';

export function formatearCarga(serie: Serie | undefined, campo: 'actual' | 'objetivo', modo: ModoEntrenamiento): string {
	if (!serie) return '—';
	const texto = campo === 'actual' ? serie.pesoActualTexto : serie.pesoObjetivoTexto;
	if (modo === 'home' && texto && texto.trim()) return texto.trim();
	const kg = campo === 'actual' ? serie.pesoActual : serie.pesoObjetivo;
	return `${kg || 0} kg`;
}
