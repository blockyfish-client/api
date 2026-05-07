// @name Humpback auto songs
// @id autosongs
// @description Press number keys to activate humpback whale songs
// @author pi
// @tags gameplay, server-side

const SONGS = [
	{
		name: "Speed",
		combination: [0, 0, 0],
		color: "#00ffff",
	},
	{
		name: "Slow",
		combination: [0, 0, 1],
		color: "#9900ff",
	},
	{
		name: "Heal",
		combination: [0, 1, 0],
		color: "#00ff00",
	},
	{
		name: "War",
		combination: [1, 0, 1],
		color: "#ff0000",
	},
	{
		name: "Ruin",
		combination: [1, 1, 0],
		color: "#ff6700",
	},
	{
		name: "Blast",
		combination: [1, 1, 1],
		color: "#ffff00",
	},
];

for (const i in SONGS) {
	plugin.registerKeybind(SONGS[i].name, `Digit${+i + 1}`);
}

let keyMap;
const _keyMap = navigator.keyboard.getLayoutMap();
(async () => {
	keyMap = await _keyMap;
})();

let uiCreationQueued = false;
const createUi = async () => {
	if (uiCreationQueued) return;
	uiCreationQueued = true;
	try {
		document.getElementById("humpback-ui").parentElement.remove();
	} catch {}

	const container = document.createElement("div");
	let targetInsertion = document.querySelector(".stats .middle");
	if (!targetInsertion) {
		await new Promise((resolve) => {
			const inter = setInterval(() => {
				targetInsertion = document.querySelector(".stats .middle");
				if (!targetInsertion) return;
				clearInterval(inter);
				resolve();
			}, 300);
		});
	}
	await _keyMap;
	targetInsertion.prepend(container);
	container.style.display = "none";
	ReactDOM.createRoot(container).render(
		<div
			id="humpback-ui"
			style={{
				display: "flex",
				gap: "0.5rem",
				width: "100%",
				justifyContent: "center",
				pointerEvents: "none",
				userSelect: "none",
			}}
		>
			{SONGS.map((song) => (
				<div
					style={{
						background: "#0004",
						padding: "0.25rem 0.5rem",
						borderRadius: "0.75rem",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							gap: "0.125rem",
							width: "5rem",
							justifyContent: "center",
						}}
					>
						{song.combination.map((note) => (
							<div
								style={{
									height: note ? "1rem" : "0.625rem",
									width: note ? "1rem" : "0.625rem",
									margin: note ? "" : "2.5px 0",
									borderRadius: "2rem",
									background: song.color,
									opacity: 0.5,
								}}
							/>
						))}
					</div>
					<p
						style={{
							fontSize: "0.75rem",
						}}
					>
						{song.name} |{" "}
						{keyMap.get(plugin.getKeybind(song.name)) ??
							plugin.getKeybind(song.name)}
					</p>
				</div>
			))}
		</div>,
	);
	uiCreationQueued = false;
};

let game;

blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	game = _game;
	createUi();
});

let prevAnimalId = null;
setInterval(() => {
	try {
		const animalId = game?.currentScene?.myAnimal?.fishLevelData?.fishLevel;
		if (typeof animalId != "number" || animalId == prevAnimalId) return;
		const ui = document.getElementById("humpback-ui")?.parentElement;
		if (!ui) return createUi();
		prevAnimalId = animalId;
		console.log(animalId);
		if (animalId == blockyfish.Animals.HumpbackWhale) {
			ui.style.display = "flex";
		} else {
			ui.style.display = "none";
		}
	} catch {}
}, 300);

let held = false;
for (const song of SONGS) {
	plugin.onKeybindDown(song.name, () => {
		if (
			held ||
			game?.currentScene?.myAnimal?.fishLevelData?.fishLevel !=
				blockyfish.Animals.HumpbackWhale
		)
			return;
		held = true;
		try {
			let delay = 0;
			for (const note of song.combination) {
				setTimeout(() => {
					if (note) {
						blockyfish.chargedBoost();
					} else {
						blockyfish.boost();
					}
				}, delay);
				delay += note ? 200 : 100;
			}
		} catch {}
	});
	plugin.onKeybindUp(song.name, () => {
		held = false;
	});
}
