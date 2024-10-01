enum PercentName {
	Default,
	Rare,
	Legend
}

const randomPercent: Map<PercentName, number> = new Map([
	[PercentName.Default, 25],
	[PercentName.Rare, 50],
	[PercentName.Legend, 100],
]);

export default {PercentName, randomPercent}