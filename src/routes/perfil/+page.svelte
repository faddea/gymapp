<script lang="ts">
	import { User, ShieldCheck, Flame, Dumbbell } from 'lucide-svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
</script>

<div class="w-full flex flex-col gap-5">
	<div class="glass-card p-6 rounded-2xl flex flex-col items-center text-center gap-3">
		<div class="w-20 h-20 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center font-extrabold text-2xl border border-black/10 dark:border-white/15 shadow-inner">
			IT
		</div>
		<div>
			<h3 class="font-extrabold text-lg tracking-tight">Atleta ITRAIN</h3>
			<span class="text-xs opacity-60 font-medium">Enfocado en Hipertrofia & Sobrecarga Progresiva</span>
		</div>
	</div>

	<div class="glass-card p-4 rounded-2xl space-y-3">
		<h4 class="font-bold text-xs uppercase tracking-wider opacity-60 mb-1">Métricas Generales</h4>
		
		<div class="flex justify-between items-center text-xs border-b pb-2.5 border-black/10 dark:border-white/10">
			<span class="opacity-70 font-medium flex items-center gap-2">
				<Dumbbell class="w-4 h-4" /> Peso Corporal
			</span>
			<span class="font-extrabold">78.4 kg</span>
		</div>
		
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

	<div class="glass-card p-4 rounded-2xl flex items-center justify-between">
		<div>
			<span class="block font-bold text-xs tracking-tight">Preferencia de Tema</span>
			<span class="text-[11px] opacity-60">Cambia entre claro y oscuro</span>
		</div>
		<ThemeToggle />
	</div>
</div>
