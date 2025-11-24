import { DbError, DbService } from '$lib/services/db';
import { error } from '@sveltejs/kit';
import { Cause, Data, Effect, Layer, ManagedRuntime } from 'effect';

class AppError extends Data.TaggedError('AppError') {
	body: App.Error;
	status: number;
	constructor(body: App.Error, status = 500) {
		super();
		this.message = body.message;
		this.cause = body.cause;
		this.body = body;
		this.status = status;
	}
}

const runtime = ManagedRuntime.make(Layer.mergeAll(DbService.Default));

export const remoteRunner = async <A>(
	effect: Effect.Effect<A, AppError | DbError, DbService>,
	traceName = ''
) => {
	const fn = Effect.fn(traceName)(function* () {
		return yield* effect;
	})();
	const result = await fn.pipe(
		Effect.catchTag('DbError', (err) =>
			Effect.fail(
				new AppError({
					type: 'db',
					message: err.message,
					cause: err.cause
				})
			)
		),
		Effect.matchCause({
			onSuccess: (res): { _type: 'success'; value: A } => ({
				_type: 'success',
				value: res
			}),
			onFailure: (cause): { _type: 'failure'; value: AppError } => {
				const failures = Array.from(Cause.failures(cause));

				if (failures.length > 0) {
					failures.forEach((failure) => {
						console.log(failure.stack);
						console.error(`FAILURE TYPE: ${failure.body.type}`);
						console.error(`FAILURE MESSAGE: ${failure.message}`);
						if (failure.cause) {
							console.error('FAILURE CAUSE', failure.cause);
						}
					});
					const first = failures[0];
					if (first) {
						return {
							_type: 'failure',
							value: first
						};
					}
				}

				return {
					_type: 'failure',
					value: new AppError(
						{
							type: 'unknown',
							message: 'An unexpected error occurred',
							cause: cause.toString()
						},
						500
					)
				};
			}
		}),
		runtime.runPromise
	);

	if (result._type === 'failure') {
		return error(result.value.status, result.value.body);
	}

	return result.value;
};
