<script lang="ts">
	let {
		options,
		value = $bindable(''),
		onchange
	}: {
		options: Array<{ value: string; label: string; icon?: any }>;
		value?: string;
		onchange?: (value: string) => void;
	} = $props();
</script>

<div
	class="w-full flex p-1 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10"
	role="radiogroup"
>
	{#each options as opt}
		<button
			type="button"
			role="radio"
			aria-checked={value === opt.value}
			onclick={() => {
				value = opt.value;
				onchange?.(opt.value);
			}}
			class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-extrabold tracking-tight transition-all cursor-pointer select-none {value === opt.value
				? 'bg-black text-white dark:bg-white dark:text-black shadow-md'
				: 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'}"
		>
			{#if opt.icon}
				{@const Icon = opt.icon}
				<Icon class="w-3.5 h-3.5" />
			{/if}
			{opt.label}
		</button>
	{/each}
</div>
