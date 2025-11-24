<script lang="ts">
	import { isHttpError } from '@sveltejs/kit';

	const {
		error,
		retry
	}: {
		error: unknown;
		retry?: () => void;
	} = $props();

	const displayError = $derived.by((): App.Error & { status: number } => {
		if (isHttpError(error)) {
			return {
				...error.body,
				status: error.status
			};
		}

		return {
			type: 'unknown',
			message: 'An unexpected error occurred',
			status: 500
		};
	});
</script>

<div class="min-h-screen bg-white text-gray-900 p-4">
	<div class="max-w-md mx-auto">
		<h1 class="text-3xl font-light mb-6 tracking-tight">Error</h1>
		<div class="bg-gray-50 border border-gray-300 rounded-lg p-4">
			<div class="flex items-center gap-2 mb-3">
				<span
					class="bg-gray-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
				>
					{displayError.status}
				</span>
				<h2 class="text-lg font-semibold text-gray-800">
					{displayError.type === 'unknown' ? 'Unknown Error' : displayError.type}
				</h2>
			</div>
			<p class="text-gray-700">{displayError.message}</p>
		</div>
		{#if retry}
			<div class="mt-4 text-center">
				<button onclick={retry} class="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition">
					Retry
				</button>
			</div>
		{/if}
	</div>
</div>
