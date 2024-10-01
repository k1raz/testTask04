import LobbyMap from "@/modules/Lobby/LobbyMap";

export const AllMaps: Map<number, LobbyMap> = new Map([
	[
		0,
		new LobbyMap(
			"Парковка",
			new mp.Vector3(2728.11, 1361.39, 24.52),
			new Map<number, Vector3Mp>([
				[0, new mp.Vector3(2701.07, 1392.0, 24.533)],
				[1, new mp.Vector3(2726.25, 1393.15, 24.53)],
				[2, new mp.Vector3(2754.14, 1391.47, 24.51)],
				[3, new mp.Vector3(2761.246, 1365.6, 24.524)],
				[4, new mp.Vector3(2757.853, 1334.53, 24.52)],
			]),
			new Map<number, Vector3Mp>([
				[0, new mp.Vector3(2701.07, 1392.0, 24.533)],
				[1, new mp.Vector3(2726.25, 1393.15, 24.53)],
			]),
			new Map<number, Vector3Mp>([
				[0, new mp.Vector3(2754.14, 1391.47, 24.51)],
				[1, new mp.Vector3(2757.853, 1334.53, 24.52)],
			]),
		),
	],
]);
