// @name Auto dodge
// @id autododge
// @description Automatically dodges only when an enemy boosts at you, avoids boosting into walls. Press the dodge keybind to toggle. Change the values if you want.
// @author akgazii
// @tags gameplay, server-side

plugin.registerKeybind("Toggle dodge", "KeyX");

plugin.registerSetting({
  name: "Direction",
  description: "where to dodge: side (out of their way), mouse (towards your mouse) or away (same direction as their boost)",
  type: "string",
  defaultValue: "side",
});
plugin.registerSetting({
  name: "Radius",
  description: "how close an enemy has to be before dodging",
  type: "number",
  defaultValue: 900,
});
plugin.registerSetting({
  name: "Turn delay (MS)",
  description: "time between turning and boosting. raise if its buggy",
  type: "number",
  defaultValue: 15,
});
plugin.registerSetting({
  name: "Cooldown (MS)",
  description: "min time between dodges",
  type: "number",
  defaultValue: 1250,
});
plugin.registerSetting({
  name: "Wall check",
  description: "don't dodge into walls",
  type: "boolean",
  defaultValue: true,
});
plugin.registerSetting({
  name: "Charged dodge",
  description: "use a charged boost to dodge instead of a normal boost",
  type: "boolean",
  defaultValue: true,
});

if (plugin.storage.get("defaultsReset")!=1)
{
  plugin.setSetting("Direction", "side");
  plugin.setSetting("Radius", 900);
  plugin.setSetting("Turn delay (MS)", 15);
  plugin.setSetting("Cooldown (MS)", 1250);
  plugin.storage.set("defaultsReset", 1);
}

var minSpeed = 35;
var aimTolerance = 35;
var wallCheckDistance = 700;
var game;
var on = false;
var held = false;
var lastDodge = 0;
var tracked = new WeakMap();
var walls = null;
var trailHooked = false;
var trailWorks = false;
var dodgeUntil = 0;
var dodgePoint = null;
var wallHits = [];
var wallCheckedAt = 0;
var panel = null;
var panelCtx = null;
var fishImage = null;
var fishShotAt = 0;
var menu = null;
var menuCheckedAt = 0;
var menuShift = 0;

var npcs = [
  blockyfish.Animals.Pollock,
  blockyfish.Animals.Remora,
  blockyfish.Animals.Dragonfly,
  blockyfish.Animals.Lanternfish,
  blockyfish.Animals.BabyPenguin,
  blockyfish.Animals.LionsManeJellyfish,
  blockyfish.Animals.Firefly,
  blockyfish.Animals.Sardine,
  blockyfish.Animals.GiantSinophore,
];

blockyfish.addEventListener("gameInit", function(e)
{
  game = e.game;
  walls = null;
  tracked = new WeakMap();
});

function hookTrail(me)
{
  if (trailHooked || me.fadingTrail==null)
  {
    return;
  }
  hook(Object.getPrototypeOf(me.fadingTrail), "enable",
  {
    apply(f, th, args)
    {
      th.boostedAt = performance.now();
      trailWorks = true;
      return reflect.apply(f, th, args);
    },
  });
  trailHooked = true;
}

function dodging()
{
  return dodgePoint!=null && performance.now()<dodgeUntil;
}

function hookInput()
{
  var im = game.inputManager;
  if (im==null || im.dodgeHooked)
  {
    return;
  }
  im.dodgeHooked = true;

  hook(im, "sendMoveToXY",
  {
    apply(f, th, args)
    {
      if (dodging())
      {
        args = [dodgePoint.x, dodgePoint.y, args[2]];
      }
      return reflect.apply(f, th, args);
    },
  });

  hook(im, "getMouseWorldPosition",
  {
    apply(f, th, args)
    {
      var real = reflect.apply(f, th, args);
      if (!dodging())
      {
        return real;
      }
      if (real!=null && typeof real.clone=="function")
      {
        var copy = real.clone();
        copy.x = dodgePoint.x;
        copy.y = dodgePoint.y;
        return copy;
      }
      return { x: dodgePoint.x, y: dodgePoint.y };
    },
  });
}

function isBoosting(a, now, speed, base)
{
  if (trailWorks)
  {
    return a.fadingTrail!=null && a.fadingTrail.boostedAt!=null && now - a.fadingTrail.boostedAt < 400;
  }
  return base!=null && speed > base * 2;
}

