// @name Instant charged boost
// @id boosthack
// @description ctrl/cmd + click for full boost, alt + click for half boost, and ctrl/cmd + shift + click for super jump/thresher super boost
// @author pi

const createOverlay = () => {
	try {
		document.getElementById("ctrl-overlay").parentElement.remove();
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
				userSelect: "none",
			}}
		/>,
	);
};

let game;
blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	game = _game;
	createOverlay();
});

const showCtrlOverlay = () => {
	try {
		if (game?.currentScene?.myAnimal) {
			document.getElementById("ctrl-overlay").style.pointerEvents = "all";
		}
	} catch {}
};

let ctrlKey = false;
let altKey = false;
let shiftKey = false;
window.addEventListener(
	"keydown",
	(e) => {
		try {
			if (e.ctrlKey || e.metaKey || e.altKey) {
				showCtrlOverlay(e);
			}
			if (e.ctrlKey || e.metaKey) {
				ctrlKey = true;
			}
			if (e.altKey) {
				altKey = true;
			}
			if (e.shiftKey) {
				shiftKey = true;
			}
		} catch {}
	},
	false,
);
window.addEventListener(
	"keyup",
	(e) => {
		try {
			if (!e.ctrlKey && !e.metaKey && !e.altKey) {
				document.getElementById("ctrl-overlay").style.pointerEvents = "none";
			}
			if (!e.ctrlKey && !e.metaKey) {
				ctrlKey = false;
			}
			if (!e.altKey) {
				altKey = false;
			}
			if (!e.shiftKey) {
				shiftKey = false;
			}
		} catch {}
	},
	false,
);
window.addEventListener(
	"click",
	(e) => {
		const { BeakedWhale, BelugaWhale, CoconutCrab, ThresherShark } =
			blockyfish.Animals;
		const lvl = game.currentScene.myAnimal._visibleFishLevel;
		try {
			if (ctrlKey) {
				if (shiftKey) {
					if ([ThresherShark, BeakedWhale, BelugaWhale].includes(lvl)) {
						blockyfish.boost();
						blockyfish.chargedBoost();
					} else if (lvl === CoconutCrab) {
						blockyfish.chargedBoost();
						setTimeout(() => {
							blockyfish.boost();
						}, 45);
						setTimeout(() => {
							blockyfish.scalingBoost(41);
						}, 90);
					} else {
						blockyfish.superJump();
					}
				} else {
					blockyfish.chargedBoost();
				}
			} else if (altKey) {
				blockyfish.halfChargedBoost();
			}
		} catch {}
	},
	false,
);
window.addEventListener("focus", () => {
	try {
		document.getElementById("ctrl-overlay").style.pointerEvents = "none";
		ctrlKey = false;
		altKey = false;
		shiftKey = false;
	} catch {}
});
