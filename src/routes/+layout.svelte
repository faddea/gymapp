<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/components/NavBar.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>HyperHome - Control de Hipertrofia</title>
</svelte:head>

<div class="min-h-screen flex flex-col bg-white text-black dark:bg-black dark:text-white transition-colors duration-300 antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
	<div class="w-full max-w-md mx-auto min-h-screen flex flex-col relative pb-24 shadow-2xl">
		<NavBar />
		
		<main class="flex-grow p-6 flex flex-col items-center gap-6 w-full">
			{@render children()}
		</main>

		<BottomNav />
	</div>
</div>