function popup(text)
{
  try
  {
    game.currentScene.showMessagePopup(text, 1000, false);
  }
  catch {}
}

function findWalls()
{
  var list = [];
  var scene = game.currentScene;
  var sources = [scene];
  if (scene.terrainManager!=null)
  {
    sources.push(scene.terrainManager);
  }

  for(var s = 0;s<sources.length;s++)
  {
    for (var key in sources[s])
    {
      var name = key.toLowerCase();
      if (name.indexOf("terrain")==-1 || skipNames.some(function(n) { return name.indexOf(n)!=-1; }))
      {
        continue;
      }
      var obj = sources[s][key];
      if (obj!=null && obj.children!=null && list.indexOf(obj)==-1)
      {
        list.push(obj);
      }
    }
  }
  return list;
}

var skipNames = ["ceiling", "background", "shadow", "glow", "decor", "passable", "platform"];

function isPassable(obj)
{
  var infos = [obj, obj.data, obj.terrainData, obj.terrain, obj.options];
  for(var i = 0;i<infos.length;i++)
  {
    var info = infos[i];
    if (info==null || typeof info!="object")
    {
      continue;
    }
    if (info.collidable==false || info.collision==false || info.solid==false || info.isSolid==false || info.hasCollision==false)
    {
      return true;
    }
    if (info.passable==true || info.isPassable==true || info.passThrough==true || info.noCollision==true || info.ghost==true)
    {
      return true;
    }
    var type = String(info.terrainType || info.type || info.name || "").toLowerCase();
    if (skipNames.some(function(n) { return type.indexOf(n)!=-1; }))
    {
      return true;
    }
  }
  return false;
}

function hitsObject(obj, point)
{
  if (obj.visible==false || isPassable(obj))
  {
    return false;
  }
  if (typeof obj.containsPoint=="function" && obj.containsPoint(point))
  {
    return true;
  }
  if (obj.children!=null)
  {
    for(var i = 0;i<obj.children.length;i++)
    {
      if (hitsObject(obj.children[i], point))
      {
        return true;
      }
    }
  }
  return false;
}

function isWall(me, x, y)
{
  if (walls==null || walls.length==0)
  {
    walls = findWalls();
  }
  var point = me.parent.toGlobal({ x: x, y: y });
  for(var i = 0;i<walls.length;i++)
  {
    if (hitsObject(walls[i], point))
    {
      return true;
    }
  }
  return false;
}

function wallDistance()
{
  if (plugin.getSetting("Wall check"))
  {
    return wallCheckDistance;
  }
  return 0;
}

function pathClear(me, dirX, dirY)
{
  var check = wallDistance();
  if (check<=0)
  {
    return true;
  }
  try
  {
    for(var step = 1;step<=6;step++)
    {
      var d = check * step / 6;
      if (isWall(me, me.position.x + dirX * d, me.position.y + dirY * d))
      {
        return false;
      }
    }
  }
  catch
  {
    return true;
  }
  return true;
}

function pickDirection(me, dirX, dirY)
{
  var angles = [0, 30, -30, 60, -60, 90, -90, 120, -120];
  for(var i = 0;i<angles.length;i++)
  {
    var r = angles[i] * Math.PI / 180;
    var x = dirX * Math.cos(r) - dirY * Math.sin(r);
    var y = dirX * Math.sin(r) + dirY * Math.cos(r);
    if (pathClear(me, x, y))
    {
      return { x: x, y: y };
    }
  }
  return null;
}

