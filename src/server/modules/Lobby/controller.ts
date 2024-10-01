import LobbyHandler, { lobbyList } from "@/modules/Lobby/LobbyHandler";
import rpc from "rage-rpc";
import { LobbyEvents } from "@shared/modules/Lobby";
import { VehicleInfo } from "@shared/modules/Vehicle";
import Lobby from "@/modules/Lobby/Lobby";
import UpgradeModHandler from "@/modules/VehicleAction/Upgrade/UpgradeModHandler";
import RepairHandler from "@/modules/VehicleAction/Repair/RepairHandler";

type CreateDto = {
	id: number;
	name: string;
	mapId: number;
	amountOfPlayers: number;
	amountOfWinners: number;
	vehicleName: string;
};

class LobbyController {
	constructor() {
		mp.events.add({
			playerExitVehicle: this.OnExitVehicle.bind(this),
			playerDeath: this.OnPlayerDeath.bind(this),
			vehicleDamage: this.OnVehicleDamage.bind(this),
			vehicleDeath: this.OnVehicleDeath.bind(this),
			playerEnterColshape: this.OnEnterColshape.bind(this)
		});

		rpc.register(LobbyEvents.CreateLobby, this.CreateLobby.bind(this));
	}

	private CreateLobby(createDto: CreateDto) {
		LobbyHandler.create(createDto.id, createDto.name, createDto.mapId, createDto.amountOfPlayers, createDto.amountOfWinners, createDto.vehicleName);
	}

	// @ts-ignore
	private OnExitVehicle(player: PlayerMp, vehicle: VehicleMp): void {
		if (player.lobbyId != -1) {
			LobbyHandler.kill(player);
		}
	}

	// @ts-ignore
	private OnPlayerDeath(player: PlayerMp, reason: string, killer: PlayerMp): void {
		if (player.lobbyId != -1) {
			LobbyHandler.kill(player);
		}
	}

	// @ts-ignore
	private OnVehicleDamage(vehicle: VehicleMp, bodyHealthLoss: number, engineHealthLoss: number): void {
		vehicle.setVariable(VehicleInfo.VEHICLEHEALTH, vehicle.engineHealth);

		let player = mp.players.toArray().find((player) => player.vehicle == vehicle);

		if (vehicle.engineHealth <= 900) {
			LobbyHandler.kill(player);
			return;
		}

		player.notify("~r~Срочно почините машину");
	}

	private OnVehicleDeath(vehicle: VehicleMp): void {
		vehicle.destroy();

		let player = mp.players.toArray().find((player) => player.vehicle == vehicle);
		LobbyHandler.kill(player);
	}

	private OnEnterColshape(player: PlayerMp, colshape: ColshapeMp) {
		if (player.lobbyId == -1) return;

		let lobby: Lobby = lobbyList.get(player.lobbyId);

		if (!player.vehicle) return;

		if (colshape == lobby.mapInfo.upgradeColshape) {
			new UpgradeModHandler(player.vehicle, 1, 1).upgrade();
		} else if (colshape == lobby.mapInfo.repairColshape) {
			new RepairHandler(player.vehicle).repair();
		}

		LobbyHandler.loadHints(lobby.id);
	}
}

export default LobbyController;
