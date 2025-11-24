<script lang="ts">
	import DisplayAppError from '$lib/components/DisplayAppError.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import {
		remoteClearMessages,
		remoteGetMessages,
		remoteSendMessage
	} from '$lib/remote/messages.remote';
	import { isHttpError } from '@sveltejs/kit';

	let newMessage = $state('');
	let toastMessage = $state<string | null>(null);

	const trimmedMessage = $derived(newMessage.trim());

	async function clearMessages() {
		try {
			await remoteClearMessages();
		} catch (e) {
			if (isHttpError(e)) {
				console.error('HTTP error:', e.body.cause);
				toastMessage = String(e.body.cause);
			}
		}
	}

	async function sendMessage() {
		if (trimmedMessage.length === 0) return;
		try {
			await remoteSendMessage({ message: trimmedMessage });
			newMessage = '';
		} catch (e) {
			if (isHttpError(e)) {
				console.error('HTTP error:', e.body.cause);
				toastMessage = String(e.body.cause);
			}
		}
	}
</script>

<div class="min-h-screen bg-white text-gray-900 p-4">
	{#if toastMessage}
		<Toast message={toastMessage} type="error" onDismiss={() => (toastMessage = null)} />
	{/if}
	<div class="max-w-md mx-auto">
		<h1 class="text-3xl font-light mb-6 tracking-tight">Messages</h1>
		<form
			class="flex gap-2 mb-6"
			onsubmit={(e) => {
				e.preventDefault();
				sendMessage();
			}}
		>
			<input
				bind:value={newMessage}
				placeholder="Type a message..."
				class="flex-1 bg-gray-50 text-gray-900 border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
			/>
			<button
				type="submit"
				class="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
			>
				Send
			</button>
			<button
				type="button"
				onclick={clearMessages}
				class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
			>
				Clear
			</button>
		</form>
		<svelte:boundary>
			<ul class="space-y-2.5">
				{#each await remoteGetMessages() as msg}
					<li class="bg-gray-50 text-gray-800 p-3 rounded-lg border border-gray-200">{msg}</li>
				{/each}
			</ul>
			{#if (await remoteGetMessages()).length === 0}
				<p class="text-gray-500 text-center py-4">No messages yet.</p>
			{/if}
			{#snippet pending()}
				<p class="text-gray-500 text-center py-4">Loading...</p>
			{/snippet}
			{#snippet failed(err, retry)}
				<DisplayAppError error={err} {retry} />
			{/snippet}
		</svelte:boundary>
	</div>
</div>