function dodge(me, vx, vy)
{
  var mx = me.position.x;
  var my = me.position.y;
  var len = Math.sqrt(vx*vx + vy*vy);
  var mode = String(plugin.getSetting("Direction")).toLowerCase().trim();
  var mouse = game.inputManager.getMouseWorldPosition();
  var dirX;
  var dirY;

  if (mode=="mouse")
  {
    dirX = mouse.x - mx;
    dirY = mouse.y - my;
    var mlen = Math.sqrt(dirX*dirX + dirY*dirY);
    if (mlen==0)
    {
      return false;
    }
    dirX = dirX / mlen;
    dirY = dirY / mlen;
  }
  else if (mode=="away")
  {
    dirX = vx / len;
    dirY = vy / len;
  }
  else
  {
    dirX = -vy / len;
    dirY = vx / len;
    if ((mouse.x - mx) * dirX + (mouse.y - my) * dirY < 0)
    {
      dirX = -dirX;
      dirY = -dirY;
    }
  }

  var dir = pickDirection(me, dirX, dirY);
  if (dir==null)
  {
    return false;
  }

  var delay = plugin.getSetting("Turn delay (MS)");
  dodgePoint = { x: mx + dir.x * 2000, y: my + dir.y * 2000 };
  dodgeUntil = performance.now() + delay + 120;
  game.inputManager.sendMoveToXY(dodgePoint.x, dodgePoint.y, 10000);

  var boost = function()
  {
    try
    {
      if (plugin.getSetting("Charged dodge"))
      {
        blockyfish.chargedBoost();
      }
      else
      {
        blockyfish.boost();
      }
    }
    catch {}
  };

  if (delay>0)
  {
    setTimeout(boost, delay);
  }
  else
  {
    boost();
  }
  return true;
}

function hidePanel()
{
  if (panel!=null)
  {
    panel.style.display = "none";
  }
  if (menu!=null)
  {
    menu.style.translate = "";
  }
  menuShift = 0;
}

function findMenu()
{
  var names = ["Turn delay (MS)", "Wall check", "Charged dodge"];
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  var node = walker.nextNode();
  while (node!=null)
  {
    var el = node.parentElement;
    if (el!=null && names.indexOf(node.nodeValue.trim())!=-1 && el.getBoundingClientRect().width>0)
    {
      var box = el;
      while (box.parentElement!=null && box.parentElement!=document.body && box.parentElement.getBoundingClientRect().width <= window.innerWidth * 0.85)
      {
        box = box.parentElement;
      }
      var rect = box.getBoundingClientRect();
      if (rect.width<250 || rect.height<150)
      {
        return null;
      }
      return box;
    }
    node = walker.nextNode();
  }
  return null;
}

function watchMenu()
{
  var now = performance.now();
  if (now - menuCheckedAt < 300)
  {
    return;
  }
  menuCheckedAt = now;
  var box = null;
  try
  {
    box = findMenu();
  }
  catch {}
  if (box!=menu)
  {
    hidePanel();
    menu = box;
  }
}

function placePanel()
{
  var rect = menu.getBoundingClientRect();
  var left = rect.left - menuShift;
  var shift = Math.max(window.innerWidth - 24 - (rect.right - menuShift), 0);
  var size = Math.floor(Math.min(left + shift - 40, window.innerHeight - 48));
  if (size<200)
  {
    hidePanel();
    return false;
  }
  if (shift!=menuShift)
  {
    menu.style.translate = shift + "px 0px";
    menuShift = shift;
  }
  var top = Math.floor(rect.top + (rect.height - size) / 2);
  top = Math.max(24, Math.min(top, window.innerHeight - 24 - size));

  if (panel==null)
  {
    panel = document.createElement("canvas");
    panel.style.cssText = "position:fixed;z-index:2147483647;pointer-events:none;border:2px solid rgba(255,255,255,0.25);";
    panelCtx = panel.getContext("2d");
  }
  if (panel.parentNode==null)
  {
    document.body.appendChild(panel);
  }
  panel.style.display = "block";
  panel.style.left = Math.floor(left + shift - 16 - size) + "px";
  panel.style.top = top + "px";
  panel.style.width = size + "px";
  panel.style.height = size + "px";
  var pixels = Math.floor(size * (window.devicePixelRatio || 1));
  if (panel.width!=pixels)
  {
    panel.width = pixels;
    panel.height = pixels;
  }
  panelCtx.setTransform(pixels / 300, 0, 0, pixels / 300, 0, 0);
  return true;
}

function menuOpen()
{
  return menu!=null && menu.isConnected && menu.getBoundingClientRect().width>0;
}

function showPanel(me, seen)
{
  try
  {
    drawPanel(me, seen);
  }
  catch
  {
    hidePanel();
  }
}

