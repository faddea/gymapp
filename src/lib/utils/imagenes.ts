const FALLBACK = '/images/unnamed20.jpg';

const IMAGENES_POR_TIPO: Record<string, string[]> = {
	push: ['/images/baki/push/unnamed9.jpg'],
	back: ['/images/baki/back/unnamed10.jpg', '/images/baki/back/unnamed10.jpg'],
	legs: ['/images/baki/legs/unnamed13.jpg', '/images/baki/legs/unnamed21.jpg'],
	cardio: ['/images/baki/cardio/unnamed12.jpg']
};

const KEYWORDS: Record<string, string> = {
	push: 'push',
	empuje: 'push',
	pecho: 'push',
	back: 'back',
	espalda: 'back',
	remada: 'back',
	legs: 'legs',
	pierna: 'legs',
	piernas: 'legs',
	cardio: 'cardio',
	cardiovascular: 'cardio'
};

function hashString(s: string): number {
	let h = 0;
	for (let i = 0; i < s.length; i++) {
		h = (h * 31 + s.charCodeAt(i)) | 0;
	}
	return Math.abs(h);
}

export function getDiaImagen(nombre: string, id?: string): string {
	const nombreNorm = nombre.toLowerCase();

	let tipo: string | undefined;
	for (const [clave, tipoVal] of Object.entries(KEYWORDS)) {
		if (nombreNorm.includes(clave)) {
			tipo = tipoVal;
			break;
		}
	}

	if (!tipo) return FALLBACK;

	const imagenes = IMAGENES_POR_TIPO[tipo];
	if (!imagenes || imagenes.length === 0) return FALLBACK;

	if (imagenes.length === 1) return imagenes[0];

	const semilla = hashString(id ?? nombreNorm);
	return imagenes[semilla % imagenes.length];
}
