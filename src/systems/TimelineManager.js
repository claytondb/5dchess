/**
 * TimelineManager - Handles branching timelines and temporal mechanics
 * 
 * Each timeline is a complete game state snapshot that can evolve independently.
 * Ships can jump between timelines or back in time (creating new branches).
 */
class TimelineManager {
    constructor(scene) {
        this.scene = scene;
        this.timelines = [];
        this.activeTimelineIndex = 0;
        this.maxTimelines = 3;
        this.temporalEnergy = 100;
        this.maxTemporalEnergy = 100;
        this.teRegenRate = 2; // per second
        
        // Timeline colors for visual distinction
        this.timelineColors = [
            0x4488ff, // Alpha - Blue
            0x44ff88, // Beta - Green  
            0xff8844  // Gamma - Orange
        ];
        
        this.timelineNames = ['α', 'β', 'γ'];
    }
    
    /**
     * Initialize with the first timeline
     */
    initialize(initialState) {
        this.timelines = [{
            id: 0,
            name: 'α',
            color: this.timelineColors[0],
            createdAt: 0,
            branchedFrom: null,
            branchTime: 0,
            state: this.cloneState(initialState),
            ships: [], // Will hold ship references
            isActive: true,
            health: 100 // Timeline stability
        }];
        this.activeTimelineIndex = 0;
    }
    
    /**
     * Get the currently active timeline
     */
    getActiveTimeline() {
        return this.timelines[this.activeTimelineIndex];
    }
    
    /**
     * Get all timelines
     */
    getAllTimelines() {
        return this.timelines;
    }
    
    /**
     * Switch to a different timeline
     */
    switchTimeline(index) {
        if (index >= 0 && index < this.timelines.length) {
            this.timelines[this.activeTimelineIndex].isActive = false;
            this.activeTimelineIndex = index;
            this.timelines[index].isActive = true;
            return true;
        }
        return false;
    }
    
    /**
     * Create a new timeline branch (temporal jump)
     * @param {Ship} ship - The ship performing the jump
     * @param {number} jumpBackSeconds - How far back to jump
     * @returns {object|null} - New timeline or null if failed
     */
    createBranch(ship, jumpBackSeconds = 10) {
        // Check if we can create more timelines
        if (this.timelines.length >= this.maxTimelines) {
            console.log('Maximum timelines reached!');
            return null;
        }
        
        // Calculate TE cost (10 TE per 10 seconds)
        const teCost = Math.floor(jumpBackSeconds);
        if (this.temporalEnergy < teCost) {
            console.log('Not enough Temporal Energy!');
            return null;
        }
        
        // Deduct temporal energy
        this.temporalEnergy -= teCost;
        
        // Create new timeline
        const newIndex = this.timelines.length;
        const currentTime = this.scene.gameTime || 0;
        const branchTime = currentTime - (jumpBackSeconds * 1000);
        
        const newTimeline = {
            id: newIndex,
            name: this.timelineNames[newIndex] || `T${newIndex}`,
            color: this.timelineColors[newIndex] || 0xffffff,
            createdAt: currentTime,
            branchedFrom: this.activeTimelineIndex,
            branchTime: branchTime,
            state: this.cloneState(this.timelines[this.activeTimelineIndex].state),
            ships: [],
            isActive: false,
            health: 100
        };
        
        this.timelines.push(newTimeline);
        
        // Clone the ship into the new timeline
        if (ship) {
            this.cloneShipToTimeline(ship, newIndex, branchTime);
        }
        
        console.log(`Created timeline ${newTimeline.name} branching from T-${jumpBackSeconds}s`);
        return newTimeline;
    }
    
    /**
     * Clone a ship to a new timeline
     */
    cloneShipToTimeline(ship, timelineIndex, branchTime) {
        // This will be called by CombatScene to create the actual ship instance
        this.scene.events.emit('ship-clone', {
            originalShip: ship,
            targetTimeline: timelineIndex,
            branchTime: branchTime
        });
    }
    
    /**
     * Deep clone a state object
     */
    cloneState(state) {
        if (!state) return {};
        return JSON.parse(JSON.stringify(state));
    }
    
    /**
     * Update temporal energy regeneration
     */
    update(delta) {
        // Regenerate TE over time
        if (this.temporalEnergy < this.maxTemporalEnergy) {
            this.temporalEnergy = Math.min(
                this.maxTemporalEnergy,
                this.temporalEnergy + (this.teRegenRate * delta / 1000)
            );
        }
        
        // Decay inactive timelines slightly (if no player ships)
        for (let timeline of this.timelines) {
            if (!timeline.isActive && timeline.ships.length === 0) {
                timeline.health -= 0.1 * delta / 1000;
            }
        }
        
        // Remove collapsed timelines
        this.timelines = this.timelines.filter(t => t.health > 0);
    }
    
    /**
     * Get temporal energy as percentage
     */
    getTemporalEnergyPercent() {
        return (this.temporalEnergy / this.maxTemporalEnergy) * 100;
    }
    
    /**
     * Check win condition: player flagship survives in majority of timelines
     */
    checkWinCondition(playerFlagshipAlive, enemyFlagshipAlive) {
        let playerWins = 0;
        let enemyWins = 0;
        
        for (let i = 0; i < this.timelines.length; i++) {
            if (playerFlagshipAlive[i]) playerWins++;
            if (enemyFlagshipAlive[i]) enemyWins++;
        }
        
        if (playerWins > this.timelines.length / 2 && enemyWins === 0) {
            return 'PLAYER_WIN';
        }
        if (enemyWins > this.timelines.length / 2 && playerWins === 0) {
            return 'ENEMY_WIN';
        }
        return null;
    }
    
    /**
     * Get timeline status for UI
     */
    getTimelineStatus() {
        return this.timelines.map((t, i) => ({
            index: i,
            name: t.name,
            color: t.color,
            isActive: i === this.activeTimelineIndex,
            health: t.health,
            shipCount: t.ships ? t.ships.length : 0
        }));
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.TimelineManager = TimelineManager;
}
