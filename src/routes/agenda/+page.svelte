<script lang="ts">
	import { diasStore } from '$lib/stores/entrenamiento';
	import { Calendar, Plus, Dumbbell } from 'lucide-svelte';
</script>

<div class="w-full flex flex-col gap-5">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-extrabold tracking-tight">Agenda</h2>
			<p class="text-xs opacity-60 font-medium">Planifica y edita tus bloques de entrenamiento</p>
		</div>
		<button class="p-2.5 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-md">
			<Plus class="w-4 h-4" />
			<span>Nuevo Día</span>
		</button>
	</div>

	<div class="space-y-3.5 w-full">
		{#each $diasStore as dia}
			<div class="glass-card p-4 rounded-2xl flex flex-col gap-3 border-l-4 border-l-black dark:border-l-white">
				<div class="flex justify-between items-start">
					<div>
						<h3 class="font-extrabold text-base tracking-tight">{dia.nombre}</h3>
						<span class="text-xs opacity-60 font-medium">{dia.subtitulo || `${dia.ejercicios.length} ejercicios registrados`}</span>
					</div>
					<span class="text-[10px] font-bold px-2 py-0.5 bg-black/10 dark:bg-white/10 rounded-md">
						{dia.ejercicios.length} ejercicios
					</span>
				</div>

				<div class="space-y-1.5 pt-1">
					{#each dia.ejercicios as ej}
						<div class="flex items-center justify-between text-xs p-2 rounded-lg bg-black/5 dark:bg-white/5">
							<span class="font-semibold flex items-center gap-2">
								<Dumbbell class="w-3.5 h-3.5 opacity-60" />
								{ej.nombre}
							</span>
							<span class="opacity-60 text-[11px] font-mono">{ej.series.length} series</span>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
