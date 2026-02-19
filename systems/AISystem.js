/**
 * AISystem - Controls enemy ship behavior
 * 
 * Basic AI that:
 * - Protects the flagship
 * - Attacks nearest enemy
 * - Uses simple formations
 */
class AISystem {
    constructor(scene, combatSystem) {
        this.scene = scene;
        this.combatSystem = combatSystem;
        this.updateInterval = 500; // AI thinks every 500ms
        this.lastUpdate = 0;
    }
    
    /**
     * Update AI for all enemy ships
     */
    update(time, delta) {
        // Only update AI periodically for performance
        if (time - this.lastUpdate < this.updateInterval) {
            return;
        }
        this.lastUpdate = time;
        
        // Get all enemy ships
        const enemyShips = this.combatSystem.ships.filter(s => !s.isPlayer && s.health > 0);
        
        for (const ship of enemyShips) {
            this.updateShipAI(ship, time);
        }
    }
    
    /**
     * Update AI for a single ship
     */
    updateShipAI(ship, time) {
        // Get enemies (player ships in same timeline)
        const enemies = this.combatSystem.getEnemies(ship);
        
        if (enemies.length === 0) {
            // No enemies - hold position
            return;
        }
        
        // Different behavior based on ship type
        if (ship.isFlagship) {
            this.flagshipBehavior(ship, enemies, time);
        } else {
            this.fighterBehavior(ship, enemies, time);
        }
    }
    
    /**
     * Flagship behavior: Stay back, attack from range
     */
    flagshipBehavior(ship, enemies, time) {
        // Find nearest enemy
        const nearest = this.findNearest(ship, enemies);
        if (!nearest) return;
        
        const dx = nearest.x - ship.x;
        const dy = nearest.y - ship.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Set target for attacking
        ship.setTarget(nearest);
        
        // Keep distance - flagship stays at max range
        const idealDistance = ship.range * 0.9;
        
        if (distance < idealDistance - 50) {
            // Too close - back away
            const angle = Math.atan2(-dy, -dx);
            ship.moveTo(
                ship.x + Math.cos(angle) * 100,
                ship.y + Math.sin(angle) * 100
            );
        } else if (distance > ship.range) {
            // Too far - move closer but carefully
            const angle = Math.atan2(dy, dx);
            ship.moveTo(
                ship.x + Math.cos(angle) * 50,
                ship.y + Math.sin(angle) * 50
            );
        }
    }
    
    /**
     * Fighter behavior: Aggressive, pursue and attack
     */
    fighterBehavior(ship, enemies, time) {
        // Prioritize enemy flagship if exists
        let target = enemies.find(e => e.isFlagship);
        
        // Otherwise attack nearest
        if (!target) {
            target = this.findNearest(ship, enemies);
        }
        
        if (!target) return;
        
        ship.setTarget(target);
        
        // Move towards target aggressively
        const dx = target.x - ship.x;
        const dy = target.y - ship.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > ship.range * 0.6) {
            // Move closer
            ship.moveTo(target.x, target.y);
        } else {
            // Circle strafe
            const angle = Math.atan2(dy, dx) + Math.PI / 4;
            const strafeDistance = ship.range * 0.5;
            ship.moveTo(
                target.x - Math.cos(angle) * strafeDistance,
                target.y - Math.sin(angle) * strafeDistance
            );
        }
    }
    
    /**
     * Find nearest entity
     */
    findNearest(ship, targets) {
        let nearest = null;
        let nearestDist = Infinity;
        
        for (const target of targets) {
            const dx = target.x - ship.x;
            const dy = target.y - ship.y;
            const dist = dx * dx + dy * dy;
            
            if (dist < nearestDist) {
                nearestDist = dist;
                nearest = target;
            }
        }
        
        return nearest;
    }
    
    /**
     * Spawn enemy reinforcements (called when creating new timeline)
     */
    spawnReinforcements(timelineIndex, count = 1) {
        // This would be called by TimelineManager when branching
        // For MVP, enemies are pre-placed
    }
}

// Export
if (typeof window !== 'undefined') {
    window.AISystem = AISystem;
}