function shootFish(me)
{
  if (performance.now() - fishShotAt < 1000)
  {
    return;
  }
  fishShotAt = performance.now();
  try
  {
    var renderer = game.renderer || game.app.renderer;
    fishImage = renderer.extract.canvas(me);
  }
  catch
  {
    fishImage = null;
  }
}

function panelText(g, text, x, y)
{
  g.font = "bold 12px sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.lineWidth = 4;
  g.strokeStyle = "#000000";
  g.strokeText(text, x, y);
  g.fillStyle = "#ffffff";
  g.fillText(text, x, y);
}

function drawPanel(me, seen)
{
  if (!menuOpen() || !placePanel())
  {
    hidePanel();
    return;
  }

  var g = panelCtx;
  var cx = 150;
  var cy = 160;
  var radius = plugin.getSetting("Radius");
  var check = wallDistance();
  var s = 110 / Math.max(radius, check, 1);
  var dx = 1;
  var dy = 0;

  if (me!=null)
  {
    var mouse = game.inputManager.getMouseWorldPosition();
    var len = Math.sqrt((mouse.x - me.position.x) * (mouse.x - me.position.x) + (mouse.y - me.position.y) * (mouse.y - me.position.y));
    if (len>0)
    {
      dx = (mouse.x - me.position.x) / len;
      dy = (mouse.y - me.position.y) / len;
    }
    if (check>0 && performance.now() - wallCheckedAt > 100)
    {
      wallCheckedAt = performance.now();
      wallHits = [];
      for(var step = 1;step<=6;step++)
      {
        var hit = false;
        try
        {
          hit = isWall(me, me.position.x + dx * check * step / 6, me.position.y + dy * check * step / 6);
        }
        catch {}
        wallHits.push(hit);
      }
    }
    shootFish(me);
  }

  g.fillStyle = "#0a1423";
  g.fillRect(0, 0, 300, 300);
  panelText(g, "Auto dodge preview", 150, 16);

  var cell = 100;
  while (cell * s < 12)
  {
    cell = cell * 2;
  }
  g.strokeStyle = "rgba(255,255,255,0.08)";
  g.lineWidth = 1;
  g.beginPath();
  for(var gx = cx % (cell * s);gx<300;gx = gx + cell * s)
  {
    g.moveTo(gx, 30);
    g.lineTo(gx, 300);
  }
  for(var gy = cy % (cell * s);gy<300;gy = gy + cell * s)
  {
    if (gy>30)
    {
      g.moveTo(0, gy);
      g.lineTo(300, gy);
    }
  }
  g.stroke();

  var color = "#999999";
  if (on)
  {
    color = "#44ff88";
  }
  g.strokeStyle = color;
  g.lineWidth = 3;
  g.beginPath();
  g.arc(cx, cy, radius * s, 0, Math.PI * 2);
  g.stroke();
  panelText(g, "Dodge radius", cx, cy - radius * s - 10);

  if (check>0)
  {
    for(var i = 0;i<6;i++)
    {
      g.fillStyle = "#44ff88";
      if (me!=null && wallHits[i])
      {
        g.fillStyle = "#ff4444";
      }
      g.beginPath();
      g.arc(cx + dx * check * s * (i + 1) / 6, cy + dy * check * s * (i + 1) / 6, 3, 0, Math.PI * 2);
      g.fill();
    }
    panelText(g, "Wall check", cx + dx * (check * s + 30), cy + dy * (check * s + 14));
  }

  for(var j = 0;j<seen.length;j++)
  {
    g.fillStyle = "#ffaa33";
    if (seen[j].hot)
    {
      g.fillStyle = "#ff3333";
    }
    g.beginPath();
    g.arc(cx + (seen[j].x - me.position.x) * s, cy + (seen[j].y - me.position.y) * s, 5, 0, Math.PI * 2);
    g.fill();
  }

  var fw = 30;
  var fh = 20;
  if (me!=null && me.width>0 && me.height>0)
  {
    fw = Math.max(me.width * s, 24);
    fh = Math.max(me.height * s, 24);
  }
  if (me!=null && fishImage!=null && fishImage.width>0 && fishImage.height>0)
  {
    var fit = Math.min(fw / fishImage.width, fh / fishImage.height);
    g.drawImage(fishImage, cx - fishImage.width * fit / 2, cy - fishImage.height * fit / 2, fishImage.width * fit, fishImage.height * fit);
  }
  else
  {
    g.fillStyle = "#4fc3ff";
    g.beginPath();
    g.ellipse(cx, cy, fw / 2, fh / 2, 0, 0, Math.PI * 2);
    g.fill();
  }
}

