class Hint {
	private _dimension: number;
	// @ts-ignore
	private _sprite: number;
	private _position: Vector3Mp;
	private _colshape: ColshapeMp;
	private _blip: BlipMp;

	constructor(dimension: number, sprite: number, position: Vector3Mp) {
		this._dimension = dimension;
		this._sprite = sprite;
		this._position = position;
	}

	get dimension() {
		return this._dimension;
	}

	set dimension(value: number) {
		if (this._dimension === value) {
			return;
		}

		this._dimension = value;
	}

	get position() {
		return this._position;
	}

	get colshape() {
		return this._colshape;
	}

	set colshape(value) {
		this._colshape = value;
	}

	get blip() {
		return this._blip;
	}

	set blip(value) {
		this._blip = value;
	}
}

export default Hint;