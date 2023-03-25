// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
		type Square = {
			isSquare: boolean;
			isWall: boolean;
			isOccupied: boolean;
			isStart: boolean;
			isFinish: boolean;
		}
	}
}

export {};
