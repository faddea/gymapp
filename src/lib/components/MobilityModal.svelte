<script lang="ts">
	import { X, Accessibility } from 'lucide-svelte';
	import { MOBILITY_EXERCISES } from '$lib/stores/entrenamiento';

	let { open = $bindable(false) } = $props();

	function close() {
		open = false;
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity"
		onclick={close}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Escape' && close()}
	>
		<div
			class="glass-card bg-white/95 dark:bg-neutral-900/95 text-black dark:text-white w-full max-w-sm rounded-2xl p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto shadow-2xl border border-black/10 dark:border-white/15"
			onclick={(e) => e.stopPropagation()}
			role="document"
		>
			<div class="flex justify-between items-center border-b pb-3 border-black/10 dark:border-white/10">
				<div class="flex items-center gap-2">
					<div class="p-2 rounded-lg bg-black/5 dark:bg-white/10">
						<Accessibility class="w-5 h-5" />
					</div>
					<div>
						<h3 class="font-extrabold text-base tracking-tight">Estiramientos y Movilidad</h3>
						<p class="text-[11px] opacity-60">Flexibilidad y descarga articular</p>
					</div>
				</div>
				<button
					onclick={close}
					class="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all"
					aria-label="Cerrar modal"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<p class="text-xs opacity-75 leading-relaxed">
				Realiza esta secuencia guiada para mejorar la extensión torácica y acelerar la recuperación muscular post-entrenamiento:
			</p>

			<div class="space-y-3">
				{#each MOBILITY_EXERCISES as item}
					<div class="p-3.5 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 flex flex-col gap-1">
						<div class="flex justify-between items-center">
							<strong class="text-sm font-bold">{item.titulo}</strong>
							<span class="text-[10px] font-semibold px-2 py-0.5 bg-black/10 dark:bg-white/15 rounded-full">{item.duracion}</span>
						</div>
						<p class="text-xs opacity-70 leading-normal">{item.descripcion}</p>
					</div>
				{/each}
			</div>

			<button
				onclick={close}
				class="w-full py-3 bg-black text-white dark:bg-white dark:text-black font-bold rounded-xl text-xs active:scale-98 transition-transform mt-1 shadow-md"
			>
				Entendido, volver
			</button>
		</div>
	</div>
{/if}
