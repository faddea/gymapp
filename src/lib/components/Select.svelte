<script lang="ts">
	import { ChevronDown, Check } from 'lucide-svelte';

	let {
		label = '',
		value = $bindable(null),
		options = [] as Array<{ value: number | string; label: string }>,
		placeholder = 'Seleccionar...'
	}: {
		label?: string;
		value?: number | string | null;
		options?: Array<{ value: number | string; label: string }>;
		placeholder?: string;
	} = $props();

	let open = $state(false);

	const selected = $derived(options.find((o) => o.value === value) ?? null);

	function select(val: number | string) {
		value = val;
		open = false;
	}
</script>

<label class="flex flex-col gap-1.5">
	{#if label}
		<span class="text-xs font-bold uppercase tracking-wider opacity-60">{label}</span>
	{/if}

	<div class="relative w-full">
		<button
			type="button"
			onclick={() => (open = !open)}
			class="w-full p-3 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-sm font-semibold text-left flex items-center justify-between gap-2 focus:outline-none focus:ring-2 focus:ring-black/30 dark:focus:ring-white/30 transition-all cursor-pointer"
		>
			<span class={selected ? '' : 'opacity-40'}>{selected?.label ?? placeholder}</span>
			<ChevronDown class="w-4 h-4 opacity-40 transition-transform {open ? 'rotate-180' : ''}" />
		</button>

		{#if open}
			<button
				type="button"
				class="fixed inset-0 z-40 cursor-default w-full h-full border-none outline-none"
				onclick={() => (open = false)}
				aria-label="Cerrar selector"
			></button>

			<div
				class="absolute left-0 right-0 top-full z-50 mt-1.5 bg-white dark:bg-neutral-900 rounded-xl p-1.5 shadow-xl border border-black/10 dark:border-white/10"
				role="listbox"
			>
				{#each options as opt}
					<button
						type="button"
						onclick={() => select(opt.value)}
						class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer {opt.value === value ? 'bg-black/5 dark:bg-white/10' : ''}"
						role="option"
						aria-selected={opt.value === value}
					>
						<span>{opt.label}</span>
						{#if opt.value === value}
							<Check class="w-4 h-4 opacity-60" />
						{/if}
					</button>
				{/each}
			</div>
		{/if}
	</div>
</label>
