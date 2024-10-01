import Hint from "@/modules/Hint/Hint";

export const hintStorage = new Map<number, Hint>();

export class HintHandler {
	static create(id: number, dimension: number, sprite: number, position: Vector3Mp) {
		const hint = new Hint(dimension, sprite, position);

		hint.colshape = mp.colshapes.newCircle(hint.position.x, hint.position.y, 3, dimension);

		hint.blip = mp.blips.new(sprite, position, {
			dimension: dimension,
			shortRange: false,
			scale: 3,
			drawDistance: 10
		});

		hintStorage.set(id, hint);

		return hint;
	}

	static remove(id: number): void {
		if (hintStorage.has(id)) {
			hintStorage.get(id).colshape.destroy();
			hintStorage.get(id).blip.destroy();

			hintStorage.delete(id);
		}
	}
}
