<script lang="ts">
	import { diasStore } from '$lib/stores/entrenamiento';
	import { TrendingUp, Award, Zap } from 'lucide-svelte';
</script>

<div class="w-full flex flex-col gap-5">
	<div>
		<h2 class="text-2xl font-extrabold tracking-tight">Progreso & Cargas</h2>
		<p class="text-xs opacity-60 font-medium">Registro de marcas, 1RM estimados y sobrecarga</p>
	</div>

	<!-- Card destacada 1RM -->
	<div class="glass-card p-5 rounded-2xl flex flex-col gap-2 relative overflow-hidden">
		<div class="flex justify-between items-center">
			<span class="text-[10px] font-extrabold uppercase tracking-wider opacity-60">Marca Máxima Estimada (1RM)</span>
			<Award class="w-5 h-5 text-amber-500" />
		</div>
		<div class="flex justify-between items-end mt-1">
			<div>
				<span class="text-3xl font-extrabold tracking-tight">32.5 kg</span>
				<span class="text-xs text-emerald-500 font-bold block mt-0.5">+2.5 kg respecto al mes pasado</span>
			</div>
			<span class="text-xs font-semibold opacity-70">Press Mancuerna</span>
		</div>
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
