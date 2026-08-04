<script lang="ts">
	import { User, ShieldCheck, Flame, Dumbbell, Award, Pencil } from 'lucide-svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Input from '$lib/components/Input.svelte';
	import { pesoCorporalStore } from '$lib/stores/entrenamiento';

	let pesoBtn = $state<HTMLButtonElement | null>(null);
	let showPesoModal = $state(false);
	let pesoInput = $state<number>(78.4);

	function openPesoModal() {
		pesoInput = $pesoCorporalStore;
		showPesoModal = true;
	}

	function guardarPeso() {
		if (isNaN(pesoInput) || pesoInput <= 0) return;
		pesoCorporalStore.set(Number(pesoInput));
		showPesoModal = false;
	}
</script>

<div class="w-full flex flex-col gap-5">
	<!-- Hero / Cover Banner de Perfil -->
	<div class="glass-card rounded-2xl overflow-hidden shadow-lg relative flex flex-col">
		<!-- Imagen de Portada -->
		<div class="w-full h-28 relative overflow-hidden">
			<img
				src="/images/unnamed22.jpg"
				alt="Portada Perfil"
				class="object-cover object-[0%_35%] w-full h-full grayscale dark:grayscale-0 contrast-110"
			/>
			<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
			<span class="absolute top-3 right-3 text-[10px] font-extrabold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-white">
				Nivel Avanzado
			</span>
		</div>

		<!-- Información de Atleta con Avatar Flotante -->
		<div class="px-5 pb-5 pt-0 relative flex flex-col items-center text-center -mt-10">
			<!-- Avatar con marco translúcido -->
			<div class="relative group">
				<div class="w-20 h-20 rounded-full overflow-hidden border-2 border-white dark:border-neutral-900 shadow-xl bg-neutral-800 ring-4 ring-black/10 dark:ring-white/10">
					<img
						src="/icons/images.jpeg"
						alt="Foto de Perfil Atleta"
						class="object-cover w-full h-full"
					/>
				</div>
				<div class="absolute bottom-0 right-0 p-1 bg-black text-white dark:bg-white dark:text-black rounded-full border border-white/20 shadow-md">
					<Award class="w-3.5 h-3.5" />
				</div>
			</div>

			<div class="mt-2.5">
				<h3 class="font-extrabold text-lg tracking-tight">Atleta ITRAIN</h3>
				<span class="text-xs opacity-60 font-medium">Enfocado en Hipertrofia & Sobrecarga Progresiva</span>
			</div>
		</div>
	</div>

	<!-- Métricas Generales -->
	<div class="glass-card p-4 rounded-2xl space-y-3">
		<h4 class="font-bold text-xs uppercase tracking-wider opacity-60 mb-1">Métricas Generales</h4>
		
		<button
			bind:this={pesoBtn}
			onclick={openPesoModal}
			class="w-full flex justify-between items-center text-xs border-b pb-2.5 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 px-1 -mx-1 rounded-lg active:scale-[0.99] transition-all cursor-pointer"
		>
			<span class="opacity-70 font-medium flex items-center gap-2">
				<Dumbbell class="w-4 h-4" /> Peso Corporal
			</span>
			<span class="font-extrabold flex items-center gap-1.5">
				{$pesoCorporalStore} kg
				<Pencil class="w-3.5 h-3.5 opacity-50" />
			</span>
		</button>
		
		<div class="flex justify-between items-center text-xs border-b pb-2.5 border-black/10 dark:border-white/10">
			<span class="opacity-70 font-medium flex items-center gap-2">
				<Flame class="w-4 h-4 text-orange-500" /> Racha Activa
			</span>
			<span class="font-extrabold">4 Semanas consecutivas</span>
		</div>
		
		<div class="flex justify-between items-center text-xs">
			<span class="opacity-70 font-medium flex items-center gap-2">
				<ShieldCheck class="w-4 h-4 text-emerald-500" /> Frecuencia
			</span>
			<span class="font-extrabold">3-4 días / semana</span>
		</div>
	</div>

	<!-- Ajustes -->
	<div class="glass-card p-4 rounded-2xl flex items-center justify-between">
		<div>
			<span class="block font-bold text-xs tracking-tight">Preferencia de Tema</span>
			<span class="text-[11px] opacity-60">Cambia entre claro y oscuro</span>
		</div>
		<ThemeToggle />
	</div>
</div>

<!-- Modal: editar peso corporal -->
<Modal bind:open={showPesoModal} title="Editar peso corporal" eyebrow="Métricas" trigger={pesoBtn}>
	<Input
		label="Peso actual (kg)"
		type="number"
		bind:value={pesoInput}
		step={0.1}
		stepper
	/>

	<button
		onclick={guardarPeso}
		disabled={isNaN(pesoInput) || pesoInput <= 0}
		class="w-full py-3.5 bg-black text-white dark:bg-white dark:text-black font-extrabold rounded-xl text-sm active:scale-98 transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
	>
		Guardar peso
	</button>
</Modal>
