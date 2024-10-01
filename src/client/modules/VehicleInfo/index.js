import { VehicleInfo } from "../../../shared/modules/Vehicle";

mp.events.add("render", () => {
	mp.vehicles.forEachInStreamRange((veh) => {
		if (!veh.hasVariable(VehicleInfo.VEHICLEHEALTH)) return;

		const vehicleDamaged = veh.getVariable(VehicleInfo.VEHICLEHEALTH);

		if (vehicleDamaged < 1000) {
			veh.setPetrolTankHealth(-1);
		}

		let playerPos = mp.players.local.position;
		let vehDist = mp.game.gameplay.getDistanceBetweenCoords(
			playerPos.x,
			playerPos.y,
			playerPos.z,
			veh.position.x,
			veh.position.y,
			veh.position.z,
			true,
		);
		if (vehDist > 15) return;
		mp.game.graphics.drawText(`ENGINE HEALTH: ${vehicleDamaged}`, [veh.position.x, veh.position.y, veh.position.z + 1.2], {
			font: 4,
			color: [255, 255, 255, 185],
			scale: [0.5, 0.5],
		});
	});
});
