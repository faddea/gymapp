<script lang="ts">
	import { diasStore } from '$lib/stores/entrenamiento';
	import { ChevronRight, Dumbbell } from 'lucide-svelte';

	const diasNombres: Record<number, string> = {
		0: 'Domingo', 1: 'Lunes', 2: 'Martes',
		3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado'
	};
</script>

<div class="w-full flex flex-col gap-5">
	<!-- Portada estilo Notion -->
	<div class="w-full h-32 glass-card rounded-2xl overflow-hidden relative group shadow-md">
		<img
			src="/images/unnamed17.jpg"
			alt="Portada Progreso"
			class="object-cover object-[0%_33%] w-full h-full grayscale dark:grayscale-0 contrast-110"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>
		<div class="absolute bottom-3 left-4 right-4 text-white">
			<span class="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
				Registro & Metas
			</span>
			<h2 class="text-xl font-extrabold tracking-tight text-white mt-1">Progreso</h2>
		</div>
	</div>

	<p class="text-xs opacity-70 font-medium -mt-2">
		Selecciona un día para anotar los pesos realizados y proyectar el objetivo de la próxima semana.
	</p>

	<!-- Cards de los días de rutina -->
	{#if $diasStore.length === 0}
		<div class="glass-card rounded-2xl p-8 flex flex-col items-center text-center gap-3 opacity-60">
			<div class="w-12 h-12 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
				<Dumbbell class="w-6 h-6 opacity-60" />
			</div>
			<div>
				<p class="font-bold text-sm">Sin días registrados</p>
				<p class="text-xs opacity-70 mt-0.5">Primero crea un día en la pestaña Agenda.</p>
			</div>
		</div>
	{:else}
		<div class="flex flex-col gap-3.5 w-full">
			{#each $diasStore as dia}
				<a
					href={`/progreso/${dia.id}`}
					class="glass-card rounded-2xl p-4 flex items-center justify-between border-l-4 border-l-black dark:border-l-white hover:scale-[1.01] active:scale-[0.99] transition-all group"
				>
					<div class="flex flex-col gap-1">
						<span class="font-extrabold text-base tracking-tight">{dia.nombre}</span>
						<div class="flex items-center gap-2 text-xs opacity-60 font-medium">
							{#if dia.diaSemana !== undefined}
								<span>{diasNombres[dia.diaSemana]}</span>
								<span>•</span>
							{/if}
							<span>{dia.ejercicios.length} {dia.ejercicios.length === 1 ? 'ejercicio' : 'ejercicios'}</span>
						</div>
					</div>
					<ChevronRight class="w-4 h-4 opacity-40 group-hover:opacity-80 group-hover:translate-x-0.5 transition-all" />
				</a>
			{/each}
		</div>
	{/if}
</div>
