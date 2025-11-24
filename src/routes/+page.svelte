<script lang="ts">
	import DisplayAppError from '$lib/components/DisplayAppError.svelte';
	import {
		remoteClearMessages,
		remoteGetMessages,
		remoteSendMessage
	} from '$lib/remote/messages.remote';
	import { isHttpError } from '@sveltejs/kit';

	let newMessage = $state('');

	const trimmedMessage = $derived(newMessage.trim());

	async function clearMessages() {
		try {
			await remoteClearMessages();
		} catch (e) {
			if (isHttpError(e)) {
				console.error('HTTP error:', e.body.cause);
				alert(`FAILURE: ${e.body.cause}`);
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
				alert(`FAILURE: ${e.body.cause}`);
			}
		}
	}
</script>

<div class="min-h-screen bg-gray-900 text-white p-4">
	<div class="max-w-md mx-auto">
		<h1 class="text-2xl mb-4">Messages</h1>
		<form
			class="flex gap-2 mb-4"
			onsubmit={(e) => {
				e.preventDefault();
				sendMessage();
			}}
		>
			<input
				bind:value={newMessage}
				placeholder="Type a message..."
				class="flex-1 bg-gray-800 text-white border border-gray-600 p-2 rounded"
			/>
			<button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
				Send
			</button>
			<button
				type="button"
				onclick={clearMessages}
				class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
			>
				Clear Messages
			</button>
		</form>
		<svelte:boundary>
			<ul class="space-y-2">
				{#each await remoteGetMessages() as msg}
					<li class="bg-gray-800 p-2 rounded">{msg}</li>
				{/each}
			</ul>
			{#if (await remoteGetMessages()).length === 0}
				<p>No messages yet.</p>
			{/if}
			{#snippet pending()}
				<p>Loading...</p>
			{/snippet}
			{#snippet failed(err, retry)}
				<DisplayAppError error={err} {retry} />
			{/snippet}
		</svelte:boundary>
	</div>
</div>
