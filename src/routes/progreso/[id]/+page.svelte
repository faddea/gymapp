<script lang="ts">
	import { page } from '$app/stores';
	import { diasStore, actualizarPesosEjercicio, modoEntrenamientoStore } from '$lib/stores/entrenamiento';
	import Modal from '$lib/components/Modal.svelte';
	import Input from '$lib/components/Input.svelte';
	import { ArrowLeft, Save, Dumbbell, TrendingUp } from 'lucide-svelte';
	import { formatearCarga } from '$lib/utils/carga';
	import type { Ejercicio } from '$lib/types';

	const diaId = $derived($page.params.id);
	const dia = $derived($diasStore.find((d) => d.id === diaId));
	const esHome = $derived($modoEntrenamientoStore === 'home');

	let showModal = $state(false);
	let selectedEjercicio = $state<Ejercicio | null>(null);
	let pesoRealizadoInput = $state<number>(0);
	let pesoObjetivoInput = $state<number>(0);
	let pesoRealizadoTextoInput = $state('');
	let pesoObjetivoTextoInput = $state('');
	let modalTrigger = $state<HTMLElement | null>(null);

	function openModal(ej: Ejercicio, trigger?: HTMLElement) {
		selectedEjercicio = ej;
		pesoRealizadoInput = ej.series[0]?.pesoActual || 0;
		pesoObjetivoInput = ej.series[0]?.pesoObjetivo || 0;
		pesoRealizadoTextoInput = ej.series[0]?.pesoActualTexto || '';
		pesoObjetivoTextoInput = ej.series[0]?.pesoObjetivoTexto || '';
		modalTrigger = trigger ?? null;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		selectedEjercicio = null;
	}

	function handleSave() {
		if (!diaId || !selectedEjercicio) return;
		const textoRealizado = esHome ? pesoRealizadoTextoInput.trim() : undefined;
		const textoObjetivo = esHome ? pesoObjetivoTextoInput.trim() : undefined;
		actualizarPesosEjercicio(diaId, selectedEjercicio.id, pesoRealizadoInput, pesoObjetivoInput, textoRealizado, textoObjetivo);
		closeModal();
	}
</script>

{#if !dia}
	<div class="w-full flex flex-col items-center gap-4 text-center mt-10">
		<p class="font-bold text-base opacity-70">El día de entrenamiento no existe.</p>
		<a
			href="/progreso"
			class="px-4 py-2 bg-black text-white dark:bg-white dark:text-black font-bold text-xs rounded-xl flex items-center gap-2"
		>
			<ArrowLeft class="w-4 h-4" /> Volver a Progreso
		</a>
	</div>
{:else}
	<div class="w-full flex flex-col gap-5">
		<!-- Header -->
		<div class="flex items-center gap-3 border-b pb-3 border-black/10 dark:border-white/10">
			<a
				href="/progreso"
				class="p-2 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 active:scale-95 transition-all"
				aria-label="Volver a Progreso"
			>
				<ArrowLeft class="w-5 h-5" />
			</a>
			<div>
				<h2 class="text-2xl font-extrabold tracking-tight">{dia.nombre}</h2>
				<p class="text-xs opacity-60 font-medium">Toca un ejercicio para actualizar marcas</p>
			</div>
		</div>

		<!-- Lista de ejercicios -->
		{#if dia.ejercicios.length === 0}
			<div class="glass-card rounded-2xl p-8 flex flex-col items-center text-center gap-3 opacity-60 mt-2">
				<div class="w-12 h-12 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
					<Dumbbell class="w-6 h-6 opacity-60" />
				</div>
				<div>
					<p class="font-bold text-sm">Sin ejercicios en este día</p>
					<p class="text-xs opacity-70 mt-0.5">Agrega ejercicios desde la pestaña Agenda.</p>
				</div>
			</div>
		{:else}
			<div class="flex flex-col gap-3.5 w-full">
				{#each dia.ejercicios as ej}
					<button
						onclick={(e) => openModal(ej, e.currentTarget as HTMLElement)}
						class="glass-card rounded-2xl p-4 flex flex-col gap-2.5 text-left border-l-4 border-l-black dark:border-l-white hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer group"
					>
						<div class="flex justify-between items-center w-full">
							<span class="font-extrabold text-base tracking-tight">{ej.nombre}</span>
							<span class="text-[10px] font-extrabold px-2 py-0.5 bg-black/10 dark:bg-white/10 rounded-md">
								2 Series
							</span>
						</div>

						<div class="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-black/5 dark:border-white/5">
							<div class="p-2 rounded-xl bg-black/5 dark:bg-white/5 flex flex-col">
								<span class="text-[10px] opacity-60 font-bold uppercase">{esHome ? 'Carga Realizada' : 'Peso Realizado'}</span>
								<span class="font-extrabold text-sm">{formatearCarga(ej.series[0], 'actual', $modoEntrenamientoStore)}</span>
							</div>

							<div class="p-2 rounded-xl bg-black/5 dark:bg-white/5 flex flex-col">
								<span class="text-[10px] opacity-60 font-bold uppercase">Objetivo Próxima Sem.</span>
								<span class="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">
									{formatearCarga(ej.series[0], 'objetivo', $modoEntrenamientoStore)}
								</span>
							</div>
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</div>
{/if}

<!-- Modal para actualizar peso del ejercicio -->
<Modal bind:open={showModal} title={selectedEjercicio?.nombre ?? ''} eyebrow="Registrar Pesos" trigger={modalTrigger}>
	<div class="flex flex-col gap-4">
		{#if esHome}
			<Input
				label="Carga realizada hoy"
				bind:value={pesoRealizadoTextoInput}
				placeholder="Ej: balde + pesa + disco"
			/>

			<Input
				label="Carga a superar la próxima semana"
				bind:value={pesoObjetivoTextoInput}
				placeholder="Ej: balde + 2 discos"
			/>
		{:else}
			<Input
				label="Peso realizado hoy (kg)"
				type="number"
				bind:value={pesoRealizadoInput}
				step={0.5}
				stepper
			/>

			<Input
				label="Peso a superar la próxima semana (kg)"
				type="number"
				bind:value={pesoObjetivoInput}
				step={0.5}
				stepper
			/>
		{/if}
	</div>

	<button
		onclick={handleSave}
		class="w-full py-3.5 bg-black text-white dark:bg-white dark:text-black font-extrabold rounded-xl text-sm active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
	>
		<Save class="w-4 h-4" />
		<span>Guardar progreso</span>
	</button>
</Modal>
