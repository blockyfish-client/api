// @name Reverse aim
// @id reverseaim
// @description Automatically reverses movement on some animals
// @author noam

let game;
let reverse = false;
blockyfish.addEventListener("gameInit", ({ game: _game }) => {
    game = _game;
    if (getnative(game.inputManager.getMouseWorldPosition)) {
        hook(game.inputManager, game.inputManager.key_getMouseWorldPosition, {
            apply(f, th, args) {
                if (!reverse || game == null || game.currentScene == null || game.currentScene.myAnimal == null) return reflect.apply(f, th, args);
                const pos = reflect.apply(f, th, args);
                const mypos = game.currentScene.getMyPos();
                pos.x = -(pos.x - mypos._x) + mypos._x;
                pos.y = -(pos.y - mypos._y) + mypos._y;
                return pos;
            }
        });
    }
});

setInterval(() => {
    if (game == null || game.currentScene == null || game.currentScene.myAnimal == null) return;
    const animal = game.currentScene.myAnimal;
    switch (animal.fishLevelData.fishLevel) {
        case 101:
            reverse = animal._usingSkill
        break;
        case 126:
            reverse = animal._usingSkill
        break;
    }
});
