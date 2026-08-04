<script lang="ts">
	import Modal from '$lib/components/Modal.svelte';
	import { Accessibility } from 'lucide-svelte';
	import { MOBILITY_EXERCISES } from '$lib/stores/entrenamiento';

	let { open = $bindable(false), trigger = null }: { open?: boolean; trigger?: HTMLElement | null } = $props();
</script>

<Modal
	bind:open
	title="Estiramientos y Movilidad"
	subtitle="Flexibilidad y descarga articular"
	{trigger}
	closeLabel="Cerrar modal"
>
	{#snippet icon()}
		<Accessibility class="w-5 h-5" />
	{/snippet}

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
		onclick={() => (open = false)}
		class="w-full py-3 bg-black text-white dark:bg-white dark:text-black font-bold rounded-xl text-xs active:scale-98 transition-transform mt-1 shadow-md cursor-pointer"
	>
		Entendido, volver
	</button>
</Modal>
