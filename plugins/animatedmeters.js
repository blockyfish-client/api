// @name Animated meters
// @id animatedmeters
// @description Makes XP, boost, and stat bars smooth
// @author pi
// @tags visual, client-side

const css = ":is(.middle,.animal-data) .inner{transition:all .2s ease-out}";
const s = document.createElement("style");
s.innerText = css;
document.head.appendChild(s);
