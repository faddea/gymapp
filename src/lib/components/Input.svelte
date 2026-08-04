<script lang="ts">
	import { Minus, Plus } from 'lucide-svelte';

	let {
		type = 'text',
		label = '',
		placeholder = '',
		value = $bindable(''),
		step = 1,
		min = 0,
		stepper = false,
		onenter
	}: {
		type?: string;
		label?: string;
		placeholder?: string;
		value?: string | number | null;
		step?: number;
		min?: number;
		stepper?: boolean;
		onenter?: () => void;
	} = $props();

	function increment() {
		const current = typeof value === 'number' ? value : Number(value || 0);
		value = current + step;
	}

	function decrement() {
		const current = typeof value === 'number' ? value : Number(value || 0);
		value = Math.max(current - step, min);
	}
</script>

{#if label}
	<label class="flex flex-col gap-1.5">
		<span class="text-xs font-bold uppercase tracking-wider opacity-60">{label}</span>

		<div class="relative w-full">
			<input
				type={type}
				class="w-full p-3 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-sm font-semibold placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-black/30 dark:focus:ring-white/30 transition-all {stepper ? 'pr-16' : ''}"
				bind:value
				{placeholder}
				{step}
				{min}
				onkeydown={onenter ? (e) => e.key === 'Enter' && onenter() : undefined}
			/>

			{#if stepper}
				<div class="absolute inset-y-0 right-1 flex items-center gap-0.5">
					<button
						type="button"
						onclick={decrement}
						class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/10 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
						aria-label="Restar"
					>
						<Minus class="w-3.5 h-3.5 opacity-60" />
					</button>
					<button
						type="button"
						onclick={increment}
						class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/10 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
						aria-label="Sumar"
					>
						<Plus class="w-3.5 h-3.5 opacity-60" />
					</button>
				</div>
			{/if}
		</div>
	</label>
{:else}
	<div class="relative w-full">
		<input
			type={type}
			class="w-full p-3 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-sm font-semibold placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-black/30 dark:focus:ring-white/30 transition-all {stepper ? 'pr-16' : ''}"
			bind:value
			{placeholder}
			{step}
			{min}
			onkeydown={onenter ? (e) => e.key === 'Enter' && onenter() : undefined}
		/>

		{#if stepper}
			<div class="absolute inset-y-0 right-1 flex items-center gap-0.5">
				<button
					type="button"
					onclick={decrement}
					class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/10 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
					aria-label="Restar"
				>
					<Minus class="w-3.5 h-3.5 opacity-60" />
				</button>
				<button
					type="button"
					onclick={increment}
					class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-black/10 dark:hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
					aria-label="Sumar"
				>
					<Plus class="w-3.5 h-3.5 opacity-60" />
				</button>
			</div>
		{/if}
	</div>
{/if}

<style>
	input[type='number']::-webkit-outer-spin-button,
	input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	input[type='number'] {
		-moz-appearance: textfield;
		appearance: textfield;
	}
</style>
