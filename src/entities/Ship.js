/**
 * Ship - Base ship entity with movement, health, and weapons
 * 
 * Ship Types:
 * - Fighter: Fast, low HP, 1 weapon slot
 * - Cruiser: Slower, high HP, 2 weapon slots, acts as flagship
 */
class Ship extends Phaser.GameObjects.Container {
    constructor(scene, x, y, config = {}) {
        super(scene, x, y);
        
        this.scene = scene;
        scene.add.existing(this);
        
        // Ship configuration
        this.shipType = config.type || 'fighter';
        this.isPlayer = config.isPlayer !== undefined ? config.isPlayer : true;
        this.timelineIndex = config.timelineIndex || 0;
        this.isFlagship = config.isFlagship || false;
        
        // Stats based on ship type
        this.initializeStats();
        
        // Visual representation
        this.createVisuals();
        
        // Movement
        this.targetX = x;
        this.targetY = y;
        this.velocity = { x: 0, y: 0 };
        
        // Combat
        this.lastFireTime = 0;
        this.target = null;
        this.isSelected = false;
        
        // Temporal
        this.canTemporalJump = true;
        this.temporalCooldown = 0;
        
        // Make interactive
        this.setSize(this.shipSize * 2, this.shipSize * 2);
        this.setInteractive();
        
        // Selection indicator
        this.selectionRing = scene.add.circle(0, 0, this.shipSize + 8, 0x00ff00, 0);
        this.selectionRing.setStrokeStyle(2, 0x00ff00);
        this.add(this.selectionRing);
    }
    
    initializeStats() {
        const stats = {
            fighter: {
                maxHealth: 50,
                maxShields: 30,
                speed: 150,
                turnSpeed: 4,
                fireRate: 500, // ms between shots
                damage: 10,
                range: 200,
                size: 15
            },
            cruiser: {
                maxHealth: 150,
                maxShields: 75,
                speed: 80,
                turnSpeed: 2,
                fireRate: 800,
                damage: 25,
                range: 250,
                size: 25
            }
        };
        
        const s = stats[this.shipType] || stats.fighter;
        
        this.maxHealth = s.maxHealth;
        this.health = s.maxHealth;
        this.maxShields = s.maxShields;
        this.shields = s.maxShields;
        this.speed = s.speed;
        this.turnSpeed = s.turnSpeed;
        this.fireRate = s.fireRate;
        this.damage = s.damage;
        this.range = s.range;
        this.shipSize = s.size;
        this.rotation = 0;
    }
    
    createVisuals() {
        const graphics = this.scene.add.graphics();
        
        // Ship color based on team
        const baseColor = this.isPlayer ? 0x4488ff : 0xff4444;
        const outlineColor = this.isPlayer ? 0x88bbff : 0xff8888;
        
        // Different shapes for different ship types
        if (this.shipType === 'cruiser') {
            // Cruiser: Larger, more angular
            graphics.fillStyle(baseColor, 1);
            graphics.beginPath();
            graphics.moveTo(this.shipSize, 0);
            graphics.lineTo(-this.shipSize, -this.shipSize * 0.7);
            graphics.lineTo(-this.shipSize * 0.5, 0);
            graphics.lineTo(-this.shipSize, this.shipSize * 0.7);
            graphics.closePath();
            graphics.fillPath();
            
            // Outline
            graphics.lineStyle(2, outlineColor, 1);
            graphics.strokePath();
            
            // Flagship marker
            if (this.isFlagship) {
                graphics.fillStyle(0xffff00, 1);
                graphics.fillCircle(0, 0, 5);
            }
        } else {
            // Fighter: Small, triangular
            graphics.fillStyle(baseColor, 1);
            graphics.beginPath();
            graphics.moveTo(this.shipSize, 0);
            graphics.lineTo(-this.shipSize, -this.shipSize * 0.6);
            graphics.lineTo(-this.shipSize * 0.3, 0);
            graphics.lineTo(-this.shipSize, this.shipSize * 0.6);
            graphics.closePath();
            graphics.fillPath();
            
            // Outline
            graphics.lineStyle(1, outlineColor, 1);
            graphics.strokePath();
        }
        
        // Generate texture from graphics
        const key = `ship_${this.shipType}_${this.isPlayer ? 'player' : 'enemy'}_${this.isFlagship ? 'flag' : 'normal'}`;
        
        if (!this.scene.textures.exists(key)) {
            graphics.generateTexture(key, this.shipSize * 3, this.shipSize * 3);
        }
        graphics.destroy();
        
        // Create sprite from texture
        this.sprite = this.scene.add.image(0, 0, key);
        this.add(this.sprite);
        
        // Health bar background
        this.healthBarBg = this.scene.add.rectangle(0, -this.shipSize - 10, 30, 4, 0x333333);
        this.add(this.healthBarBg);
        
        // Health bar
        this.healthBar = this.scene.add.rectangle(0, -this.shipSize - 10, 30, 4, 0x00ff00);
        this.add(this.healthBar);
        
        // Shield bar
        this.shieldBar = this.scene.add.rectangle(0, -this.shipSize - 15, 30, 3, 0x00ffff);
        this.add(this.shieldBar);
    }
    
    /**
     * Set movement target
     */
    moveTo(x, y) {
        this.targetX = x;
        this.targetY = y;
    }
    
    /**
     * Set attack target
     */
    setTarget(target) {
        this.target = target;
    }
    
