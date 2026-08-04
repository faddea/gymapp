<script lang="ts">
	import { diasStore } from '$lib/stores/entrenamiento';
	import Modal from '$lib/components/Modal.svelte';
	import Input from '$lib/components/Input.svelte';
	import Select from '$lib/components/Select.svelte';
	import { Plus, ChevronRight } from 'lucide-svelte';
	import type { Dia } from '$lib/types';

	let showModal = $state(false);
	let nombreInput = $state('');
	let diaSemanaInput = $state<number>(1);

	// Referencia al botón para la animación
	let triggerBtn = $state<HTMLButtonElement | null>(null);

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
		nombreInput = '';
		diaSemanaInput = 1;
		showModal = true;
	}

	function guardarDia() {
		if (!nombreInput.trim()) return;

		const nuevo: Dia = {
			id: crypto.randomUUID(),
			nombre: nombreInput.trim(),
			diaSemana: diaSemanaInput,
			ejercicios: []
		};

		diasStore.update((dias) => [...dias, nuevo]);
		showModal = false;
	}

	const diasNombres: Record<number, string> = {
		0: 'Domingo', 1: 'Lunes', 2: 'Martes',
		3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado'
	};
</script>

<div class="w-full flex flex-col gap-5">
	<!-- Portada estilo Notion -->
	<div class="w-full h-32 glass-card rounded-2xl overflow-hidden relative group shadow-md">
		<img
			src="/images/aparte/unnamed8.jpg"
			alt="Portada Agenda"
			class="object-cover w-full h-full grayscale dark:grayscale-0 contrast-110"
		/>
		<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>
		<div class="absolute bottom-3 left-4 right-4 text-white">
			<span class="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
				Planificación & Rutinas
			</span>
			<h2 class="text-xl font-extrabold tracking-tight text-white mt-1">Agenda</h2>
		</div>
	</div>

	<!-- Control e Información -->
	<div class="flex items-center justify-between -mt-2">
		<p class="text-xs opacity-70 font-medium max-w-[200px]">
			Planifica y edita tus días de entreno para estructurar tu rutina.
		</p>
		<button
			bind:this={triggerBtn}
			onclick={openModal}
			class="p-2.5 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-md cursor-pointer"
		>
			<Plus class="w-4 h-4" />
			<span>Nuevo día</span>
		</button>
	</div>

	<!-- Lista de cards de días -->
	{#if ($diasStore ?? []).length === 0}
		<div class="glass-card rounded-2xl p-8 flex flex-col items-center text-center gap-3 opacity-60 mt-4">
			<div class="w-12 h-12 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
				<Plus class="w-6 h-6" />
			</div>
			<div>
				<p class="font-bold text-sm">Sin días creados</p>
				<p class="text-xs opacity-70 mt-0.5">Toca "Nuevo día" para empezar a armar tu rutina.</p>
			</div>
		</div>
	{:else}
		<div class="flex flex-col gap-3 w-full">
			{#each $diasStore as dia}
				<a
					href={`/agenda/${dia.id}`}
					class="glass-card rounded-2xl p-4 flex items-center justify-between border-l-4 border-l-black dark:border-l-white hover:scale-[1.01] active:scale-[0.99] transition-all group"
				>
					<div class="flex flex-col gap-0.5">
						<span class="font-extrabold text-base tracking-tight">{dia.nombre}</span>
						{#if dia.diaSemana !== undefined}
							<span class="text-[11px] opacity-60 font-medium">{diasNombres[dia.diaSemana]}</span>
						{/if}
					</div>
					<ChevronRight class="w-4 h-4 opacity-40 group-hover:opacity-80 group-hover:translate-x-0.5 transition-all" />
				</a>
			{/each}
		</div>
	{/if}
</div>

<!-- Modal: crear nuevo día -->
<Modal bind:open={showModal} title="Nuevo día de entreno" trigger={triggerBtn}>
	<div class="flex flex-col gap-4">
		<Input
			label="Nombre del día"
			bind:value={nombreInput}
			placeholder="Ej: Push Day, Espalda, Piernas..."
			onenter={guardarDia}
		/>

		<Select
			label="Día asignado"
			bind:value={diaSemanaInput}
			options={diasOpciones}
		/>
	</div>

	<!-- Botón guardar -->
	<button
		onclick={guardarDia}
		disabled={!nombreInput.trim()}
		class="w-full py-3.5 bg-black text-white dark:bg-white dark:text-black font-extrabold rounded-xl text-sm active:scale-98 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
	>
		Guardar día
	</button>
</Modal>
