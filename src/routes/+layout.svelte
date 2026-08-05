<script lang="ts">
	import '../app.css';
	import NavBar from '$lib/components/NavBar.svelte';
	import BottomNav from '$lib/components/BottomNav.svelte';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>ITRAIN - Control de Hipertrofia</title>
</svelte:head>

<div class="min-h-screen flex flex-col transition-colors duration-300 antialiased pt-[env(safe-area-inset-top)]">
	<div class="w-full max-w-md mx-auto min-h-screen flex flex-col relative pb-[calc(6rem+env(safe-area-inset-bottom))] shadow-2xl">
		<NavBar />
		
		<main class="flex-grow p-6 flex flex-col items-center gap-6 w-full">
			{@render children()}
		</main>

		<BottomNav />
	</div>
</div>
