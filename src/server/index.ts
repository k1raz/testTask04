import "reflect-metadata";
import "./setup";
import LobbyHandler from "@/modules/Lobby/LobbyHandler";
import LobbyController from "@/modules/Lobby/controller";

new LobbyController();

process.on("uncaughtException", (err) => {
	console.log(err);
});

process.on("unhandledRejection", (err) => {
	console.log(err);
});

process.on("uncaughtExceptionMonitor", (err) => {
	console.log(err);
});

class ServerStart {
	_startPosition: Vector3Mp = new mp.Vector3(-26.96, 26.43, 71.97);

	constructor() {
		mp.events.add({
			playerReady: this.OnPlayerReady.bind(this),
			playerDeath: this.OnPlayerDeath.bind(this),
		});
	}

	private OnPlayerReady(player: PlayerMp): void {
		player.position = this._startPosition;
		player.model = mp.joaat("mp_m_freemode_01");

		LobbyHandler.create(1, "Test", 0, 1, 1, "issi7");

		setTimeout(() => {
			LobbyHandler.join(player, 1);
		}, 2000);
	}

	// @ts-ignore
	private OnPlayerDeath(player: PlayerMp, reason: string, killer: PlayerMp): void {
		player.spawn(this._startPosition);
	}
}

new ServerStart();
