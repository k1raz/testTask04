import Lobby from "@/modules/Lobby/Lobby";
import LobbyInfo from "@/modules/Lobby/LobbyInfo";
import { EffectSystem, EffectType } from "@shared/modules/EffectSystem";
import { HintHandler } from "@/modules/Hint/HintHandler";
import { VehicleInfo } from "@shared/modules/Vehicle";

export const lobbyList: Map<number, Lobby> = new Map();

class LobbyHandler {
	static create(id: number, name: string, mapId: number, amountOfPlayers: number, amounOfWinners: number, vehicleName: string): Lobby {
		const lobby: Lobby = new Lobby(id, name, new LobbyInfo(amountOfPlayers, amounOfWinners), mapId, vehicleName);

		lobby.lobbyInfo.dimension = Math.floor(Math.random() * 5000);

		lobbyList.set(id, lobby);

		return lobby;
	}

	static join(player: PlayerMp, lobbyId: number): void {
		if (player == null) return;

		if (lobbyList.has(lobbyId)) {
			let lobby: Lobby = lobbyList.get(lobbyId);

			if (lobby.playerList.has(player)) return;

			player.lobbyId = lobbyId;
			lobby.playerList.add(player);

			player.notify(`~b~Вы вошли в лобби ${lobbyId}`);

			if (lobby.playerList.size >= lobby.lobbyInfo.amountOfPlayers) {
				this.start(lobbyId);

				return;
			}

			player.notify("Ожидайте остальных");
			return;
		}

		player.notify("Такого лобби ~r~не существует");
	}

	static start(lobbyId: number): void {
		if (lobbyList.has(lobbyId)) {
			let lobby: Lobby = lobbyList.get(lobbyId);

			if (lobby.lobbyInfo.amountOfPlayers != lobby.playerList.size) return;

			for (const playerInList of lobby.playerList) {
				playerInList.position = lobby.mapInfo.spawnPosition.get(0);

				setTimeout(() => {
					let vehicle = mp.vehicles.new(mp.joaat(lobby.vehicleName), playerInList.position, {
						dimension: playerInList.dimension,
						numberPlate: playerInList.name,
					});

					vehicle.setVariable(VehicleInfo.VEHICLEHEALTH, vehicle.engineHealth);

					playerInList.putIntoVehicle(vehicle, 0);

					playerInList.vehicleId = vehicle.id;
					lobby.vehicleInfo.set(vehicle.id, vehicle);

					playerInList.notify("Матч начался");
					playerInList.notify("Нанесите макс. кол-во урона другим машинам");
					playerInList.notify("Внимательно наблюдайте за своим уровнем здоровья");

					this.loadHints(lobbyId);
				}, 500);
			}
		}
	}

	static leave(player: PlayerMp): void {
		if (player == null) return;

		if (lobbyList.has(player.lobbyId)) {
			let lobby = lobbyList.get(player.lobbyId);
			lobby.playerList.delete(player);

			player.dimension = 0;
			player.position = new mp.Vector3(-26.96, 26.43, 71.97);

			player.lobbyId = -1;

			lobby.vehicleInfo.get(player.vehicleId).destroy();
			lobby.vehicleInfo.delete(player.vehicleId);

			player.notify("~r~Вы покинули лобби");

			if (lobby.playerList.size == 0) {
				this.remove(lobby.id);
				player.notify("~g~Лобби удалено");
				return;
			}

			this.result(lobby.id);
		}
	}

	static remove(id: number): void {
		if (lobbyList.has(id)) {
			let lobby: Lobby = lobbyList.get(id);

			for (const playerInList of lobby.playerList) {
				playerInList.vehicle.destroy();
				playerInList.dimension = 0;
			}

			lobbyList.delete(id);
		}
	}

	static kill(player: PlayerMp): void {
		if (player.lobbyId != -1) {
			this.leave(player);

			player.notify("~r~Вы выбыли");
			player.call(EffectSystem.Start, [EffectType.DefaultFlash, 1000, false]);
		}

		this.result(player.lobbyId);
	}

	static restart(lobbyId: number): void {
		if (lobbyList.has(lobbyId)) {
			let lobby: Lobby = lobbyList.get(lobbyId);

			// @ts-ignore
			for (const [key, value] of lobby.vehicleInfo) {
				value.destroy();
			}

			this.start(lobbyId);
		}
	}

	static result(lobbyId: number): void {
		if (lobbyList.has(lobbyId)) {
			let lobby: Lobby = lobbyList.get(lobbyId);

			if (lobby.lobbyInfo.amountOfWinners == lobby.playerList.size) {
				for (const player of lobby.playerList) {
					player.notify("Вы победитель");
				}
			}

			this.restart(lobbyId);
		}
	}

	static loadHints(lobbyId: number): void {
		if (lobbyList.has(lobbyId)) {
			let lobby: Lobby = lobbyList.get(lobbyId);

			if (lobby.mapInfo.repairColshape != null) {
				HintHandler.remove(lobby.mapInfo.repairColshape.id);
				lobby.mapInfo.repairColshape = null;
			}

			if (lobby.mapInfo.upgradeColshape != null) {
				HintHandler.remove(lobby.mapInfo.upgradeColshape.id);
				lobby.mapInfo.upgradeColshape = null;
			}

			let repairRandom = Math.floor(Math.random() * lobby.mapInfo.repairPositions.size);
			let upgradeRandom = Math.floor(Math.random() * lobby.mapInfo.repairPositions.size);

			lobby.mapInfo.repairColshape = HintHandler.create(
				repairRandom,
				lobby.lobbyInfo.dimension,
				0,
				lobby.mapInfo.repairPositions.get(repairRandom),
			).colshape;

			lobby.mapInfo.upgradeColshape = HintHandler.create(
				upgradeRandom,
				lobby.lobbyInfo.dimension,
				1,
				lobby.mapInfo.upgradePositions.get(upgradeRandom),
			).colshape;
		}
	}
}

export default LobbyHandler;