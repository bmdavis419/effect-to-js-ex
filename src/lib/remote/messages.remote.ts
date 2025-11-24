import { command, query } from '$app/server';
import { Effect, Schema } from 'effect';
import { remoteRunner } from './helper';
import { DbService } from '$lib/services/db';

export const remoteGetMessages = query(async () => {
	return await remoteRunner(
		Effect.gen(function* () {
			const db = yield* DbService;
			const messages = yield* db.getAllMessages();
			return messages;
		})
	);
});

export const remoteClearMessages = command(async () => {
	return await remoteRunner(
		Effect.gen(function* () {
			const db = yield* DbService;
			yield* db.clearMessages();
			yield* Effect.promise(() => remoteGetMessages().refresh());
			return 'Messages cleared';
		})
	);
});

const sendMessageSchema = Schema.Struct({
	message: Schema.String
}).pipe(Schema.standardSchemaV1);

export const remoteSendMessage = command(sendMessageSchema, async ({ message }) => {
	return await remoteRunner(
		Effect.gen(function* () {
			const db = yield* DbService;
			yield* db.addMessage(message);
			yield* Effect.promise(() => remoteGetMessages().refresh());
			return message;
		})
	);
});
