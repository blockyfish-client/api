### An update on client bans

**This is pure speculation!**  
It appears that Fede is only banning client users who are on the daily leaderboard with an animal that can be heaviliy abused with hacks (e.g. goblin shark, beaked whale, etc.). Your chances of getting banned will be lower if:

1. You are not on the daily leaderboard
2. You are not using an animal that can be heavily abused with hacks

---

### Client bans

Fede banned some people today (Apr. 18, 2025) for hacking. At this time, there doesn't seem to be any automated system that bans players for hacking. Fede banned people who were reported in Deepcord's client report channel manually

---

### v4.3.4

- Added an option in settings to keep Blockyfish running in the background for faster load time
- Optimized initialization time of Blockyfish components
- Plugins are now compiled and loaded in parallel
- Fixed an issue where the overlay showing the current zoom level would also scale with the page's zoom level
- Fixed an issue where titlebar buttons would scale with the page's zoom level
- Fixed an issue where UI elements were not moved properly to avoid conflicting with titlebar buttons on MacOS
- Fixed an issue where the Vue injector could fail due to a race condition
- Fixed various layout bugs
- Google sign-in user agent set to Firefox v138

---

### v4.3.3

- Added experimental packet decoder and interceptor for plugins
- Fixed a bug where the window would not be properly fullscreened on Windows, causing a thin border and rounded corners to be visible
- Fixed a bug where the window could not be moved in MacOS
- Fixed a bug where the Linux app could be falsely detected to be using GTK4
- Fixed a bug where checkboxes would momentarily appear as checked upon opening Blockyfish settings
- Fixed a bug where title bar control buttons on Windows and Linux would not appear, making it difficult to close the window
- Optimized performance on Windows; removed background throttling when the window isn't focused
- Updated to Electron v36 (Chrome v136)

---

### v4.3.2

- Plugins can now a save file and take a screenshot
- Plugins can now access `Buffer`
- Plugins can now access the Vue.js router
- Added Blockyfish announcements
- Improved performance on settings page

---

### v4.3.1

- Added tags to plugins
- Fixed a bug with enabling/disabling plugins
- Updated to Electron v35 (Chrome v134); Google sign-in user agent set to Firefox v137

---

### v4.3.0

- Removed safeStorage to avoid decryption bugs in certain circumstances on Linux
- Fixed a bug where external links would not be opened in the default browser and instead be opened as a new window in the Electron app
- Fixed UI bugs where the titlebar buttons would interfere with important in-game buttons

---

### v4.2.5

- Fixed a disastrous typo that destroyed the world in 4.2.3/4.2.4

---

### v4.2.4

- Fixed plugin loading bug in 4.2.3
- Patched Google Sign-in's Electron detection
- Plugin list now reloads as soon as plugins are loaded

---

### v4.2.3

- Optimized plugin load time
- Optimized client load time
- Fixed socket manager bug

---

### v4.2.2

- Added support for deeplinking
- Fixed Google sign-in
- Fixed Google Ads patch
- Fixed boost packet bug
- Fixed custom keybinds not saving

---

### v4.2.1

- Fixed boost hack (beaked whale bubble)

---

### v4.2.0

- Fixed bug with instant charged boost
- Fixed bug with custom asset pack
- Added plugin settings

---

### v4.1.7

- Improved performance
- Fixed bug with boosting

---

### v4.1.6

#### Bug fixes

- Patched possible detection methods
- Disabled background throttling

---

### v4.1.5

#### Bug fixes

- Fixed a bug with the window drag region
- Fixed injector breaking if the player leaves a server without spawning in first

#### Features

- Patched adsbygoogle module to fix frozen respawn screen

---

### v4.1.4

#### Bug fixes

- Fixed a bug where some plugins would not work in PD and 1v1
- Fixed plugin editor layout on MacOS
- Fixed type declarations not loading in plugin editor

#### Features

- Removed beaked whale bubble cooldown
- Allow ctrl/cmd +/- to change zoom

---

### v4.1.3

- Bug fixes
