// @name Spoof killer
// @id spoofkiller
// @description Spoof your killer's account on death screen, also links to the spoofed profile
// @author pi
// @tags visual, client-side

plugin.registerSetting({
	name: "Killer ID",
	description:
		"Account ID of the killer you want to spoof. Set to -1 to disable.",
	type: "string",
	defaultValue: "-1",
});

blockyfish.addEventListener("gameInit", ({ game }) => {
	if (game.currentScene) {
		if (!ishooked(game.currentScene.handlePlayHistory)) {
			hook(game.currentScene, "handlePlayHistory", {
				apply(f, th, args) {
					const targetId = +plugin.getSetting("Killer ID");
					if (
						targetId !== -1 &&
						!Number.isNaN(targetId) &&
						typeof args[0]?.killerUserId === "number"
					) {
						args[0].killerUserId = targetId;
					}
					return reflect.apply(f, th, args);
				},
			});
		}
	}
});
