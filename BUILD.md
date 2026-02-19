# 5D Chess: Multiverse Tactics - MVP Build Instructions

## Quick Start

### Option 1: Direct Browser (Simplest)
1. Open `src/index.html` directly in your browser
2. Game will load Phaser from CDN automatically
3. Play!

### Option 2: Local Server (Recommended)
```bash
cd dc-5dchess
npm install
npm start
```
Then open http://localhost:8080 in your browser.

## Game Controls

| Key | Action |
|-----|--------|
| **SPACE** | Pause / Unpause game |
| **Left Click** | Select your ship |
| **Right Click** | Move order (on empty space) or Attack order (on enemy) |
| **T** | Temporal Jump - Create a new timeline branch (when paused) |
| **1-3** | Switch between active timelines |

## How to Play

### Objective
Destroy the enemy flagship (cruiser with yellow marker) in ALL timelines to win.

### Core Mechanics

1. **Real-time Combat with Pause**
   - Combat runs in real-time
   - Press SPACE to pause anytime
   - While paused, issue orders and plan temporal jumps
   - Unpause to see actions resolve

2. **Ships**
   - **Cruiser (Large)**: Your flagship, high HP, slower
   - **Fighter (Small)**: Fast, lower HP, escort ships

3. **Temporal Jumps**
   - Select a ship, press T while paused
   - Creates a new timeline branch
   - Your ship is cloned into the new timeline
   - Maximum 3 timelines allowed
   - Costs Temporal Energy (regenerates over time)

4. **Timeline Strategy**
   - Each timeline runs independently
   - Use timelines to explore different tactical approaches
   - Win by destroying enemy flagship in ALL timelines
   - Lose if your flagship is destroyed in ALL timelines

### Tips
- Use pause liberally to coordinate attacks
- Create timeline branches when you're about to lose a critical ship
- Target the enemy flagship to win faster
- Switch between timelines (1-3 keys) to check all battles

## Project Structure

```
dc-5dchess/
├── src/
│   ├── index.html          # Entry point
│   ├── main.js             # Phaser game config
│   ├── scenes/
│   │   ├── BootScene.js    # Loading screen
│   │   └── CombatScene.js  # Main game scene
│   ├── entities/
│   │   └── Ship.js         # Ship class
│   └── systems/
│       ├── TimelineManager.js  # Timeline branching
│       ├── CombatSystem.js     # Combat logic
│       └── AISystem.js         # Enemy AI
├── assets/                 # (placeholder for future assets)
├── package.json
└── BUILD.md               # This file
```

## Tech Stack
- **Phaser 3.70** - 2D game framework
- **Vanilla JavaScript** - No build step required
- **HTML5 Canvas** - Rendering

## MVP Features Implemented
- ✅ Real-time combat with pause
- ✅ 2 ship types (Fighter, Cruiser)
- ✅ Laser weapons
- ✅ Temporal Jump creates timeline branches
- ✅ Maximum 3 timelines
- ✅ Basic AI opponent
- ✅ Win/Lose detection across timelines
- ✅ Timeline ribbon UI
- ✅ Temporal energy system

## Known Limitations (MVP)
- Ships render as colored shapes (no sprites)
- No sound effects
- AI is basic (attack nearest enemy)
- No timeline merge/collapse mechanic
- No save/load
