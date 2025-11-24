<script lang="ts">
	interface Props {
		message: string;
		type?: 'error' | 'success' | 'info';
		duration?: number;
		onDismiss?: () => void;
	}

	let { message, type = 'info', duration = 5000, onDismiss }: Props = $props();

	let visible = $state(true);

	function dismiss() {
		visible = false;
		onDismiss?.();
	}

	$effect(() => {
		if (duration > 0) {
			const timeout = setTimeout(dismiss, duration);
			return () => clearTimeout(timeout);
		}
	});

	const bgColor = {
		error: 'bg-red-50 border-red-300',
		success: 'bg-green-50 border-green-300',
		info: 'bg-blue-50 border-blue-300'
	}[type];

	const textColor = {
		error: 'text-red-800',
		success: 'text-green-800',
		info: 'text-blue-800'
	}[type];

	const iconBg = {
		error: 'bg-red-700',
		success: 'bg-green-700',
		info: 'bg-blue-700'
	}[type];

	const icon = {
		error: '!',
		success: '✓',
		info: 'i'
	}[type];
</script>

{#if visible}
	<div class="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
		<div class="flex items-center gap-3 {bgColor} border rounded-lg p-4 shadow-md max-w-sm">
			<span class="{iconBg} text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
				{icon}
			</span>
			<p class="{textColor} text-sm font-medium flex-1">{message}</p>
			<button
				onclick={dismiss}
				class="text-gray-500 hover:text-gray-700 flex-shrink-0"
				aria-label="Dismiss"
			>
				✕
			</button>
		</div>
	</div>
{/if}

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes slideInFromTop {
		from {
			transform: translateY(-1rem);
			opacity: 0;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}

	:global(.animate-in) {
		animation: fadeIn 0.3s ease-out, slideInFromTop 0.3s ease-out;
	}
</style>
