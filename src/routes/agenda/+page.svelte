<script lang="ts">
	import { diasStore } from '$lib/stores/entrenamiento';
	import { Plus, X, ChevronRight } from 'lucide-svelte';
	import type { Dia } from '$lib/types';

	let showModal = $state(false);
	let nombreInput = $state('');
	let diaSemanaInput = $state<number>(1);

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

	function closeModal() {
		showModal = false;
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
		closeModal();
	}

	function eliminarDia(id: string) {
		diasStore.update((dias) => dias.filter((d) => d.id !== id));
	}

	const diasNombres: Record<number, string> = {
		0: 'Domingo', 1: 'Lunes', 2: 'Martes',
		3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado'
	};
</script>

<div class="w-full flex flex-col gap-5">

	<!-- Header -->
	<div class="flex items-end justify-between">
		<div>
			<h2 class="text-2xl font-extrabold tracking-tight">Agenda</h2>
			<p class="text-xs opacity-60 font-medium">Planifica y edita tus días de entreno</p>
		</div>
		<button
			onclick={openModal}
			class="p-2.5 bg-black text-white dark:bg-white dark:text-black rounded-xl font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow-md"
		>
			<Plus class="w-4 h-4" />
			<span>Nuevo día</span>
		</button>
	</div>

	<!-- Lista de cards de días -->
	{#if $diasStore.length === 0}
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
{#if showModal}
	<div
		class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center"
		onclick={closeModal}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Escape' && closeModal()}
	>
		<div
			class="glass-card bg-white/95 dark:bg-neutral-950/95 text-black dark:text-white w-full max-w-md rounded-t-3xl p-6 flex flex-col gap-5 border-t border-black/10 dark:border-white/10 shadow-2xl"
			onclick={(e) => e.stopPropagation()}
			role="document"
		>
			<!-- Handle -->
			<div class="w-10 h-1 bg-black/20 dark:bg-white/20 rounded-full mx-auto -mt-1"></div>

			<!-- Título del modal -->
			<div class="flex justify-between items-center">
				<h3 class="font-extrabold text-lg tracking-tight">Nuevo día de entreno</h3>
				<button
					onclick={closeModal}
					class="p-1.5 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 active:scale-95 transition-all"
					aria-label="Cerrar"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Campos del form -->
			<div class="flex flex-col gap-4">
				<!-- Nombre del día -->
				<div class="flex flex-col gap-1.5">
					<label for="nombre-dia" class="text-xs font-bold uppercase tracking-wider opacity-60">
						Nombre del día
					</label>
					<input
						id="nombre-dia"
						type="text"
						bind:value={nombreInput}
						placeholder="Ej: Push Day, Espalda, Piernas..."
						class="w-full p-3 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-sm font-semibold placeholder:opacity-40 focus:outline-none focus:ring-2 focus:ring-black/30 dark:focus:ring-white/30 transition-all"
						onkeydown={(e) => e.key === 'Enter' && guardarDia()}
					/>
				</div>

				<!-- Día de la semana -->
				<div class="flex flex-col gap-1.5">
					<label for="dia-semana" class="text-xs font-bold uppercase tracking-wider opacity-60">
						Día asignado
					</label>
					<select
						id="dia-semana"
						bind:value={diaSemanaInput}
						class="w-full p-3 rounded-xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-black/30 dark:focus:ring-white/30 transition-all appearance-none cursor-pointer"
					>
						{#each diasOpciones as op}
							<option value={op.value}>{op.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Botón guardar -->
			<button
				onclick={guardarDia}
				disabled={!nombreInput.trim()}
				class="w-full py-3.5 bg-black text-white dark:bg-white dark:text-black font-extrabold rounded-xl text-sm active:scale-98 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
			>
				Guardar día
			</button>
		</div>
	</div>
{/if}
