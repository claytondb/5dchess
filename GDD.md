# 5D Chess: Multiverse Tactics
## Game Design Document v1.0

---

## Executive Summary

**5D Chess: Multiverse Tactics** is a real-time tactical spaceship combat game where players command a vessel across branching timelines. Combining the tense resource management and crew dynamics of FTL with the mind-bending multiverse navigation of 5D Chess, players don't just fight enemies—they fight *when* they fight them, creating and exploiting parallel timelines to outmaneuver opponents who exist across multiple temporal planes.

**Genre:** Real-time Tactics / Roguelike / Puzzle  
**Platform:** PC (Steam), potential console ports  
**Target Audience:** Strategy enthusiasts who loved FTL and want something that breaks their brain in the best way  
**Development Team Size:** 3-8 people  
**Estimated Development Time:** 18-24 months  

---

## 1. Game Pillars

### 🕰️ Pillar 1: Temporal Consequence
Every action ripples across timelines. Firing a missile in Timeline A might destroy the ship that would have sent reinforcements to Timeline B. Players must think not just tactically, but *temporally*—understanding that the present is just one layer of a much larger battlefield.

### ⚡ Pillar 2: Desperate Resourcefulness  
Inspired by FTL's "make do with what you have" tension. Ships are fragile, crew are precious, and temporal energy is finite. Victory comes from clever improvisation, not overwhelming force. You're always one bad jump away from disaster—but one clever temporal maneuver away from salvation.

### 🧩 Pillar 3: Readable Complexity
Like Into the Breach, the game must present complex systems with absolute clarity. Players should be able to see exactly what will happen, across all timelines, before committing to an action. The complexity is in the decision, not in parsing the UI.

### 🌀 Pillar 4: The "A-Ha!" Moment
The game should regularly produce moments where players suddenly *see* a solution that spans multiple timelines—where past, present, and future click together into an elegant victory. These moments of temporal enlightenment are the core emotional payoff.

---

## 2. Unique Selling Points

### What FTL Doesn't Have:
- **Multiverse Navigation:** Your past decisions don't just haunt you narratively—they literally exist as exploitable game states
- **Temporal Combat:** Send weapons, crew, or entire ships backward in time to change the present
- **Timeline Branches as Resources:** Creating alternate timelines isn't a failure state—it's a tactical tool

### What 5D Chess Doesn't Have:
- **Real-time Tension:** Decisions matter under pressure, not infinite contemplation
- **Ship Systems & Crew:** Manage power, repairs, boarding parties—now across time
- **Roguelike Progression:** Each run teaches you new temporal tricks; death is permanent but knowledge persists
- **Accessibility:** Visual clarity that makes multiverse navigation intuitive, not headache-inducing

### The Unique Combination:
> "What if you could send your FTL ship back in time to warn yourself about the ambush you're about to fly into?"

Players don't just replay failed encounters—they create parallel versions of encounters that all resolve simultaneously. Win in one timeline to unlock resources for another. Sacrifice a timeline to save the "prime" one. Play 4D chess with the universe itself.

---

## 3. Core Loop

### A Typical Run (45-90 minutes)

```
┌─────────────────────────────────────────────────────────────┐
│  SECTOR MAP                                                 │
│  Navigate between nodes (FTL-style), pursuing the flagship  │
│  Each node: encounter, shop, distress signal, or anomaly    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  ENCOUNTER                                                  │
│  Combat, dialogue, or puzzle—often all three                │
│  Time pauses for critical decisions (Into the Breach style) │
└────────────────────────┬────────────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
┌──────────────────┐          ┌──────────────────┐
│  RESOLVE LINEAR  │          │  BRANCH TIMELINE │
│  Standard win/   │          │  Create parallel │
│  loss outcome    │          │  encounter state │
└────────┬─────────┘          └────────┬─────────┘
         │                             │
         └──────────────┬──────────────┘
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  POST-ENCOUNTER                                             │
│  Collect scrap, repair, manage crew, allocate temporal      │
│  energy, choose next destination                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
                    [NEXT NODE]
```

### Session Pacing

1. **Early Game (Sectors 1-2):** Learn the ropes, minimal timeline complexity, build resources
2. **Mid Game (Sectors 3-5):** Actively juggling 2-3 timelines, making tough sacrifices
3. **Late Game (Sectors 6-7):** Convergence—timelines must merge for final assault
4. **Endgame (Final Sector):** Face the Temporal Flagship across all surviving timelines simultaneously

---

## 4. Time Travel Design

### 4.1 How Players Send Things Back in Time

