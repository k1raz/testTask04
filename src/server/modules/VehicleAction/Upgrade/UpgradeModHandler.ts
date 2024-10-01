export default class UpgradeModHandler {
	private _vehicle: VehicleMp;
	private readonly _typeId: number;
	private readonly _indexId: number;

	constructor(vehicle: VehicleMp, typeId: number, indexId: number) {
		this._vehicle = vehicle;
		this._typeId = typeId;
		this._indexId = indexId;
	}

	upgrade() {
		if (this._vehicle == null) return;

		this._vehicle.setMod(this._typeId, this._indexId);
	}
}