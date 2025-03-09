// @name Fiddler godmode
// @id fiddlergodmodeop
// @description Press toggle godmode keybind to get godmode
// @author noam
// @tags gameplay, server-side

plugin.registerSetting({
	name: "Delay (MS)",
	description: "How long should delay between heals be (recommended 200)",
	type: "number",
	defaultValue: 200,
});
plugin.registerSetting({
	name: "Limit",
	description:
		"At what amount of overhealth does it stop healing (Max over health is 3333, put over 3333 for no limit)",
	type: "number",
	defaultValue: 2500,
});
plugin.registerKeybind("Toggle Godmode", "KeyQ");

let game;
let toggle = false;
plugin.onKeybindDown("Toggle Godmode", () => {
	if (
		game?.currentScene?.myAnimal != null &&
		game.currentScene.myAnimal.fishLevelData.fishLevel === 121
	)
		toggle = !toggle;
});

blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	game = _game;
});
let delay = plugin.getSetting("Delay (MS)");
let interval;
function tick() {
	try {
		if (plugin.getSetting("Delay (MS)") != delay && interval != null) {
			clearInterval(interval);
			delay = plugin.getSetting("Delay (MS)");
			interval = setInterval(tick, delay);
		}
		if (game?.currentScene?.myAnimal?.fishLevelData?.fishLevel !== 121)
			return (toggle = false);
		if (
			game.currentScene.myAnimal.fishData.overHealth >=
			plugin.getSetting("Limit")
		)
			return;
		if (!toggle) return;
		game.socketManager.sendBytePacket(
			blockyfish.encodeBytePacket(
				gameState.token._value,
				blockyfish.ActionPacket.FiddlerScore,
			),
		);
	} catch {}
}
interval = setInterval(tick, delay);