**The Temporal Drive** is a ship system (like FTL's engines or shields) that can be powered up to enable time manipulation.

**Basic Temporal Actions:**

| Action | Cost | Effect |
|--------|------|--------|
| **Temporal Scan** | 1 Energy | See 10 seconds into the future across all timelines |
| **Chronoport** | 2 Energy | Send a small object (grenade, data packet) back 30 seconds |
| **Rewind Crew** | 3 Energy | Return one crew member to their position/state 30 seconds ago |
| **Branch Jump** | 5 Energy | Create a full timeline split at a decision point |
| **Convergence** | 8 Energy | Merge two timelines (both must "agree" on the merge state) |

**The "Send-Back" Mechanic:**
When you Chronoport an object, a ghostly "temporal echo" appears in the timeline at the moment you're sending to. You place it anywhere in the encounter area. When time "catches up," the object materializes. 

*Example:* You're losing a fight. You Chronoport a fusion bomb back 30 seconds, placing it where the enemy ship *was*. In the present, that ship is now debris—because it was destroyed 30 seconds ago by a bomb that "arrived" from the future.

### 4.2 What Creates a Timeline Branch

**Branching Triggers:**

1. **Explicit Branch Jump:** Player spends 5 Temporal Energy to deliberately fork reality
2. **Paradox Events:** If you change the past in a way that prevents you from sending the thing that changed it (killing your past self, etc.), the timeline splits to resolve the paradox
3. **Story Branches:** Certain critical choices fork the narrative (save the station vs. raid it)
4. **Death Prevention:** If your ship would be destroyed, you can emergency-branch, creating a timeline where you died and one where you narrowly survived (at massive cost)

**Branch Rules:**
- Maximum 4 active timelines at once (hardware/cognitive limit)
- Timelines share some resources (knowledge, unlocks) but not others (crew, hull)
- If all timelines end in death, the run ends

### 4.3 Perceiving and Navigating Multiple Timelines

**The Timeline Bar:**
A horizontal bar at the top of the screen shows all active timelines as parallel tracks. The "prime" timeline (your focus) is large and centered; others are smaller above/below.

```
    Timeline α (branched 2 min ago) ═══════════════●═══▶
    
    ╔══════════════════════════════════════════════════╗
    ║  PRIME TIMELINE                            ●════▶║
    ╚══════════════════════════════════════════════════╝
    
    Timeline γ (branched 5 min ago) ═══════════●═══════▶
```

**Switching Focus:**
- Tab/Hotkey to cycle through timelines
- Each timeline runs in real-time, but you can only give orders in your focused one
- AI assists unfocused timelines (set behaviors: aggressive, defensive, evasive)
- **Slow-Mo Mode:** Hold spacebar to slow all timelines to 10% speed for complex coordination

**Visual Clarity:**
- Each timeline has a distinct color tint (prime = neutral, others = subtle hues)
- "Temporal Echoes" show ghostly outlines of objects/crew that exist in other timelines
- Connection lines show causality (this missile came from that timeline's future)

### 4.4 Limits and Costs

**Temporal Energy:**
- Generated slowly by the Temporal Drive (1 energy per 20 seconds base)
- Maximum capacity: 10 (upgradeable to 15)
- Rare Chronocrystals can be spent for instant energy
- Some encounters reward bonus energy

**The Paradox Meter:**
- Each timeline manipulation adds to the Paradox Meter (0-100%)
- At 25%/50%/75%: Temporal anomalies spawn (enemy reinforcements from collapsed timelines)
- At 100%: **Temporal Collapse**—all timelines forcibly merge into a worst-case scenario

**Timeline Decay:**
- Non-prime timelines slowly "decay" (visual static, reduced crew effectiveness)
- Must spend 2 Energy periodically to stabilize a timeline or let it collapse
- Collapsed timelines are gone—anything unique to them is lost

**Branch Limits:**
- Only 4 timelines max
- Branching while at 4 forces you to collapse one
- Each branch costs exponentially more energy (5, 7, 10, 14...)

---

## 5. Combat System

### 5.1 Ship Types

**Player Ships (Unlockable):**

| Ship | Style | Special Ability |
|------|-------|-----------------|
| **The Ouroboros** (Starter) | Balanced | "Recall": Rewind ship position 10 seconds for 1 Energy |
| **The Paradox** | Glass Cannon | "Overwrite": Replace an enemy's past action with nothing |
| **The Eternal** | Tank | "Temporal Shield": Damage dealt to you is spread across 3 seconds |
| **The Echo** | Swarm | "Duplicate": Create a temporary copy of your ship from 30 seconds ago |
| **The Singularity** | Stealth | "Phase": Exist in a quantum state, untargetable but unable to act |
| **The Ancestor** | Support | "Legacy": Buff a past version of yourself that echoes forward |

**Enemy Ship Classes:**

- **Drones:** Weak but numerous, overwhelm through attrition
- **Cruisers:** Balanced threats with varied loadouts
- **Carriers:** Spawn drones, vulnerable but dangerous if ignored
- **Temporal Hunters:** Can follow you across timelines, very dangerous
- **The Flagship:** End boss, exists in all timelines simultaneously

### 5.2 Weapons and Systems

**Weapon Categories:**

| Type | Behavior | Temporal Interaction |
|------|----------|---------------------|
| **Lasers** | Instant hit, blocked by shields | Can be "time-locked" to hit multiple timelines at once |
| **Missiles** | Travel time, bypass shields | Can be Chronoported to arrive in the past |
| **Beams** | Sustained damage, pierce multiple rooms | "Temporal Beam" damages across timeline boundaries |
| **Bombs** | Teleport directly into enemy ships | "Paradox Bomb" creates a branch if it kills a key system |
| **Ion** | Disable systems temporarily | "Stasis Field" freezes a target across all timelines |

**Ship Systems:**

- **Temporal Drive** (Unique): Powers all time manipulation
- **Shields:** Standard protection, recharge over time
- **Engines:** Evasion and FTL charging
- **Weapons:** Slots for offensive loadout
- **Sensors:** See enemy ship layout; upgraded = see their timeline intentions
- **Crew Teleporter:** Board enemies or recall crew
- **Medbay/Clone Bay:** Heal or resurrect crew
- **Drone Control:** Automated support units

### 5.3 Combat Across Timelines

**Multi-Timeline Battle Resolution:**

Combat happens in all active timelines simultaneously. You manage your prime timeline directly; others run on AI routines you've set.

**Cross-Timeline Interactions:**

1. **Resource Sharing:** Scrap/items collected in one timeline can be Chronoported to another
2. **Intel Sharing:** If you defeat an enemy in Timeline A, you learn their attack pattern—visible in all timelines
3. **Sacrifice Plays:** Ramming your ship in Timeline B to destroy a carrier might be worth it if Timeline A survives
4. **Convergent Attacks:** Some weapons can target enemies across timelines—hit the same ship in 3 timelines at once for massive damage

**Enemy Timeline Awareness:**

- Basic enemies only exist in their timeline, unaware of others
- **Temporal Hunters** can see all timelines and target your weakest one
- **The Flagship** coordinates attacks across timelines—it might feint in one and alpha-strike another

**Resolution:**

At encounter end, you choose which surviving timeline becomes your new "prime." Others can be:
- **Collapsed:** Resources converted to scrap at 50% value
- **Maintained:** Costs Temporal Energy per sector but keeps options open
- **Converged:** Merge timelines if their states are compatible (both won the fight)

---

## 6. Progression System

### 6.1 Roguelike Elements

**Run Structure:**
- Each run starts fresh with a basic ship and minimal resources
- ~7 sectors with 15-20 nodes each
- Permadeath: ship destruction ends the run (unless you emergency-branch)
- Runs take 45-90 minutes

**In-Run Progression:**
- Scrap → Buy weapons, systems, crew, upgrades at stores
- Fuel/Missiles/Drones → Consumables for abilities
- Temporal Energy → Generated and spent constantly
- Crew Experience → Leveled crew gain small bonuses

### 6.2 Meta-Progression (Between Runs)

**Unlocks:**
- New ships (6 total, each with 2-3 loadout variants)
- Ship achievements unlock loadout variants
- New weapons/systems added to the item pool
- New encounter types and events

**Temporal Mastery Points (TMP):**
Earned from successful maneuvers:
- "Send an object back that changes the battle outcome" → 10 TMP
- "Win an encounter using only timeline manipulation" → 50 TMP
- "Maintain 4 timelines simultaneously for 60 seconds" → 25 TMP

**TMP Purchases:**
- Lore entries explaining the game's temporal physics
- Challenge modifiers (hard mode options)
- Cosmetic ship skins
- Alternative crew species

**Persistent Knowledge:**
Even when you die, you retain:
- Enemy bestiary data (attack patterns, weaknesses)
- Event outcomes (know what choices lead where)
- Map seeds that were particularly challenging/rewarding

### 6.3 How Time Travel Affects Progression

**The Chronicle:**
A special log of your most impressive temporal maneuvers. Successfully creating a paradox that wins an impossible fight? Recorded. Finding a way to save all timelines? Recorded.

**Temporal Echoes of Past Runs:**
Occasionally, you'll encounter a "ghost ship"—an echo of one of your previous run's ships at the moment it was destroyed. Help the ghost complete unfinished business for bonus rewards.

**Ancestor Mode (Unlocked after 5 wins):**
Start a run where you can Chronoport a single item from a previous winning run's loadout. Choose wisely.

---

## 7. Visual Style

### Art Direction

**Aesthetic:** "Neon Retrofuturism"  
Think 1980s sci-fi book covers meets modern indie polish. Bold shapes, dramatic lighting, and a color palette that shifts subtly based on timeline state.

**Core Visual Elements:**

- **Ships:** Silhouettes first—each ship instantly recognizable by outline. Detailed but not cluttered. Think FTL's clarity meets Transistor's style.
- **Timelines:** Each timeline has a subtle color grade (Prime = neutral/blue, Alt1 = warm amber, Alt2 = cool violet, Alt3 = green-teal). This lets players orient at a glance.
- **Temporal Effects:** Ghostly, holographic distortions. Time-travel actions ripple with concentric light rings. Causality lines are thin, glowing threads connecting related events.
- **Space:** Rich nebula backgrounds, parallax layers. Each sector has a distinct visual identity (crystalline asteroid fields, bioluminescent gas clouds, war-torn wreckage fields).

**UI Philosophy:**
- "Everything you need, nothing you don't"
- Large, readable fonts
- Minimal HUD when not in combat; more information surfaces during tactical decision points
- The Timeline Bar is always visible but unobtrusive
- Color-blind accessibility modes

**Resolution/Fidelity:**
2D with high-resolution sprites and particle effects. Target 4K support but should look excellent at 1080p. Modest system requirements (integrated graphics should handle it).

### Reference Points
- FTL (clarity, silhouettes)
- Transistor (color, atmosphere)
- Into the Breach (information hierarchy)
- Hyper Light Drifter (color palette)
- The banner/logo style of 5D Chess (multiverse visualization)

---

## 8. Audio Design

### Music

**Style:** Synthwave meets orchestral tension  
Adaptive soundtrack that responds to:
- Combat state (exploration = ambient, combat = driving)
- Timeline count (1 = clean mix, 4 = layered/complex)
- Danger level (low health = desperate themes)

**Key Motifs:**
- **Main Theme:** Pulsing synths with a mournful brass melody—hopeful but desperate
- **Combat:** Driving bass, rapid arpeggios, drums that match weapons fire tempo
- **Temporal Manipulation:** Pitched/slowed/reversed instrument samples when time is being altered
- **Each Ship:** Subtle unique motif layered into the music

**Audio Budget Strategy:**
Procedural music system with ~20 stems that combine dynamically. Reduces file size while maximizing variety.

### Sound Effects

**Design Goals:**
1. **Clarity:** Every sound communicates vital information. Shield hit sounds different from hull breach sounds.
2. **Timeline Differentiation:** Each timeline has a subtle audio filter (prime = clean, alt = slight echo/phase)
3. **Satisfying Feedback:** Weapon impacts, temporal manipulation, and victories should feel visceral.

**Key Sounds:**
- **Temporal Drive Charging:** Rising whine, like a camera flash charging
- **Branch Creation:** Deep, reality-tearing bass drop with high shimmer
- **Chronoport:** Whoosh + reverse-reverb (sound of something "arriving" from the future)
- **Paradox Warning:** Discordant, reality-glitching stutter
- **Convergence:** Harmonic resolution—discordant tones merging into a chord

**Voice:**
- Minimal—ship AI gives critical warnings only
- Optional: unlockable voice packs for different AI personalities
- No crew chatter (keeps audio clean, reduces localization cost)

---

## 9. Monetization

### Model: Premium with Optional DLC

**Base Game:** $19.99 USD
Full game with:
- 6 ships (18 loadout variants)
- 7 sectors
- Complete meta-progression system
- All core content

**Rationale:**
- FTL price point, proven for indie roguelikes
- No F2P: time manipulation mechanics would tempt pay-to-skip designs that undermine the game
- Premium respects player time and developer sustainability

### Optional DLC (Post-Launch)

**Expansion 1: "Shattered Dimensions"** ($7.99)
- 2 new ships
- New sector type with unique mechanics
- New enemy faction: The Collapsed (beings from failed timelines)
- New final boss variant

**Expansion 2: "Infinite Recursion"** ($7.99)
- Endless mode
- Daily Challenge runs with leaderboards
- 2 additional ships
- Mod support tools

**Cosmetic DLC:**
- Ship skin packs ($2.99 each)
- Alternative music packs ($3.99 each)
- Crew species visual variants ($1.99 each)

### What We Won't Do
- No loot boxes
- No energy/lives systems
- No gameplay advantages for purchase
- No subscriptions
- No ads

---

## 10. Competitive Analysis

### FTL: Faster Than Light (2012)

**Similarities:**
- Sector-based roguelike progression
- Pause-able real-time combat
- Ship systems and crew management
- Resource scarcity tension

**Our Differentiation:**
- Multiverse mechanic adds strategic depth FTL can't match
- Time manipulation creates puzzle-like encounter design
- Modern visual polish (FTL is beloved but dated)
- More agency in "unfair" situations (branch to escape impossible fights)

**Their Advantage:**
- Established classic with dedicated fanbase
- Simpler to learn and pick up

---

### 5D Chess with Multiverse Time Travel (2020)

**Similarities:**
- Multiverse visualization
- Sending pieces/units back in time
- Timeline branching and management

**Our Differentiation:**
- Real-time creates tension 5D Chess lacks
- Approachable—not purely abstract strategy
- Story/campaign gives context to mechanics
- Roguelike progression adds replayability

**Their Advantage:**
- Pure strategy appeal
- PvP multiplayer from the start

---

### Into the Breach (2018)

**Similarities:**
- Tactical combat with perfect information
- Small-scale, meaningful decisions
- Time manipulation (rewind mechanic)

**Our Differentiation:**
- Real-time vs. turn-based
- Multiple simultaneous timelines vs. single rewind
- Longer runs with more narrative arc

**Their Advantage:**
- Tighter scope, easier to balance
- Turn-based accessibility

---

### Braid (2008)

**Similarities:**
- Time manipulation as core mechanic
- Puzzle-like problem solving
- Actions with temporal consequence

**Our Differentiation:**
- Combat-focused vs. platforming
- Roguelike replayability vs. linear campaign
- Multiplayer potential

**Their Advantage:**
- Narrative/artistic focus
- Completed masterpiece status

---

### Market Position Statement

> "5D Chess: Multiverse Tactics is **FTL for the player who wished they could undo their mistakes—but in a way that creates new problems**. It's **5D Chess for people who want stakes and story**. It's **Into the Breach if you could play multiple boards at once**."

We're targeting the intersection of:
- FTL fans (3M+ copies sold) who want something new
- Strategy gamers seeking mechanical innovation
- Puzzle enthusiasts who enjoy mind-bending systems
- Roguelike community always hunting the next great run

---

## Appendix A: Development Priorities

### MVP (Minimum Viable Product)
1. Core temporal mechanics (branch, chronoport, convergence)
2. 2 playable ships with distinct abilities
3. 3 sectors with basic encounters
4. Timeline visualization UI
5. Basic enemy AI and 3 enemy types
6. One complete run possible from start to final boss

### Alpha Goals
- All 6 ships playable
- All 7 sectors with encounters
- Full meta-progression system
- Enemy variety complete
- Balance pass #1

### Beta Goals
- All content complete
- Localization support
- Accessibility features
- Balance pass #2-3
- External playtesting

### Launch
- Full polish
- Achievement system
- Steam integration
- Marketing push

---

## Appendix B: Technical Considerations

### Engine Recommendation
**Godot 4.x** or **Unity 2D**
- Both handle 2D excellently
- Godot: better for small teams, fully open source, lighter weight
- Unity: larger asset ecosystem, better for potential ports

### Key Technical Challenges

1. **Timeline State Management:** Each timeline is essentially a parallel game state. Need efficient serialization.
2. **Causality Tracking:** When something changes in the past, need to recalculate downstream effects without breaking performance.
3. **UI/UX for 4 Simultaneous States:** Render multiple game states clearly without overwhelming the player.
4. **Save System:** Saving a branched multiverse run is complex. Consider "sector checkpoint" saves only.

### Performance Targets
- 60 FPS minimum on mid-range hardware
- 4 timelines should not drop below 30 FPS
- Sub-100ms response time on temporal actions
- Total install size: <2GB

---

## Appendix C: Open Questions

For future design sessions:

1. **Multiplayer:** Is there a viable PvP mode where players exist in parallel timelines trying to sabotage each other?
2. **Modding:** How deep should mod support go? Custom ships? Custom events? Custom mechanics?
3. **Difficulty Scaling:** How do we handle players who find timeline management overwhelming?
4. **Mobile Port:** Is the UI possible on touch screens, or is this PC-only?
5. **Narrative Depth:** How much story do we weave in? FTL-light or full campaign?

---

*Document Version 1.0*  
*Last Updated: February 2026*  
*Author: Product Design Team*

---

> "The future is already written. Your job is to write it better."
> — Loading screen tip
