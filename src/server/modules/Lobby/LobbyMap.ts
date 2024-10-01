class LobbyMap {
	readonly name: string;
	readonly mapPosition: Vector3Mp;

	private _repairColshape: ColshapeMp;
	private _upgradeColshape: ColshapeMp;

	spawnPosition: Map<number, Vector3Mp>
	repairPositions: Map<number, Vector3Mp>
	upgradePositions: Map<number, Vector3Mp>

	constructor(name: string, mapPosition: Vector3Mp,
							spawnPosition: Map<number, Vector3Mp>,
							repairPosition: Map<number, Vector3Mp>,
							upgradePosition: Map<number, Vector3Mp>) {
		this.name = name;
		this.mapPosition = mapPosition;
		this.spawnPosition = spawnPosition;
		this.repairPositions = repairPosition;
		this.upgradePositions = upgradePosition;
	}

	get repairColshape() {
		return this._repairColshape;
	}

	set repairColshape(value: ColshapeMp) {
		this._repairColshape = value;
	}

	get upgradeColshape() {
		return this._upgradeColshape;
	}

	set upgradeColshape(value: ColshapeMp) {
		this._upgradeColshape = value;
	}
}

export default LobbyMap;
