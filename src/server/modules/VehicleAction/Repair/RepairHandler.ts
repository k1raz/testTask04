import RandomPercent from "@/modules/VehicleAction/Repair/RandomPercent";

class RepairHandler {
	private _vehicle: VehicleMp;

	constructor(vehicle: VehicleMp) {
		this._vehicle = vehicle;
	}

	repair() {
		this._vehicle.engineHealth *= this.getRandomValue();
	}

	private getRandomValue(): number {
		const values = Array.from(RandomPercent.randomPercent.values());
		const randomIndex = Math.floor(Math.random() * values.length);

		return values[randomIndex];
	}
}

export default RepairHandler;
