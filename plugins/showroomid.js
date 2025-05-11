// @name Show room ID
// @id showroomid
// @description Display everyone's room ID next to their name
// @author pi
// @tags visual, gameplay, client-side

const tag = `id-${Math.random().toString(36).slice(2, 6)}`;
const style = {
	fill: "#bfbfbf",
	fontSize: 30,
	fontWeight: "bold",
};

let game;
blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	game = _game;
});

setInterval(() => {
	try {
		if (game == null || game.currentScene == null) return;
		for (
			let i = 0;
			i < game.currentScene.entityManager.animalsList.length;
			i++
		) {
			const animal = game.currentScene.entityManager.animalsList[i];
			if (animal.nameObject.text.includes(tag)) continue;
			animal.nameObject.textStyles[tag] = style;
			animal.nameObject.text = `${animal.nameObject.text} <${tag}>[${animal.playerRoomId}]</${tag}>`;
		}
	} catch {}
}, 200);
