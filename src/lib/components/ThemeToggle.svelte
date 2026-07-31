<script lang="ts">
	import { Sun, Moon } from 'lucide-svelte';
	import { themeStore } from '$lib/stores/entrenamiento';
</script>

<button
	id="theme-toggle"
	onclick={() => themeStore.toggle()}
	aria-label="Cambiar modo de tema"
	class="text-xs font-semibold flex items-center gap-1.5 px-2.5 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer select-none"
>
	<Sun class="w-4 h-4 block dark:hidden text-amber-500" />
	<Moon class="w-4 h-4 hidden dark:block text-white" />
	<span class="tracking-wide">Modo</span>
</button>
