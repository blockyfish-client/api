// @name Auto shake
// @id autoshake
// @description Press the shake keybind to toggle
// @author noam
// @tags gameplay, server-side

plugin.registerKeybind("Shake", "KeyV");

plugin.registerSetting({
	name: "Auto enable",
	description:
		"Enables autoshake when attacked by anaconda, cookiecutter shark, snake, or wolfeel",
	type: "boolean",
	defaultValue: true,
});

const formMovePacket = (x, y, idk) => {
	const buf = new ArrayBuffer(10);
	const d = new DataView(buf);
	d.setUint8(0, 2);
	d.setInt32(1, x, true);
	d.setInt32(5, y, true);
	d.setUint8(9, idk);
	return buf;
};

let FORWARD = false;

let game;
blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	game = _game;
});

const allowAuto = plugin.getSetting("Auto enable");

let on = false;
const setEnabled = (enabled) => {
	if (on === enabled) return;
	on = enabled;
	if (enabled) {
		game.currentScene.showMessagePopup(
			"Autoshake has been enabled",
			1000,
			false,
		);
		return;
	}
	game.currentScene.showMessagePopup(
		"Autoshake has been disabled",
		1000,
		false,
	);
	return;
};

const { Anaconda, CookiecutterShark, Snake, WolfEel } = blockyfish.Animals;
setInterval(() => {
	if (
		game?.currentScene?.myAnimal == null ||
		game?.inputManager?.getMouseWorldPosition == null
	)
		return;
	if (!on && !allowAuto) return;

	const a = game.currentScene.myAnimal._holdedEntities.find((e) =>
		[Anaconda, CookiecutterShark, Snake, WolfEel].includes(
			e.fishLevelData.fishLevel,
		),
	);
	if (!on && !a) return;

	const mpos = game.inputManager.getMouseWorldPosition();
	const ppos = game.currentScene.myAnimal.position;
	const angleRadians = Math.atan2(mpos.y - ppos._y, mpos.x - ppos._x);
	const incr = FORWARD ? 2000 : 1500;
	const bpos = [
		ppos._x + Math.cos(angleRadians) * incr,
		ppos._y + Math.sin(angleRadians) * incr,
	];
	game.socketManager.sendBytePacket(formMovePacket(bpos[0], bpos[1], 100));
	FORWARD = !FORWARD;
}, 100);

let held = false;
plugin.onKeybindDown("Shake", () => {
	if (game == null || game.currentScene == null) return;
	if (held) return;
	held = true;
	setEnabled(!on);
});
plugin.onKeybindUp("Shake", () => {
	held = false;
});
