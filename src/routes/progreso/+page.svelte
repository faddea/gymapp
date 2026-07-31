<script lang="ts">
	import { diasStore } from '$lib/stores/entrenamiento';
	import { TrendingUp } from 'lucide-svelte';
</script>

<div class="w-full flex flex-col gap-5">
	<div>
		<h2 class="text-2xl font-extrabold tracking-tight">Progreso & Cargas</h2>
		<p class="text-xs opacity-60 font-medium">Registro de cargas y sobrecarga progresiva</p>
	</div>


	<!-- Lista por Días -->
	<div class="space-y-4">
		{#each $diasStore as dia}
			<div class="glass-card p-4 rounded-2xl flex flex-col gap-3">
				<h3 class="font-extrabold text-sm border-b pb-2 border-black/10 dark:border-white/10">{dia.nombre}</h3>
				<div class="space-y-2">
					{#each dia.ejercicios as ej}
						<div class="flex items-center justify-between text-xs p-2.5 rounded-xl bg-black/5 dark:bg-white/5">
							<div>
								<span class="font-bold block">{ej.nombre}</span>
								<span class="text-[10px] opacity-60">Marca actual: {ej.series[0]?.pesoActual || 0} kg</span>
							</div>
							<div class="text-right">
								<span class="font-extrabold text-xs px-2 py-1 bg-black/10 dark:bg-white/15 rounded-md block">
									Objetivo: {ej.series[0]?.pesoObjetivo || 0} kg
								</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
