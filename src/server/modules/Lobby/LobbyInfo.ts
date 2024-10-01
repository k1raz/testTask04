class LobbyInfo {
	private _dimension: number;
	private readonly _amountOfPlayers: number;
	private readonly _amountOfWinners: number;

	constructor(amountOfPlayers: number, amountOfWinners: number) {
		this._amountOfPlayers = amountOfPlayers;
		this._amountOfWinners = amountOfWinners;
	}

	get dimension(): number {
		return this._dimension;
	}

	set dimension(value: number) {
		this._dimension = value;
	}

	get amountOfWinners() {
		return this._amountOfWinners;
	}

	get amountOfPlayers() {
		return this._amountOfPlayers;
	}
}

export default LobbyInfo;
