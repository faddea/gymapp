<script lang="ts">
	import { page } from '$app/stores';
	import { diasStore, agregarEjercicio, editarEjercicio, eliminarEjercicio } from '$lib/stores/entrenamiento';
	import Modal from '$lib/components/Modal.svelte';
	import Input from '$lib/components/Input.svelte';
	import { ArrowLeft, Plus, Pencil, Trash2, Dumbbell } from 'lucide-svelte';
	import type { Ejercicio } from '$lib/types';

	const diaId = $derived($page.params.id);
	const dia = $derived($diasStore.find((d) => d.id === diaId));

	let showModal = $state(false);
	let isEditing = $state(false);
	let currentEjercicioId = $state('');
	let nombreInput = $state('');
	let pesoActualInput = $state<number>(0);
	let pesoObjetivoInput = $state<number>(0);

	let createBtn = $state<HTMLButtonElement | null>(null);
	let modalTrigger = $state<HTMLElement | null>(null);

	const diasNombres: Record<number, string> = {
		0: 'Domingo', 1: 'Lunes', 2: 'Martes',
		3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado'
	};

	function openModalForCreate() {
		isEditing = false;
		currentEjercicioId = '';
		nombreInput = '';
		pesoActualInput = 0;
		pesoObjetivoInput = 0;
		modalTrigger = createBtn;
		showModal = true;
	}

	function openModalForEdit(ej: Ejercicio, trigger?: HTMLElement) {
		isEditing = true;
		currentEjercicioId = ej.id;
		nombreInput = ej.nombre;
		pesoActualInput = ej.series[0]?.pesoActual || 0;
		pesoObjetivoInput = ej.series[0]?.pesoObjetivo || 0;
		modalTrigger = trigger ?? createBtn;
		showModal = true;
	}

	function handleSubmit() {
		if (!nombreInput.trim() || !diaId) return;

		if (isEditing && currentEjercicioId) {
			editarEjercicio(diaId, currentEjercicioId, nombreInput, pesoActualInput, pesoObjetivoInput);
		} else {
			agregarEjercicio(diaId, nombreInput, pesoActualInput, pesoObjetivoInput);
		}
		showModal = false;
	}

	function handleDelete(ejId: string) {
		if (!diaId) return;
		eliminarEjercicio(diaId, ejId);
	}
</script>

	<!-- Portada estilo Notion -->
<div class="w-full h-48 glass-card rounded-2xl overflow-hidden relative group shadow-md">
    <img
        src="/images/baki/unnamed9.jpg"
        alt="Portada Agenda"
        class="object-cover object-[0%_32%] w-full h-full grayscale dark:grayscale-0 contrast-110"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>
    <div class="absolute bottom-3 left-4 right-4 text-white">
        <span class="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
            Planificación & Rutinas
        </span>
        <h2 class="text-xl font-extrabold tracking-tight text-white mt-1">Agenda</h2>
    </div>
</div>

{#if !dia}
	<div class="w-full flex flex-col items-center gap-4 text-center mt-10">
		<p class="font-bold text-base opacity-70">El día de entrenamiento no existe o fue eliminado.</p>
		<a
			href="/agenda"
			class="px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-bold text-xs rounded-xl flex items-center gap-2"
		>
			<ArrowLeft class="w-4 h-4" /> Volver a Agenda
		</a>
	</div>
{:else}
	<div class="w-full flex flex-col gap-5">
		<!-- Header con volver y título -->
		<div class="flex items-center justify-between border-b pb-3 border-black/10 dark:border-white/10">
			<div class="flex items-center gap-3">
				<a
					href="/agenda"
					class="p-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 transition-all"
					aria-label="Volver a Agenda"
				>
					<ArrowLeft class="w-5 h-5" />
				</a>
				<div>
					<h2 class="text-2xl font-extrabold tracking-tight">{dia.nombre}</h2>
					{#if dia.diaSemana !== undefined}
						<span class="text-xs opacity-60 font-medium">Asignado a: {diasNombres[dia.diaSemana]}</span>
					{/if}
				</div>
			</div>

			<button
				bind:this={createBtn}
				onclick={openModalForCreate}
				class="p-2.5 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
			>
				<Plus class="w-4 h-4" />
				<span>Ejercicio</span>
			</button>
		</div>

		<!-- Lista de Ejercicios del Día -->
		{#if dia.ejercicios.length === 0}
			<div class="glass-card rounded-2xl p-8 flex flex-col items-center text-center gap-3 opacity-60 mt-2">
				<div class="w-12 h-12 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
					<Dumbbell class="w-6 h-6 opacity-60" />
				</div>
				<div>
					<p class="font-bold text-sm">Sin ejercicios agregados</p>
					<p class="text-xs opacity-70 mt-0.5">Toca el botón "+ Ejercicio" para añadir el primero.</p>
				</div>
			</div>
		{:else}
			<div class="flex flex-col gap-3.5 w-full">
				{#each dia.ejercicios as ej}
					<div class="glass-card rounded-2xl p-4 flex items-center justify-between border-l-4 border-l-black dark:border-l-white">
						<div class="flex flex-col gap-1">
							<span class="font-extrabold text-base tracking-tight">{ej.nombre}</span>
							<div class="flex items-center gap-2 text-xs opacity-75">
								<span class="font-bold px-2 py-0.5 bg-black/10 dark:bg-white/10 rounded-md">2 Series</span>
								<span>•</span>
								<span>Peso actual: <strong>{ej.series[0]?.pesoActual || 0} kg</strong></span>
								<span>•</span>
								<span>Objetivo: <strong>{ej.series[0]?.pesoObjetivo || 0} kg</strong></span>
							</div>
						</div>

						<div class="flex items-center gap-1">
							<button
								onclick={(e) => openModalForEdit(ej, e.currentTarget as HTMLElement)}
								class="p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-black/70 dark:text-white/70 active:scale-90 transition-all"
								aria-label="Editar ejercicio"
							>
								<Pencil class="w-4 h-4" />
							</button>
							<button
								onclick={() => handleDelete(ej.id)}
								class="p-2 rounded-lg hover:bg-red-500/10 text-red-500 active:scale-90 transition-all"
								aria-label="Eliminar ejercicio"
							>
								<Trash2 class="w-4 h-4" />
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<!-- Modal: Agregar / Editar Ejercicio -->
<Modal
	bind:open={showModal}
	title={isEditing ? 'Editar ejercicio' : 'Nuevo ejercicio'}
	trigger={modalTrigger}
>
	<div class="flex flex-col gap-4">
		<Input
			label="Nombre del ejercicio"
			bind:value={nombreInput}
			placeholder="Ej: Press banca, Sentadillas, Flexiones..."
			onenter={handleSubmit}
		/>

		<div class="grid grid-cols-2 gap-3">
			<Input
				label="Peso actual (kg)"
				type="number"
				bind:value={pesoActualInput}
				step={0.5}
				stepper
			/>

			<Input
				label="Peso objetivo (kg)"
				type="number"
				bind:value={pesoObjetivoInput}
				step={0.5}
				stepper
			/>
		</div>
	</div>

	<button
		onclick={handleSubmit}
		disabled={!nombreInput.trim()}
		class="w-full py-3.5 bg-black text-white dark:bg-white dark:text-black font-extrabold rounded-xl text-sm active:scale-98 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
	>
		{isEditing ? 'Guardar cambios' : 'Agregar ejercicio'}
	</button>
</Modal>
