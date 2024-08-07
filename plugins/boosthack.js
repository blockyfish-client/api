// @name Instant charged boost
// @id boosthack
// @description Ctrl + click for full boost, alt + click for half boost, and ctrl + shift + click for super jump/thresher super boost
// @author pi

const createOverlay = () => {
	try {
		document.getElementById("ctrl-overlay").remove();
	} catch {}

	const overlay = document.createElement("div");
	document.querySelector("div.game").prepend(overlay);
	ReactDOM.createRoot(overlay).render(
		<div
			id="ctrl-overlay"
			style={{
				width: "100%",
				height: "100%",
				position: "absolute",
				display: "block",
				zIndex: 10000,
				pointerEvents: "none",
			}}
		/>,
	);
};

let game;
blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	game = _game;
	createOverlay();
});

const showCtrlOverlay = (e) => {
	if (e.ctrlKey || e.altKey) {
		try {
			if (game.currentScene != null) {
				if (game.currentScene.myAnimal != null) {
					if (game.currentScene.myAnimal._visibleFishLevel !== 101) {
						document.getElementById("ctrl-overlay").style.pointerEvents = "all";
					} else if (!e.shiftKey) {
						if (game.currentScene.myAnimal._visibleFishLevel === 101)
							document.getElementById("ctrl-overlay").style.pointerEvents =
								"all";
					} else {
						document.getElementById("ctrl-overlay").style.pointerEvents =
							"none";
					}
				}
			}
		} catch {}
	}
};

let ctrlKey = false;
let altKey = false;
window.addEventListener(
	"keydown",
	(e) => {
		try {
			showCtrlOverlay(e);
			if (e.ctrlKey) {
				ctrlKey = true;
			}
			if (e.altKey) {
				altKey = true;
			}
		} catch {}
	},
	false,
);
window.addEventListener(
	"keyup",
	(e) => {
		try {
			if (!e.ctrlKey && !e.altKey) {
				document.getElementById("ctrl-overlay").style.pointerEvents = "none";
			}
			if (!e.ctrlKey) {
				ctrlKey = false;
			}
			if (!e.altKey) {
				altKey = false;
			}
		} catch {}
	},
	false,
);
window.addEventListener(
	"click",
	(e) => {
		try {
			if (e.ctrlKey) {
				if (
					e.shiftKey &&
					[107, 109].includes(game.currentScene.myAnimal._visibleFishLevel)
				) {
					blockyfish.boost();
					setTimeout(() => {
						blockyfish.chargedBoost();
					}, 30);
				} else if (
					e.shiftKey &&
					game.currentScene.myAnimal._visibleFishLevel !== 101
				) {
					blockyfish.superJump();
				} else {
					blockyfish.chargedBoost();
				}
			}
			if (e.altKey) {
				blockyfish.halfChargedBoost();
			}
		} catch {}
	},
	false,
);
window.addEventListener("focus", () => {
	try {
		document.getElementById("ctrl-overlay").style.pointerEvents = "none";
	} catch {}
});
