import { Data, Effect, Random } from 'effect';

// this is just to make the example easier to run/see. Imagine this was a real database
class Database extends Data.Class<{
	messages: string[];
}> {}

export class DbError extends Data.TaggedError('DbError') {
	constructor(message: string, cause?: unknown) {
		super();
		this.message = message;
		this.cause = cause;
	}
}

const dbService = Effect.gen(function* () {
	const db = yield* Effect.sync(() => new Database({ messages: [] }));

	Effect.addFinalizer(() => Effect.logInfo('Cleaning up db service...'));

	return {
		getAllMessages: () =>
			Effect.gen(function* () {
				const shouldExplode = yield* Random.nextBoolean;

				if (shouldExplode) {
					yield* Effect.fail(new DbError('Database exploded'));
				}

				return yield* Effect.sync(() => db.messages);
			}),
		addMessage: (message: string) => Effect.sync(() => db.messages.push(message)),
		clearMessages: () => Effect.sync(() => (db.messages.length = 0))
	};
});

export class DbService extends Effect.Service<DbService>()('DbService', {
	scoped: dbService
}) {}
