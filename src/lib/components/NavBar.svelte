<script lang="ts">
	import { Bell, Sliders } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let { title = 'ITRAIN', subtitle = 'PROGRESO DIARIO' } = $props();
</script>

<nav class="glass-card sticky top-0 z-40 w-full px-6 py-3.5 flex items-center justify-between rounded-b-2xl border-b border-black/5 dark:border-white/10 shadow-sm">
	<div class="flex flex-col">
		<span class="text-[10px] font-bold tracking-wider opacity-60 uppercase">{subtitle}</span>
		<h1 class="text-xl font-extrabold tracking-tight uppercase">{title}</h1>
	</div>
	<div class="flex items-center gap-1.5">
		<ThemeToggle />
	</div>
</nav>