function tick()
{
  try
  {
    watchMenu();
    if (game==null || game.currentScene==null || game.currentScene.myAnimals==null)
    {
      showPanel(null, []);
      return;
    }
    var me = game.currentScene.myAnimals[0];
    if (me==null || me.position==null || game.inputManager==null)
    {
      tracked = new WeakMap();
      showPanel(null, []);
      return;
    }
    try
    {
      hookTrail(me);
    }
    catch {}
    try
    {
      hookInput();
    }
    catch {}

    var now = performance.now();
    var animals = game.currentScene.entityManager.animalsList;
    var radius = plugin.getSetting("Radius");
    var speed = minSpeed;
    var minAim = Math.cos(aimTolerance * Math.PI / 180);
    var threat = null;
    var threatTowards = 0;
    var seen = [];

    for(var i = 0;i<animals.length;i++)
    {
      var a = animals[i];
      if (a==me || a.position==null || (a.id!=null && a.id==me.id) || game.currentScene.myAnimals.includes(a))
      {
        continue;
      }
      if (Math.abs(a.position.x - me.position.x) < 30 && Math.abs(a.position.y - me.position.y) < 30)
      {
        continue;
      }
      if (a.fishLevelData!=null && npcs.includes(a.fishLevelData.fishLevel))
      {
        continue;
      }

      var x = a.position.x;
      var y = a.position.y;
      var old = tracked.get(a);

      if (old==null)
      {
        tracked.set(a, { x: x, y: y, t: now, base: null, hotAt: 0 });
        continue;
      }

      var ex = me.position.x - x;
      var ey = me.position.y - y;
      if (Math.sqrt(ex*ex + ey*ey)<=radius)
      {
        seen.push({ x: x, y: y, hot: now - old.hotAt < 300 });
      }
      if (old.x==x && old.y==y)
      {
        continue;
      }

      var dt = (now - old.t) / 1000;
      var entry = { x: x, y: y, t: now, base: old.base, hotAt: old.hotAt };
      tracked.set(a, entry);
      if (dt<=0 || dt>0.25)
      {
        continue;
      }

      var vx = (x - old.x) / dt;
      var vy = (y - old.y) / dt;
      var total = Math.sqrt(vx*vx + vy*vy);
      var boosting = isBoosting(a, now, total, old.base);

      if (!boosting)
      {
        if (old.base==null)
        {
          entry.base = total;
        }
        else
        {
          entry.base = old.base * 0.9 + total * 0.1;
        }
        continue;
      }

      var dx = me.position.x - x;
      var dy = me.position.y - y;
      var dist = Math.sqrt(dx*dx + dy*dy);
      if (dist>radius || dist==0 || total==0)
      {
        continue;
      }

      var towards = (vx*dx + vy*dy) / dist;
      if (towards / total < minAim)
      {
        continue;
      }
      if (towards>speed)
      {
        entry.hotAt = now;
      }
      if (towards>speed && towards>threatTowards)
      {
        threatTowards = towards;
        threat = { vx: vx, vy: vy };
      }
    }

    showPanel(me, seen);

    if (!on || threat==null)
    {
      return;
    }
    if (me.fishLevelData!=null && me.fishLevelData.fishLevel==70)
    {
      return;
    }
    if (Date.now() - lastDodge < plugin.getSetting("Cooldown (MS)"))
    {
      return;
    }
    if (dodge(me, threat.vx, threat.vy))
    {
      lastDodge = Date.now();
    }
  }
  catch {}
}

setInterval(tick, 10);

plugin.onKeybindDown("Toggle dodge", function()
{
  if (game==null || game.currentScene==null || held)
  {
    return;
  }
  held = true;
  on = !on;
  if (on)
  {
    popup("Auto dodge has been enabled");
  }
  else
  {
    popup("Auto dodge has been disabled");
  }
});

plugin.onKeybindUp("Toggle dodge", function()
{
  held = false;
});
