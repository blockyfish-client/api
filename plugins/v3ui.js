// @name v3 UI
// @id v3ui
// @description Restores Deeeep.io's v3 UI: horizontal XP bar on the bottom, vertical boost bars on the left
// @author pi
// @tags visual, client-side

const css =
  ".middle{bottom:60px!important;& .stats{width:100vw!important}& .meters{height:1.3rem!important;padding-bottom:1.5rem!important}& .boosts{width:250px!important;margin-top:-120px!important;margin-left:calc(50px - 100vw)!important;transform:rotate(-90deg)!important}& .rounded-tl-xl{border-radius:.75rem 0 0 .75rem!important;overflow:hidden!important}& .rounded-tr-xl{border-radius:0 .75rem .75rem 0!important;overflow:hidden!important}& .rounded-t-xl{border-radius:.75rem!important;overflow:hidden!important}}.animal-data{flex-direction:column-reverse!important;left:50vw!important;& .hotkey{display:none!important}& .animal{background:#0004!important;border-radius:99999px!important;width:1.5rem!important;height:60vw!important;margin:auto!important;position:fixed!important;bottom:calc(30px - 30vw)!important;left:50vw!important;transform:rotate(90deg)!important}& .animal .inner .image{width:.8rem!important;height:auto!important;margin:20px 0!important;transform:rotate(-90deg)!important}& .animal .inner .xp-indicator{white-space:nowrap!important;transform:rotate(-90deg)!important}& .detailed-info{display:none!important}}";
const s = document.createElement("style");
s.innerText = css;
document.head.appendChild(s);
