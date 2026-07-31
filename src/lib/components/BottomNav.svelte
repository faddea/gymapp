<script lang="ts">
	import { page } from '$app/stores';
	import { Home, Calendar, TrendingUp, CalendarDays, User } from 'lucide-svelte';

	const navItems = [
		{ href: '/', label: 'Inicio', icon: Home },
		{ href: '/agenda', label: 'Agenda', icon: Calendar },
		{ href: '/progreso', label: 'Progreso', icon: TrendingUp },
		{ href: '/calendario', label: 'Calendario', icon: CalendarDays },
		{ href: '/perfil', label: 'Perfil', icon: User }
	];
</script>

<footer class="glass-card fixed bottom-0 z-40 w-full max-w-md left-1/2 -translate-x-1/2 px-4 py-2.5 flex items-center justify-around rounded-t-3xl border-t border-black/10 dark:border-white/10 shadow-lg backdrop-blur-md">
	{#each navItems as item}
		{@const isActive = $page.url.pathname === item.href || ($page.url.pathname.startsWith(item.href) && item.href !== '/')}
		{@const Icon = item.icon}
		<a
			href={item.href}
			class="flex flex-col items-center gap-1 py-1 px-3 transition-all duration-200 select-none {isActive
				? 'text-black dark:text-white font-bold opacity-100 scale-105'
				: 'opacity-50 hover:opacity-100'}"
		>
			<Icon class="w-5 h-5 {isActive ? 'stroke-[2.5px]' : 'stroke-2'}" />
			<span class="text-[10px] tracking-wide">{item.label}</span>
		</a>
	{/each}
</footer>
