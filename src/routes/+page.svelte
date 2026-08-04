<script lang="ts">
	import { rutinaDeHoy } from '$lib/stores/entrenamiento';
	import { Dumbbell, History, ClipboardList, Accessibility, Sparkles, ChevronRight } from 'lucide-svelte';
	import MobilityModal from '$lib/components/MobilityModal.svelte';

	let showMobilityModal = $state(false);
	let mobilityBtn = $state<HTMLButtonElement | null>(null);

	// Formatear el día de la semana actual
	const diasSemanaNombres = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
	const diaActualNombre = diasSemanaNombres[new Date().getDay()];
</script>

<!-- Imagen Cuadrada de Entrenamiento Requerida con Glass Container -->
<div class="w-full aspect-square glass-card rounded-2xl overflow-hidden relative group shadow-lg">
	<img
		src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYNVPVKU9N5pXts8w4REHzK1-bdcR8nM9LbdFLKIAinQ&s=10"
		alt="Entrenamiento de Hipertrofia"
		class="object-cover w-full h-full grayscale dark:grayscale-0 contrast-115 transform group-hover:scale-105 transition-transform duration-500"
	/>
	<div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none"></div>
	<div class="absolute bottom-4 left-4 right-4 text-white flex flex-col gap-1">
		<span class="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full w-fit border border-white/20">
			Fase Actual
		</span>
		<h3 class="text-lg font-bold tracking-tight text-white drop-shadow-sm">Sobrecarga Progresiva W4</h3>
	</div>
</div>

<!-- Sección de Estado y Gestión de Cargas -->
<div class="w-full text-center mt-1 flex flex-col items-center">
	<h2 class="text-2xl font-extrabold tracking-tight mb-1">Bloque: Fuerza e Hipertrofia</h2>
	<p class="text-xs font-medium opacity-70 mb-6 max-w-xs">
		Gestiona tus cargas, series efectivas y sobrecarga progresiva.
	</p>

	<!-- Grid de Opciones Enfocadas en el Registro de Pesos -->
	<div class="grid grid-cols-2 gap-3.5 w-full text-left">
		
		<!-- Botón principal: Iniciar entrenamiento del día -->
		{#if $rutinaDeHoy}
			<a
				href={`/workout/${$rutinaDeHoy.id}`}
				class="glass-card rounded-2xl p-5 flex flex-col justify-between gap-4 hover:scale-[1.01] active:scale-[0.98] col-span-2 border-l-4 border-l-black dark:border-l-white group transition-all"
			>
				<div class="flex justify-between items-start w-full">
					<div class="p-2.5 rounded-xl bg-black/5 dark:bg-white/10 group-hover:bg-black/10 dark:group-hover:bg-white/20 transition-colors">
						<Dumbbell class="w-6 h-6 stroke-[2.25px]" />
					</div>
					<span class="text-[10px] font-extrabold tracking-wider px-2.5 py-1 bg-black text-white dark:bg-white dark:text-black rounded-md uppercase">
						HOY ({diaActualNombre})
					</span>
				</div>
				<div class="flex justify-between items-end">
					<div>
						<span class="block font-extrabold text-lg tracking-tight">Entrenar: {$rutinaDeHoy.nombre}</span>
						<span class="text-xs opacity-60 font-medium">
							Siguiente: {$rutinaDeHoy.ejercicios[0]?.nombre || 'Ver ejercicios'}
						</span>
					</div>
					<div class="p-1 rounded-full bg-black/5 dark:bg-white/10 group-hover:translate-x-1 transition-transform">
						<ChevronRight class="w-5 h-5" />
					</div>
				</div>
			</a>
		{:else}
			<div
				class="glass-card rounded-2xl p-5 flex flex-col justify-between gap-4 col-span-2 border-l-4 border-l-amber-500/80 transition-all"
			>
				<div class="flex justify-between items-start w-full">
					<div class="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-400/20 text-amber-600 dark:text-amber-400">
						<Sparkles class="w-6 h-6 stroke-[2.25px]" />
					</div>
					<span class="text-[10px] font-extrabold tracking-wider px-2.5 py-1 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-md uppercase">
						HOY ({diaActualNombre})
					</span>
				</div>
				<div>
					<span class="block font-extrabold text-lg tracking-tight">Hoy no tienes que entrenar</span>
					<span class="text-xs opacity-70 font-medium block mt-0.5">
						Día de recuperación muscular activa y descanso.
					</span>
				</div>
				<a
					href="/agenda"
					class="mt-1 text-xs font-bold underline flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
				>
					Ver agenda semanal <ChevronRight class="w-3.5 h-3.5" />
				</a>
			</div>
		{/if}

		<!-- Botón de Historial de cargas -->
		<a
			href="/progreso"
			class="glass-card rounded-xl p-4 flex flex-col justify-between gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all group"
		>
			<div class="p-2 rounded-lg bg-black/5 dark:bg-white/10 self-start group-hover:bg-black/10 dark:group-hover:bg-white/20 transition-colors">
				<History class="w-5 h-5" />
			</div>
			<div>
				<span class="block font-bold text-sm tracking-tight">Historial Pesos</span>
				<span class="text-[11px] opacity-60 font-medium">Tus 1RM y marcas</span>
			</div>
		</a>

		<!-- Botón de Rutinas Guardadas (Agenda) -->
		<a
			href="/agenda"
			class="glass-card rounded-xl p-4 flex flex-col justify-between gap-4 hover:scale-[1.02] active:scale-[0.98] transition-all group"
		>
			<div class="p-2 rounded-lg bg-black/5 dark:bg-white/10 self-start group-hover:bg-black/10 dark:group-hover:bg-white/20 transition-colors">
				<ClipboardList class="w-5 h-5" />
			</div>
			<div>
				<span class="block font-bold text-sm tracking-tight">Editar Bloques</span>
				<span class="text-[11px] opacity-60 font-medium">Rutinas A/B/C</span>
			</div>
		</a>

		<!-- Botón para la sección de Flexibilidad/Estiramientos -->
		<button
			bind:this={mobilityBtn}
			onclick={() => (showMobilityModal = true)}
			class="glass-card rounded-xl p-4 flex flex-col justify-between gap-3 hover:scale-[1.01] active:scale-[0.98] col-span-2 transition-all text-left cursor-pointer group"
		>
			<div class="flex items-center gap-3">
				<div class="p-2.5 rounded-lg bg-black/5 dark:bg-white/10 group-hover:bg-black/10 dark:group-hover:bg-white/20 transition-colors">
					<Accessibility class="w-5 h-5" />
				</div>
				<div>
					<span class="block font-bold text-sm tracking-tight">Estiramientos y Movilidad</span>
					<span class="text-xs opacity-60 font-medium">Flexibilidad post-entrenamiento</span>
				</div>
			</div>
		</button>
	</div>
</div>

<!-- Modal de Movilidad -->
<MobilityModal bind:open={showMobilityModal} trigger={mobilityBtn} />
