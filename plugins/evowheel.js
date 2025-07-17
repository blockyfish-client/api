// @name Evolution tree wheel
// @id evowheel
// @description View an evolution tree for tiers 8 - 10
// @author pi
// @tags utility, client-side

plugin.registerKeybind("Show evo wheel", "KeyY");

const evowheelCss = document.createElement("style");
evowheelCss.innerHTML = `
@keyframes evowheel-spin {
    from {
        rotate: 0deg;
    }
    to {
        rotate: 360deg;
    }
}
.evowheel {
    animation: evowheel-spin 54s linear infinite;
    transition: all 0.3s ease-out;
    opacity: 0;
    transform: scale(0) rotate(-90deg);

    max-width: 80vw;
    max-height: 80vh;
    aspect-ratio: 1;
    z-index: 9999;
    position: fixed;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    pointer-events: none;
}
.evowheel.open {
    opacity: 1;
    transform: scale(1) rotate(0deg);
}`;
document.querySelector("head").append(evowheelCss);

const evowheelUrl =
	"https://blockyfish-client.github.io/assets/evo_circle.min.png";
const createEvowheel = () => {
	const evowheel = document.createElement("div");
	document.querySelector("div.game").prepend(evowheel);
	React.createRoot(evowheel).render(
		<img src={evowheelUrl} draggable="false" className="evowheel" alt="" />,
	);
};

blockyfish.addEventListener("gameInit", ({ game: _game }) => {
	createEvowheel();
});

let isOpen = false;
plugin.onKeybindDown("Show evo wheel", () => {
	if (isOpen) return;
	for (const evowheel of document.querySelectorAll(".evowheel")) {
		evowheel.classList.add("open");
	}
	isOpen = true;
});
plugin.onKeybindUp("Show evo wheel", () => {
	for (const evowheel of document.querySelectorAll(".evowheel")) {
		evowheel.classList.remove("open");
	}
	isOpen = false;
});
