// @name Pearl defense double animal
// @id pddoubleanimal
// @description Press the options keybind to get all evolution options in pearl defense
// @author noam
// @tags gameplay, server-side

plugin.registerKeybind("Get all options", "Equal");

plugin.onKeybindDown("Get all options", () => {
	blockyfish.reloadEvolutionOptions();
});
