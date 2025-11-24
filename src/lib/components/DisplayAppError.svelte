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

<div class="min-h-screen bg-gray-900 text-white p-4">
	<div class="max-w-md mx-auto">
		<h1 class="text-2xl mb-4">Error</h1>
		<div class="bg-red-900/50 border border-red-700 rounded-lg p-4">
			<div class="flex items-center gap-2 mb-2">
				<span
					class="bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold"
				>
					{displayError.status}
				</span>
				<h2 class="text-lg font-semibold">
					{displayError.type === 'unknown' ? 'Unknown Error' : displayError.type}
				</h2>
			</div>
			<p class="text-red-200">{displayError.message}</p>
		</div>
		{#if retry}
			<div class="mt-4 text-center">
				<button onclick={retry} class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
					Retry
				</button>
			</div>
		{/if}
	</div>
</div>