    /**
     * Update ship state
     */
    update(time, delta) {
        if (this.health <= 0) return;
        
        // Movement
        this.updateMovement(delta);
        
        // Combat
        this.updateCombat(time);
        
        // Shields regeneration
        this.updateShields(delta);
        
        // Update visuals
        this.updateVisuals();
        
        // Temporal cooldown
        if (this.temporalCooldown > 0) {
            this.temporalCooldown -= delta;
            if (this.temporalCooldown <= 0) {
                this.canTemporalJump = true;
            }
        }
    }
    
    updateMovement(delta) {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 5) {
            // Calculate target angle
            const targetAngle = Math.atan2(dy, dx);
            
            // Smoothly rotate towards target
            let angleDiff = targetAngle - this.rotation;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            
            this.rotation += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), this.turnSpeed * delta / 1000);
            
            // Move forward
            const moveSpeed = this.speed * delta / 1000;
            const moveDistance = Math.min(moveSpeed, distance);
            
            this.x += Math.cos(this.rotation) * moveDistance;
            this.y += Math.sin(this.rotation) * moveDistance;
        }
        
        // Update sprite rotation
        this.setRotation(this.rotation);
    }
    
    updateCombat(time) {
        if (!this.target || this.target.health <= 0) {
            this.target = null;
            return;
        }
        
        // Check range
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= this.range) {
            // Fire if cooldown is ready
            if (time - this.lastFireTime >= this.fireRate) {
                this.fireLaser(this.target);
                this.lastFireTime = time;
            }
        } else {
            // Move towards target
            this.moveTo(
                this.target.x - Math.cos(Math.atan2(dy, dx)) * (this.range * 0.8),
                this.target.y - Math.sin(Math.atan2(dy, dx)) * (this.range * 0.8)
            );
        }
    }
    
    updateShields(delta) {
        // Regenerate shields slowly
        if (this.shields < this.maxShields) {
            this.shields = Math.min(this.maxShields, this.shields + 5 * delta / 1000);
        }
    }
    
    updateVisuals() {
        // Update health bar
        const healthPercent = this.health / this.maxHealth;
        this.healthBar.setScale(healthPercent, 1);
        this.healthBar.setX(-15 * (1 - healthPercent));
        
        // Health bar color
        if (healthPercent > 0.6) {
            this.healthBar.setFillStyle(0x00ff00);
        } else if (healthPercent > 0.3) {
            this.healthBar.setFillStyle(0xffff00);
        } else {
            this.healthBar.setFillStyle(0xff0000);
        }
        
        // Update shield bar
        const shieldPercent = this.shields / this.maxShields;
        this.shieldBar.setScale(shieldPercent, 1);
        this.shieldBar.setX(-15 * (1 - shieldPercent));
        
        // Selection indicator
        this.selectionRing.setAlpha(this.isSelected ? 0.8 : 0);
    }
    
    /**
     * Fire laser at target
     */
    fireLaser(target) {
        // Create laser visual
        const laser = this.scene.add.line(
            0, 0,
            this.x, this.y,
            target.x, target.y,
            this.isPlayer ? 0x00ffff : 0xff6600
        );
        laser.setLineWidth(2);
        laser.setOrigin(0, 0);
        laser.setDepth(10);
        
        // Fade out laser
        this.scene.tweens.add({
            targets: laser,
            alpha: 0,
            duration: 150,
            onComplete: () => laser.destroy()
        });
        
        // Apply damage
        target.takeDamage(this.damage);
        
        // Emit event for combat log
        this.scene.events.emit('ship-attack', {
            attacker: this,
            target: target,
            damage: this.damage
        });
    }
    
    /**
     * Take damage (shields absorb first)
     */
    takeDamage(amount) {
        // Shields absorb damage first
        if (this.shields > 0) {
            const shieldDamage = Math.min(this.shields, amount);
            this.shields -= shieldDamage;
            amount -= shieldDamage;
            
            // Shield hit effect
            this.scene.tweens.add({
                targets: this.sprite,
                tint: 0x00ffff,
                duration: 50,
                yoyo: true
            });
        }
        
        // Remaining damage goes to hull
        if (amount > 0) {
            this.health -= amount;
            
            // Hit effect
            this.scene.tweens.add({
                targets: this.sprite,
                tint: 0xff0000,
                duration: 100,
                yoyo: true
            });
        }
        
        // Check death
        if (this.health <= 0) {
            this.die();
        }
    }
    
    /**
     * Ship destroyed
     */
    die() {
        // Explosion effect
        const explosion = this.scene.add.circle(this.x, this.y, 5, 0xff8800);
        
        this.scene.tweens.add({
            targets: explosion,
            scale: 4,
            alpha: 0,
            duration: 300,
            onComplete: () => explosion.destroy()
        });
        
        // Emit death event
        this.scene.events.emit('ship-destroyed', {
            ship: this,
            isPlayer: this.isPlayer,
            isFlagship: this.isFlagship,
            timelineIndex: this.timelineIndex
        });
        
        // Remove ship
        this.destroy();
    }
    
    /**
     * Select this ship
     */
    select() {
        this.isSelected = true;
    }
    
    /**
     * Deselect this ship
     */
    deselect() {
        this.isSelected = false;
    }
    
    /**
     * Get state for cloning
     */
    getState() {
        return {
            x: this.x,
            y: this.y,
            health: this.health,
            shields: this.shields,
            rotation: this.rotation,
            shipType: this.shipType,
            isPlayer: this.isPlayer,
            isFlagship: this.isFlagship
        };
    }
}

// Export
if (typeof window !== 'undefined') {
    window.Ship = Ship;
}
