import { AllMaps } from "@/modules/Lobby/configs/Maps";
import LobbyMap from "@/modules/Lobby/LobbyMap";
import LobbyInfo from "@/modules/Lobby/LobbyInfo";

class Lobby {
	public id: number;
	public name: string;
	public lobbyInfo: LobbyInfo;
	public mapInfo: LobbyMap;
	private readonly _vehicleName: string;
	private _vehicleInfo: Map<number, VehicleMp>;
	private _playerList: Set<PlayerMp>;

	constructor(id: number, name: string, lobbyInfo: LobbyInfo, mapInfo: number, vehicleName: string) {
		this.id = id;
		this.name = name;
		this.lobbyInfo = lobbyInfo;
		this.mapInfo = AllMaps.get(mapInfo);
		this._vehicleName = vehicleName;

		this._playerList = new Set<PlayerMp>();
		this._vehicleInfo = new Map<number, VehicleMp>;
	}

	get vehicleName(): string {
		return this._vehicleName;
	}

	get playerList() {
		return this._playerList;
	}

	set playerList(value) {
		this._playerList = value;
	}

	get vehicleInfo() {
		return this._vehicleInfo;
	}

	set vehicleInfo(value) {
		this._vehicleInfo = value;
	}
}

export default Lobby;
