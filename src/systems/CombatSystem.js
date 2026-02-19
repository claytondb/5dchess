/**
 * CombatSystem - Manages combat interactions between ships
 */
class CombatSystem {
    constructor(scene) {
        this.scene = scene;
        this.ships = [];
        this.projectiles = [];
    }
    
    /**
     * Register a ship with the combat system
     */
    registerShip(ship) {
        this.ships.push(ship);
    }
    
    /**
     * Remove a ship from the combat system
     */
    unregisterShip(ship) {
        const index = this.ships.indexOf(ship);
        if (index > -1) {
            this.ships.splice(index, 1);
        }
    }
    
    /**
     * Get all ships in a specific timeline
     */
    getShipsInTimeline(timelineIndex) {
        return this.ships.filter(ship => ship.timelineIndex === timelineIndex);
    }
    
    /**
     * Get enemy ships for a given ship
     */
    getEnemies(ship) {
        return this.ships.filter(s => 
            s.isPlayer !== ship.isPlayer && 
            s.timelineIndex === ship.timelineIndex &&
            s.health > 0
        );
    }
    
    /**
     * Get friendly ships for a given ship
     */
    getAllies(ship) {
        return this.ships.filter(s => 
            s.isPlayer === ship.isPlayer && 
            s.timelineIndex === ship.timelineIndex &&
            s !== ship &&
            s.health > 0
        );
    }
    
    /**
     * Find nearest enemy to a ship
     */
    findNearestEnemy(ship) {
        const enemies = this.getEnemies(ship);
        if (enemies.length === 0) return null;
        
        let nearest = null;
        let nearestDist = Infinity;
        
        for (const enemy of enemies) {
            const dx = enemy.x - ship.x;
            const dy = enemy.y - ship.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = enemy;
            }
        }
        
        return nearest;
    }
    
    /**
     * Find flagship (cruiser) for a team in a timeline
     */
    findFlagship(isPlayer, timelineIndex) {
        return this.ships.find(s => 
            s.isPlayer === isPlayer && 
            s.timelineIndex === timelineIndex &&
            s.isFlagship &&
            s.health > 0
        );
    }
    
    /**
     * Check if any player flagships survive in any timeline
     */
    playerHasFlagship() {
        return this.ships.some(s => s.isPlayer && s.isFlagship && s.health > 0);
    }
    
    /**
     * Check if any enemy flagships survive in any timeline
     */
    enemyHasFlagship() {
        return this.ships.some(s => !s.isPlayer && s.isFlagship && s.health > 0);
    }
    
    /**
     * Get flagship status per timeline
     */
    getFlagshipStatus() {
        const playerFlagships = {};
        const enemyFlagships = {};
        
        for (const ship of this.ships) {
            if (ship.isFlagship && ship.health > 0) {
                if (ship.isPlayer) {
                    playerFlagships[ship.timelineIndex] = true;
                } else {
                    enemyFlagships[ship.timelineIndex] = true;
                }
            }
        }
        
        return { playerFlagships, enemyFlagships };
    }
    
    /**
     * Update all ships
     */
    update(time, delta) {
        for (const ship of this.ships) {
            if (ship.health > 0 && ship.active) {
                ship.update(time, delta);
            }
        }
        
        // Clean up destroyed ships
        this.ships = this.ships.filter(s => s.active);
    }
    
    /**
     * Get combat statistics
     */
    getStats() {
        const playerShips = this.ships.filter(s => s.isPlayer && s.health > 0);
        const enemyShips = this.ships.filter(s => !s.isPlayer && s.health > 0);
        
        return {
            playerCount: playerShips.length,
            enemyCount: enemyShips.length,
            playerHealth: playerShips.reduce((sum, s) => sum + s.health, 0),
            enemyHealth: enemyShips.reduce((sum, s) => sum + s.health, 0)
        };
    }
}

// Export
if (typeof window !== 'undefined') {
    window.CombatSystem = CombatSystem;
}
