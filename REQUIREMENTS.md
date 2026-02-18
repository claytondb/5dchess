# 5D Chess: Multiverse Tactics
## Game Requirements Document

**Version:** 1.0  
**Date:** 2026-02-18  
**Status:** Initial Requirements  

---

## Table of Contents
1. [Game Overview & Vision](#1-game-overview--vision)
2. [Core Mechanics](#2-core-mechanics)
3. [Player Actions & Controls](#3-player-actions--controls)
4. [Win/Lose Conditions](#4-winlose-conditions)
5. [Game Modes](#5-game-modes)
6. [Units & Ships](#6-units--ships)
7. [Technical Requirements](#7-technical-requirements)
8. [MVP Scope](#8-mvp-scope)
9. [Full Vision](#9-full-vision)

---

## 1. Game Overview & Vision

### 1.1 Elevator Pitch
**"FTL meets 5D Chess"** — Command a fleet across branching timelines in real-time tactical combat. Send ships backward in time to undo disasters, create paradox traps, and outmaneuver enemies who exist across multiple realities simultaneously.

### 1.2 Core Fantasy
You are a **Temporal Fleet Commander** — a rare individual who perceives time non-linearly. While others experience moments sequentially, you see the branching tree of possibility and can direct your forces through it. Your enemies exist in single timelines; you exist in all of them at once.

### 1.3 What Makes This Unique

| Inspiration | What We Take | What We Add |
|-------------|--------------|-------------|
| **FTL** | Real-time pausable combat, ship systems, resource management, roguelike progression | Temporal dimension to all tactical decisions |
| **5D Chess** | Timeline branching, pieces moving through time, parallel board states | Real-time execution, ship crews, system damage |
| **5D Diplomacy** | Multiplayer temporal chaos, negotiation across timelines | Real-time combat resolution, visual clarity |

### 1.4 Design Pillars

1. **Temporal Tactics Over Twitch** — Winning requires thinking in 4+ dimensions, not fast clicking
2. **Readable Complexity** — The timeline system must be visually intuitive despite mathematical depth
3. **Meaningful Paradoxes** — Time travel has rules and costs; clever players exploit them
4. **Emergent Stories** — Every battle generates a unique narrative of "what could have been"

---

## 2. Core Mechanics

### 2.1 Time Model: "Quantum Turns"

The game uses a **hybrid real-time/turn-based system** called **Quantum Turns**:

```
REAL-TIME FLOW (Combat Phase)
├── Ships move and fire in real-time
├── Damage resolves continuously  
├── Player can PAUSE at any moment
│
TEMPORAL PHASE (During Pause)
├── Issue orders to any ship in any timeline
├── Queue "Temporal Jumps" (costly, strategic)
├── Preview timeline branches
└── UNPAUSE to resume real-time across ALL timelines
```

**Key Insight:** Time flows forward in real-time, but during pause, the player can issue orders that will cause ships to jump BACKWARD in time when unpaused, creating new timeline branches.

### 2.2 Timeline Branching

#### 2.2.1 How Branches Are Created
A new timeline branch is created when:
1. **Temporal Jump (Active):** Player orders a ship to jump backward N seconds
2. **Paradox Event (Reactive):** A ship is destroyed but also exists in the past of another timeline
3. **Quantum Collapse (Strategic):** Player deliberately "collapses" two similar timelines

#### 2.2.2 Timeline Rules

| Rule | Description |
|------|-------------|
| **Conservation of Mass** | A ship jumping backward creates a NEW ship in the new timeline; the original remains |
| **Paradox Cost** | If a ship meets its past self, both take "paradox damage" unless one jumps away |
| **Timeline Decay** | Branches with no player ships slowly "fade" (become read-only, then disappear) |
| **Anchor Points** | Key objectives (flagships, stations) "anchor" timelines and prevent decay |

#### 2.2.3 Timeline Limits
- **MVP:** Maximum 4 concurrent timelines
- **Full Vision:** Maximum 8 concurrent timelines with "timeline compression" mechanic

### 2.3 The Temporal Stack

Visualized as a **vertical stack** on the left side of screen:

```
┌─────────────────────────────────────────┐
│  TIMELINE ALPHA (Primary)      [NOW]    │  ← Current "present"
│  ═══════════════════════════════════    │
│  T-0s ────────────────────────── T-45s  │
│       🚀🚀🚀    ⚔️    💥               │
├─────────────────────────────────────────┤
│  TIMELINE BETA (Branch @T-30s)  [NOW]   │  ← Branched 30 seconds ago
│  ═══════════════════════════════════    │
│  T-0s ─────────────────── T-30s         │
│       🚀🚀      ⚔️    🚀                │
├─────────────────────────────────────────┤
│  TIMELINE GAMMA (Branch @T-15s) [DECAY] │  ← No friendly ships, fading
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  T-0s ──────── T-15s                    │
└─────────────────────────────────────────┘
```

**Interaction:**
- Click any timeline to focus main view on that reality
- Drag ships between timelines (costs Temporal Energy)
- Collapse/merge similar timelines (advanced mechanic)

### 2.4 Combat System

#### 2.4.1 Real-Time Core
- Ships have **position, velocity, facing** in 2D space (top-down)
- Weapons fire in arcs, travel time matters for projectiles
- Shields absorb damage, regenerate when not hit
- Systems can be targeted/damaged (engines, weapons, temporal drive)

#### 2.4.2 FTL-Style Systems
Each ship has systems that can be powered/damaged:

| System | Function | If Damaged |
|--------|----------|------------|
| **Engines** | Movement speed, dodge chance | Sitting duck |
| **Weapons** | Fire rate, damage | Can't attack |
| **Shields** | Damage absorption | Vulnerable |
| **Temporal Drive** | Enables time jumps | Stranded in timeline |
| **Life Support** | Crew survival | Crew slowly dies |
| **Sensors** | Vision range, targeting | Fog of war expands |

#### 2.4.3 Crew Management (Simplified from FTL)
- Crew are abstracted as **crew points** (not individual units)
- Assign crew points to systems to boost efficiency
- Crew can be injured/killed by hull breaches
- **Temporal Sickness:** Crew that jump too often become less effective

#### 2.4.4 The Temporal Dimension in Combat

**Scenario Example:**
1. Your flagship is about to be destroyed (T-0)
2. PAUSE → Order your escort (still alive) to jump back 20 seconds
3. UNPAUSE → The escort appears at T-20 in a NEW timeline (Beta)
4. In Timeline Beta, the escort warns your flagship
5. Timeline Alpha: Flagship destroyed. Timeline Beta: Flagship survives
6. You now have TWO realities — choose which to invest in

### 2.5 Temporal Energy

**Temporal Energy (TE)** is the core strategic resource:

| Action | TE Cost |
|--------|---------|
| Jump back 10 seconds | 10 TE |
| Jump back 30 seconds | 35 TE |
| Jump back 60 seconds | 80 TE |
| Jump BETWEEN timelines | 25 TE |
| Collapse two timelines | 50 TE |
| Maintain extra timeline | 5 TE/second |

**TE Generation:**
- Flagships generate 2 TE/second
- Temporal Beacons (captureable objectives) generate 3 TE/second
- Destroying enemy ships grants burst TE
- Some crew abilities boost TE generation

### 2.6 Paradox Mechanics

#### 2.6.1 Self-Encounter
When a ship occupies the same space-time as another version of itself:
- Both take **Paradox Damage** (5% hull/second)
- Creates visual distortion (cool VFX opportunity)
- One must jump away or be destroyed

#### 2.6.2 Causal Loops
If Ship A travels back and destroys Ship B before Ship B destroyed Ship A:
- **Grandfather Paradox** — both ships take massive damage
- Creates **Temporal Scar** on the map (hazardous zone)

#### 2.6.3 Paradox as Weapon
Advanced players can deliberately create paradoxes to:
- Damage enemy ships caught in temporal scars
- Force enemies to spend TE escaping
- Create zones of "temporal static" that block enemy jumps

---

## 3. Player Actions & Controls

### 3.1 Core Controls

| Input | Action |
|-------|--------|
| **Left Click** | Select ship/unit |
| **Right Click** | Move/Attack order |
| **Space** | Pause/Unpause (toggle) |
| **Tab** | Cycle through timelines |
| **Scroll Wheel** | Zoom in/out |
| **Middle Click Drag** | Pan camera |
| **1-4** | Quick-select ship groups |
| **T** | Open Temporal Jump menu |
| **C** | Open Timeline Collapse menu |

### 3.2 Temporal Jump Interface (During Pause)

1. Select ship(s)
2. Press **T** or click "Temporal Jump" button
3. **Time Slider** appears: Drag to select how far back (10s - 60s)
4. **Timeline Selector**: Choose which timeline to jump INTO (or create new)
5. **Preview**: Ghost showing where ship will appear
6. **Confirm** or **Cancel**
7. Jump queued — executes on unpause

### 3.3 Timeline Management Panel

Left sidebar showing all active timelines:
- **Click** to focus view
- **Drag ships** between timelines (if adjacent in time)
- **Merge button** (if timelines are similar enough)
- **Abandon button** (stop maintaining, let decay)
- **Color coding**: Green (healthy), Yellow (contested), Red (losing), Gray (decaying)

### 3.4 Information Displays

**Per-Timeline HUD:**
- Ship counts (friendly/enemy)
- Objective status
- Time offset from "present"
- TE drain rate

**Global HUD:**
- Total Temporal Energy
- TE generation rate
- Active timeline count
- Match timer (for competitive)

---

## 4. Win/Lose Conditions

### 4.1 Victory Conditions

#### 4.1.1 Primary: Temporal Dominance
**Win if:** At the end of the match (or when opponent concedes), you have **surviving flagships in more timelines than the opponent.**

Example:
- You: Flagships in Timeline A, B, C (3)
- Enemy: Flagships in Timeline A, D (2)
- **You win** even if your Timeline A is losing

#### 4.1.2 Alternative: Total Annihilation
**Win if:** Opponent has zero ships across ALL timelines.

#### 4.1.3 Alternative: Objective Control
**Win if:** Control key objectives (Temporal Beacons) in a majority of timelines for X seconds.

### 4.2 Defeat Conditions

- **Flagship Lost in ALL Timelines:** You have no anchor, all timelines decay, you lose
- **Timeline Bankruptcy:** Run out of TE with multiple timelines, they collapse into your worst-case scenario
- **Concession:** Player surrenders

### 4.3 Draw Conditions
- **Temporal Stalemate:** Both players have equal timeline presence, no progress for 2 minutes
- **Mutual Annihilation:** Both flagships destroyed in all timelines in same quantum turn

### 4.4 Campaign-Specific Conditions

- **Sector Clear:** Destroy all enemies OR escape via jump point in ANY timeline (you take the "best" outcome)
- **Boss Battles:** Destroy boss in ALL timelines (it exists everywhere)
- **Timed Escapes:** Survive until timer in at least ONE timeline

---

## 5. Game Modes

### 5.1 Campaign Mode (Single-Player)

#### 5.1.1 Structure
- **Roguelike structure** inspired by FTL
- Navigate a sector map with branching paths
- Each node is an encounter (combat, event, shop, etc.)
- Permadeath with meta-progression

#### 5.1.2 Narrative Frame
You are fleeing the **Chrono-Hegemony**, a faction that controls time travel and wants to eliminate "rogue temporals" like you. You must reach the Temporal Nexus at the end of 8 sectors to shatter their control.

#### 5.1.3 Campaign Mechanics
- **Ship Unlocks:** Win runs to unlock new flagship types
- **Crew Recruitment:** Find crew at events, hire at stations
- **Upgrades:** Spend scrap on ship systems, temporal tech
- **Events:** Text-based encounters with choices (some span timelines!)

#### 5.1.4 Temporal Events (Unique to this game)
- "You receive a distress signal... from YOURSELF, 30 seconds in the future"
- "A merchant offers to sell you a weapon. You realize you already have it — paradox loop?"
- "The enemy knows your moves before you make them. Someone from YOUR future is helping them."

### 5.2 Skirmish Mode (Single-Player vs AI)

- Quick battles with configurable settings
- Choose map, fleet size, starting TE, timeline limit
- AI difficulty levels: Cadet, Commander, Admiral, Temporal Lord
- Good for practice and experimentation

### 5.3 Multiplayer: Temporal Duel (1v1)

#### 5.3.1 Format
- Synchronous real-time
- Both players share the SAME timeline tree
- When Player A creates a branch, Player B sees it
- Matches last 10-20 minutes

#### 5.3.2 Balance Considerations
- Both players start with equal TE
- First-move advantage mitigated by "deployment phase"
- Comeback mechanics via TE from destroyed ships

#### 5.3.3 Ranked Play
- ELO-based matchmaking
- Seasonal ladders
- Visible rank tiers (Bronze → Temporal Transcendent)

### 5.4 Multiplayer: Multiverse War (2v2, 3v3)

#### 5.4.1 Format
- Team-based timeline control
- Larger maps with multiple objective zones
- Teams share TE pool, coordinate jumps
- Longer matches (20-40 minutes)

#### 5.4.2 Team Roles
- **Anchor:** Holds primary timeline, generates TE
- **Flanker:** Creates aggressive branches to harass
- **Closer:** Specializes in collapsing enemy timelines

### 5.5 Multiplayer: Asynchronous Campaign (Stretch Goal)

- Play-by-mail style temporal war
- Submit your turn (including temporal orders)
- System resolves when all players submit
- Each "turn" is 60 seconds of real-time (pre-simulated)

---

## 6. Units & Ships

### 6.1 Ship Classes

#### 6.1.1 Flagship (Capital)
- **Role:** Fleet anchor, TE generator, main firepower
- **Temporal Ability:** Cannot be targeted by paradox for 5 seconds after jump
- **Weakness:** Slow, huge target, losing it is catastrophic
- **Crew Capacity:** 8

#### 6.1.2 Cruiser
- **Role:** Frontline combat, balanced stats
- **Temporal Ability:** Can "drag" one adjacent ship when jumping
- **Weakness:** TE-expensive to maintain in multiple timelines
- **Crew Capacity:** 5

#### 6.1.3 Frigate
- **Role:** Fast attack, flanking
- **Temporal Ability:** Half-cost timeline jumps
- **Weakness:** Fragile, weak weapons
- **Crew Capacity:** 3

#### 6.1.4 Temporal Corvette
- **Role:** Timeline specialist
- **Temporal Ability:** Can jump between ANY timelines (not just adjacent)
- **Weakness:** No weapons, pure utility
- **Crew Capacity:** 2

#### 6.1.5 Drone Swarm (Deployed Unit)
- **Role:** Area denial, screening
- **Temporal Ability:** Immune to paradox (no consciousness)
- **Weakness:** Cannot jump independently, dies if parent ship jumps away
- **Crew Capacity:** 0 (automated)

### 6.2 Temporal Movement Rules by Ship Class

| Ship Class | Jump Range (Time) | Cross-Timeline | TE Cost Modifier |
|------------|-------------------|----------------|------------------|
| Flagship | 10-30 seconds | No | 1.5x |
| Cruiser | 10-45 seconds | Adjacent only | 1.0x |
| Frigate | 10-60 seconds | Adjacent only | 0.5x |
| Temporal Corvette | 10-60 seconds | Any | 0.75x |
| Drone Swarm | Cannot jump | No | N/A |

### 6.3 Weapons

| Weapon | Damage | Range | Special |
|--------|--------|-------|---------|
| **Pulse Laser** | Low | Medium | Fast fire rate, good vs shields |
| **Kinetic Cannon** | High | Long | Slow, ignores 50% shields |
| **Missile Pod** | Medium | Very Long | Tracking, can be shot down |
| **Temporal Disruptor** | Low | Short | Prevents target from jumping for 10s |
| **Paradox Torpedo** | Special | Medium | Creates paradox zone on impact |
| **Timeline Anchor** | None | Short | Prevents timeline from decaying |

### 6.4 Crew Specializations

| Specialization | Bonus |
|----------------|-------|
| **Pilot** | +15% dodge, +10% speed when assigned to Engines |
| **Gunner** | +20% fire rate when assigned to Weapons |
| **Engineer** | +30% repair speed, system damage -20% |
| **Temporal Navigator** | -25% TE cost for jumps |
| **Medic** | Crew heal +50%, paradox sickness recovery |
| **Boarder** | Can teleport to enemy ship (costs TE) |

---

## 7. Technical Requirements

### 7.1 Platform
- **Primary:** Web browser (Chrome, Firefox, Safari, Edge)
- **Technology:** TypeScript + WebGL (Pixi.js or Phaser)
- **Multiplayer:** WebSocket-based, authoritative server

### 7.2 Performance Targets

| Metric | Target |
|--------|--------|
| **Frame Rate** | 60 FPS (30 FPS minimum) |
| **Timeline Count** | Support 8 simultaneous without slowdown |
| **Ships per Timeline** | Up to 20 ships with full VFX |
| **Load Time** | <5 seconds on broadband |
| **Memory** | <500MB RAM |
| **Network** | Playable on 100ms latency |

### 7.3 Accessibility

- **Colorblind modes:** Distinct shapes for timeline states, not just colors
- **Pause-friendly:** Game is fully playable at slow pace
- **Scalable UI:** Support for various screen sizes
- **Keyboard-only play:** Full functionality without mouse (stretch goal)

### 7.4 Browser Requirements
- WebGL 2.0 support
- ES2020+ JavaScript
- LocalStorage for saves
- WebSocket support

### 7.5 Server Architecture (Multiplayer)

```
┌─────────────────────────────────────────────────┐
│                  GAME SERVER                     │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │
│  │  Timeline   │  │   Combat    │  │ Matchmaker│ │
│  │  Simulation │  │   Resolution│  │          │ │
│  └─────────────┘  └─────────────┘  └──────────┘ │
│                        │                         │
│              ┌─────────┴─────────┐               │
│              │   State Sync      │               │
│              │   (WebSocket)     │               │
│              └─────────┬─────────┘               │
└────────────────────────┼─────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────┴────┐     ┌────┴────┐     ┌────┴────┐
   │ Client 1 │     │ Client 2 │     │ Client N │
   │ (Browser)│     │ (Browser)│     │ (Browser)│
   └──────────┘     └──────────┘     └──────────┘
```

### 7.6 Data & Saves

- **Campaign Saves:** LocalStorage + optional cloud sync
- **Replay System:** Record all inputs, deterministic simulation
- **Match History:** Server-side for ranked play

---

## 8. MVP Scope

### 8.1 MVP Goal
**A playable vertical slice demonstrating core time-travel combat.**

### 8.2 MVP Features

#### 8.2.1 Core Loop
- [x] Real-time combat with pause
- [x] Basic ship movement and weapons
- [x] Temporal jumps (create branches)
- [x] 2-4 concurrent timelines
- [x] Basic win/lose (destroy enemy flagship in all timelines)

#### 8.2.2 Ships (MVP)
- [x] Flagship (1 type)
- [x] Frigate (1 type)
- [x] 2 weapon types (Laser, Missile)

#### 8.2.3 UI (MVP)
- [x] Main combat view (one timeline at a time)
- [x] Timeline stack sidebar (list view)
- [x] TE counter
- [x] Ship selection and orders
- [x] Pause overlay with temporal jump interface

#### 8.2.4 Game Modes (MVP)
- [x] Tutorial (3 scenarios teaching mechanics)
- [x] Skirmish vs AI (1 difficulty)

#### 8.2.5 Art & Audio (MVP)
- [x] Placeholder/simple 2D art (ships, backgrounds)
- [x] Basic sound effects (weapons, jumps, UI)
- [ ] No music required for MVP

### 8.3 MVP Exclusions
- ❌ Campaign mode
- ❌ Multiplayer
- ❌ Multiple ship types beyond Flagship/Frigate
- ❌ Crew management
- ❌ Timeline collapse/merge
- ❌ Paradox weapons
- ❌ Ranked play

### 8.4 MVP Success Criteria
1. **Playable:** Complete a full skirmish match without crashes
2. **Understandable:** Playtesters understand timeline branching within 10 minutes
3. **Fun:** Playtesters report "aha moments" when time travel clicks
4. **Stable:** 60 FPS with 4 timelines, 10 ships per timeline

---

## 9. Full Vision

### 9.1 Post-MVP Roadmap

#### Phase 1: Content & Polish (Month 2-3)
- Campaign mode (8 sectors, 50+ encounters)
- 3 additional ship classes
- 5 additional weapons
- Full audio (music, ambient, voice lines)
- Polished VFX (temporal distortion, paradox effects)

#### Phase 2: Multiplayer (Month 4-5)
- 1v1 Temporal Duel mode
- Matchmaking and lobbies
- Basic ranked ladder
- Anti-cheat measures

#### Phase 3: Expansion (Month 6+)
- 2v2 / 3v3 team modes
- Additional factions (different temporal abilities)
- User-generated scenarios
- Mobile port (touch controls)
- Steam release

### 9.2 Dream Features (Post-Launch)
- **Temporal Replay:** Watch your match from any timeline's perspective
- **Asynchronous Multiplayer:** Turn-based strategic play
- **Campaign Co-op:** Two players share a fleet across timelines
- **Level Editor:** Create custom encounters
- **Mod Support:** Custom ships, weapons, factions

### 9.3 Monetization (If Applicable)
- **Premium Game:** One-time purchase ($15-20)
- **Cosmetics:** Ship skins, timeline color themes
- **Expansions:** New campaigns, factions
- **NO pay-to-win mechanics**

---

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Timeline** | A single reality/branch of events |
| **Branch** | The act of creating a new timeline |
| **Temporal Jump** | A ship traveling backward in time |
| **TE (Temporal Energy)** | Resource used for all temporal actions |
| **Paradox** | When a ship meets itself or breaks causality |
| **Temporal Scar** | Hazardous zone created by paradox |
| **Anchor** | Ship or objective that prevents timeline decay |
| **Collapse** | Merging two similar timelines into one |
| **Quantum Turn** | One cycle of real-time + temporal resolution |

---

## Appendix B: Competitive Balance Considerations

### B.1 First-Move Advantage
- Deployment phase gives both players time to position
- Defender in "present" has information advantage
- Attacker creating branches has TE advantage

### B.2 Turtle Prevention
- Timeline maintenance costs encourage aggression
- Passive TE generation lower than aggressive play
- Objective control required for victory (not just survival)

### B.3 Snowball Prevention
- Ships destroyed grant TE to opponent
- Comeback mechanic: "Desperation Jump" (free jump when below 20% fleet)
- Timeline collapse can quickly close gaps

---

## Appendix C: Reference Games

| Game | What to Study |
|------|---------------|
| **FTL: Faster Than Light** | Pause-based real-time, ship systems, roguelike structure |
| **5D Chess with Multiverse Time Travel** | Timeline branching UI, piece movement through time |
| **Into the Breach** | Deterministic combat, seeing enemy intentions, puzzle-like tactics |
| **Braid** | Time manipulation as core mechanic, intuitive rewinding |
| **Achron** | RTS with time travel (study both successes and failures) |
| **Superhot** | "Time moves when you move" — clear temporal feedback |

---

*Document End*
