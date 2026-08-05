<script lang="ts">
	import { page } from '$app/stores';
	import { Capacitor } from '@capacitor/core';
	import { diasStore, agregarEjercicio, editarEjercicio, eliminarEjercicio, modoEntrenamientoStore } from '$lib/stores/entrenamiento';
	import Modal from '$lib/components/Modal.svelte';
	import Input from '$lib/components/Input.svelte';
	import { ArrowLeft, Plus, Pencil, Trash2, Dumbbell, MoreVertical } from 'lucide-svelte';
	import { getDiaImagen } from '$lib/utils/imagenes';
	import type { Ejercicio } from '$lib/types';

	const diaId = $derived($page.params.id);
	const dia = $derived($diasStore.find((d) => d.id === diaId));
	const diaImagen = $derived(dia ? getDiaImagen(dia.nombre, dia.id) : '');
	const esHome = $derived($modoEntrenamientoStore === 'home');
	const esAndroid = $derived(Capacitor.getPlatform() === 'android');

	let showModal = $state(false);
	let isEditing = $state(false);
	let currentEjercicioId = $state('');
	let nombreInput = $state('');
	let pesoActualInput = $state<number>(0);
	let pesoObjetivoInput = $state<number>(0);
	let pesoActualTextoInput = $state('');
	let pesoObjetivoTextoInput = $state('');

	let createBtn = $state<HTMLButtonElement | null>(null);
	let modalTrigger = $state<HTMLElement | null>(null);

	let menuEjId = $state<string | null>(null);
	let menuPos = $state<{ x: number; y: number } | null>(null);
	let menuBtn = $state<HTMLButtonElement | null>(null);

	function toggleMenu(ejId: string, btn: HTMLButtonElement) {
		if (menuEjId === ejId) {
			closeMenu();
			return;
		}
		menuBtn = btn;
		const rect = btn.getBoundingClientRect();
		menuPos = { x: rect.right, y: rect.top };
		menuEjId = ejId;
	}

	function closeMenu() {
		menuEjId = null;
		menuPos = null;
	}

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
		pesoActualTextoInput = '';
		pesoObjetivoTextoInput = '';
		modalTrigger = createBtn;
		showModal = true;
	}

	function openModalForEdit(ej: Ejercicio, trigger?: HTMLElement) {
		isEditing = true;
		currentEjercicioId = ej.id;
		nombreInput = ej.nombre;
		pesoActualInput = ej.series[0]?.pesoActual || 0;
		pesoObjetivoInput = ej.series[0]?.pesoObjetivo || 0;
		pesoActualTextoInput = ej.series[0]?.pesoActualTexto || '';
		pesoObjetivoTextoInput = ej.series[0]?.pesoObjetivoTexto || '';
		modalTrigger = trigger ?? createBtn;
		showModal = true;
	}

	function handleSubmit() {
		if (!nombreInput.trim() || !diaId) return;

		const textoActual = esHome ? pesoActualTextoInput.trim() : undefined;
		const textoObjetivo = esHome ? pesoObjetivoTextoInput.trim() : undefined;

		if (isEditing && currentEjercicioId) {
			editarEjercicio(diaId, currentEjercicioId, nombreInput, pesoActualInput, pesoObjetivoInput, textoActual, textoObjetivo);
		} else {
			agregarEjercicio(diaId, nombreInput, pesoActualInput, pesoObjetivoInput, textoActual, textoObjetivo);
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
        src={diaImagen}
        alt={`Portada ${dia?.nombre ?? 'Día'}`}
        class="object-cover object-[0%_22%] w-full h-full grayscale dark:grayscale-0 contrast-110"
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
				{#if !esAndroid}
					<a
						href="/agenda"
						class="p-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 transition-all"
						aria-label="Volver a Agenda"
					>
						<ArrowLeft class="w-5 h-5" />
					</a>
				{/if}
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
							</div>
						</div>

						<div class="flex items-center gap-1">
							<button
								onclick={(e) => toggleMenu(ej.id, e.currentTarget as HTMLButtonElement)}
								class={[
									'p-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-black/70 dark:text-white/70 active:scale-90 transition-all cursor-pointer',
									menuEjId === ej.id ? 'bg-black/10 dark:bg-white/10' : ''
								].join(' ')}
								aria-label="Opciones del ejercicio"
								aria-expanded={menuEjId === ej.id}
							>
								<MoreVertical class="w-4 h-4" />
							</button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	{#if menuEjId && menuPos && dia}
		<button
			type="button"
			class="fixed inset-0 z-40 cursor-default bg-transparent border-none outline-none"
			onclick={closeMenu}
			onkeydown={(e) => e.key === 'Escape' && closeMenu()}
			aria-label="Cerrar menú de opciones"
		></button>

		{#each dia.ejercicios.filter((e) => e.id === menuEjId) as ej}
			<div
				class="fixed z-50 glass-card bg-white/95 dark:bg-neutral-950/95 rounded-xl p-1.5 shadow-xl min-w-[170px] flex flex-col border border-black/10 dark:border-white/10"
				style="top: {menuPos!.y}px; right: calc(100vw - {menuPos!.x}px);"
			>
				<button
					onclick={() => {
						closeMenu();
						openModalForEdit(ej, menuBtn ?? undefined);
					}}
					class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold text-left hover:bg-black/10 dark:hover:bg-white/10 active:scale-98 transition-all cursor-pointer"
				>
					<Pencil class="w-4 h-4" /> Editar
				</button>
				<button
					onclick={() => {
						closeMenu();
						handleDelete(ej.id);
					}}
					class="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold text-left text-red-500 hover:bg-red-500/10 active:scale-98 transition-all cursor-pointer"
				>
					<Trash2 class="w-4 h-4" /> Eliminar
				</button>
			</div>
		{/each}
	{/if}
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

		{#if esHome}
			<div class="grid grid-cols-2 gap-3">
				<Input
					label="Carga actual"
					bind:value={pesoActualTextoInput}
					placeholder="Ej: balde + pesa + disco"
				/>

				<Input
					label="Carga objetivo"
					bind:value={pesoObjetivoTextoInput}
					placeholder="Ej: balde + 2 discos"
				/>
			</div>
		{:else}
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
		{/if}
	</div>

	<button
		onclick={handleSubmit}
		disabled={!nombreInput.trim()}
		class="w-full py-3.5 bg-black text-white dark:bg-white dark:text-black font-extrabold rounded-xl text-sm active:scale-98 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
	>
		{isEditing ? 'Guardar cambios' : 'Agregar ejercicio'}
	</button>
</Modal>
