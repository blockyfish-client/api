// @name Black
// @id pearsaehify
// @description Lose all your rights and start getting a taste for koolaid kfc and watermelon
// @author noam

let game;

blockyfish.addEventListener("gameInit", ({game: _game}) => {
	game = _game;
});

setInterval(()=>{
	if (game?.currentScene?.entityManager?.animalsList == null) return;
	let animalsList = game.currentScene.entityManager.animalsList;
	for(let i = 0; i < animalsList.length; i++) {
		const animal = animalsList[i];
		let skin = animal?.children?.[1]?.children[0];
		if (skin != null) {
			skin._tintRGB = 0x001c3e; // brown
		}
	}
});