<script lang="ts">
	import { X } from 'lucide-svelte';

	let {
		open = $bindable(false),
		title = '',
		eyebrow = '',
		subtitle = '',
		trigger = null,
		closeLabel = 'Cerrar',
		icon,
		children
	}: {
		open?: boolean;
		title?: string;
		eyebrow?: string;
		subtitle?: string;
		trigger?: HTMLElement | null;
		closeLabel?: string;
		icon?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	} = $props();

	let originX = $state(0);
	let originY = $state(0);
	let started = $state(false);

	$effect(() => {
		if (open) {
			originX = 0;
			originY = 0;
			if (trigger) {
				const rect = trigger.getBoundingClientRect();
				originX = rect.left + rect.width / 2 - window.innerWidth / 2;
				originY = rect.top + rect.height / 2 - window.innerHeight / 2;
			}
			requestAnimationFrame(() => (started = true));
		} else {
			started = false;
		}
	});
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
		<button
			type="button"
			class="fixed inset-0 bg-black/50 backdrop-blur-sm cursor-default w-full h-full border-none outline-none"
			onclick={() => (open = false)}
			onkeydown={(e) => e.key === 'Escape' && (open = false)}
			aria-label={closeLabel}
		></button>

		<div
			class="modal-panel glass-card bg-white/95 dark:bg-neutral-950/95 text-black dark:text-white w-full max-w-md rounded-3xl p-6 flex flex-col gap-5 border border-black/10 dark:border-white/10 shadow-2xl relative z-10"
			class:started
			style="transform-origin: calc(50% + {originX}px) calc(50% + {originY}px);"
			role="document"
		>
			<div class="flex justify-between items-center border-b pb-3 border-black/10 dark:border-white/10">
				<div class="flex items-center gap-2.5">
					{#if icon}
						<div class="p-2 rounded-lg bg-black/5 dark:bg-white/10">
							{@render icon()}
						</div>
					{/if}
					<div class="flex flex-col gap-0.5">
						{#if eyebrow}
							<span class="text-[10px] font-extrabold uppercase tracking-wider opacity-60">{eyebrow}</span>
						{/if}
						<h3 class="font-extrabold text-lg tracking-tight">{title}</h3>
						{#if subtitle}
							<p class="text-[11px] opacity-60">{subtitle}</p>
						{/if}
					</div>
				</div>
				<button
					onclick={() => (open = false)}
					class="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
					aria-label="Cerrar"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			{@render children?.()}
		</div>
	</div>
{/if}

<style>
	.modal-panel {
		opacity: 0;
		transform: scale(0.55);
	}

	.modal-panel.started {
		opacity: 1;
		transform: scale(1);
		transition: transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out;
	}
</style>
