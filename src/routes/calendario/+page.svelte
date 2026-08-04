<script lang="ts">
	import { diasStore } from '$lib/stores/entrenamiento';
	import { CalendarDays } from 'lucide-svelte';

	const diasNombres = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
	const diasCortos = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
	const hoy = new Date().getDay();
</script>

<div class="w-full flex flex-col gap-5">
	<!-- Portada estilo Notion -->
	<div class="w-full h-32 glass-card rounded-2xl overflow-hidden relative group shadow-md">
		<img
			src="/images/unnamed7.jpg"
			alt="Portada Calendario"
			class="object-cover w-full h-full grayscale dark:grayscale-0 contrast-110"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>
		<div class="absolute bottom-3 left-4 right-4 text-white">
			<span class="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
				Vista Semanal
			</span>
			<h2 class="text-xl font-extrabold tracking-tight text-white mt-1">Calendario</h2>
		</div>
	</div>

	<p class="text-xs opacity-70 font-medium -mt-2">
		Programación semanal de tus días de entrenamiento y descanso.
	</p>

	<div class="glass-card rounded-2xl p-4 flex flex-col gap-3">
		<span class="text-[10px] font-extrabold uppercase tracking-wider opacity-60">Esta Semana</span>
		<div class="grid grid-cols-7 gap-1 text-center">
			{#each diasCortos as dia, i}
				<div class="flex flex-col items-center gap-1">
					<span class="text-[10px] font-bold opacity-50">{dia}</span>
					<div class="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold
						{i === hoy ? 'bg-black text-white dark:bg-white dark:text-black' : 'opacity-40'}">
						{i + 1}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="space-y-3">
		{#each [1, 2, 3, 4, 5, 6, 0] as diaIndex}
			{@const rutina = $diasStore.find(d => d.diaSemana === diaIndex)}
			<div class="glass-card p-4 rounded-xl flex items-center justify-between
				{diaIndex === hoy ? 'border-l-4 border-l-black dark:border-l-white' : 'opacity-70'}">
				<div>
					<span class="text-[10px] font-extrabold uppercase tracking-wider opacity-60">
						{diasNombres[diaIndex]}{diaIndex === hoy ? ' — HOY' : ''}
					</span>
					<h4 class="font-bold text-sm mt-0.5">
						{rutina ? rutina.nombre : 'Descanso'}
					</h4>
				</div>
				{#if rutina}
					<span class="text-[10px] font-bold px-2.5 py-1 bg-black/10 dark:bg-white/10 rounded-md">
						{rutina.ejercicios.length} ejercicios
					</span>
				{:else}
					<span class="text-[10px] font-semibold px-2.5 py-1 bg-black/5 dark:bg-white/5 rounded-md opacity-70">
						Relax
					</span>
				{/if}
			</div>
		{/each}
	</div>
</div>
