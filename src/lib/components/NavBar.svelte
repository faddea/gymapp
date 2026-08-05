<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Settings, Trash2 } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	import Modal from './Modal.svelte';
	import Input from './Input.svelte';
	import Select from './Select.svelte';
	import { diasStore } from '$lib/stores/entrenamiento';

	let { title = 'ITRAING', subtitle = 'PROGRESO DIARIO' } = $props();

	const diaId = $derived($page.params.id);
	const dia = $derived($diasStore.find((d) => d.id === diaId));
	const enDiaAgenda = $derived(Boolean(diaId) && $page.url.pathname.startsWith('/agenda/'));

	let gearBtn = $state<HTMLButtonElement | null>(null);
	let showModal = $state(false);
	let nombreInput = $state('');
	let diaSemanaInput = $state<number | null>(null);

	const diasOpciones = [
		{ value: 1, label: 'Lunes' },
		{ value: 2, label: 'Martes' },
		{ value: 3, label: 'Miércoles' },
		{ value: 4, label: 'Jueves' },
		{ value: 5, label: 'Viernes' },
		{ value: 6, label: 'Sábado' },
		{ value: 0, label: 'Domingo' }
	];

	function openModal() {
		if (!dia) return;
		nombreInput = dia.nombre;
		diaSemanaInput = dia.diaSemana ?? 1;
		showModal = true;
	}

	function guardarDia() {
		if (!diaId || !nombreInput.trim()) return;
		diasStore.update((dias) =>
			dias.map((d) =>
				d.id === diaId
					? { ...d, nombre: nombreInput.trim(), diaSemana: diaSemanaInput ?? d.diaSemana }
					: d
			)
		);
		showModal = false;
	}

	function eliminarDia() {
		if (!diaId) return;
		diasStore.update((dias) => dias.filter((d) => d.id !== diaId));
		showModal = false;
		goto('/agenda');
	}
</script>

<nav class="glass-card sticky top-0 z-40 w-full px-6 py-3.5 flex items-center justify-between rounded-b-2xl border-b border-black/5 dark:border-white/10 shadow-sm">
	<div class="flex flex-col">
		<span class="text-[10px] font-bold tracking-wider opacity-60 uppercase">{subtitle}</span>
		<h1 class="text-xl font-extrabold tracking-tight uppercase">{title}</h1>
	</div>
	<div class="flex items-center gap-1.5">
		{#if enDiaAgenda}
			<button
				bind:this={gearBtn}
				type="button"
				onclick={openModal}
				aria-label="Editar día"
				class="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
			>
				<Settings class="w-4 h-4" />
			</button>
		{/if}
		<ThemeToggle />
	</div>
</nav>

{#if enDiaAgenda}
	<Modal bind:open={showModal} title="Editar día" eyebrow="Agenda" trigger={gearBtn}>
		<Input
			label="Nombre del día"
			bind:value={nombreInput}
			placeholder="Ej: Push Day, Espalda, Piernas..."
		/>

		<Select label="Día asignado" bind:value={diaSemanaInput} options={diasOpciones} />

		<button
			onclick={guardarDia}
			disabled={!nombreInput.trim()}
			class="w-full py-3.5 bg-black text-white dark:bg-white dark:text-black font-extrabold rounded-xl text-sm active:scale-98 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
		>
			Guardar cambios
		</button>

		<button
			onclick={eliminarDia}
			class="w-full py-3 flex items-center justify-center gap-2 bg-red-500/10 text-red-500 font-bold rounded-xl text-sm active:scale-98 transition-all cursor-pointer"
		>
			<Trash2 class="w-4 h-4" />
			Eliminar día
		</button>
	</Modal>
{/if}
