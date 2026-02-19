/**
 * Ship - Enhanced ship entity with modern visuals
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
        this.createEngineParticles();
        
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
        this.setSize(this.shipSize * 2.5, this.shipSize * 2.5);
        this.setInteractive();
        
        // Set depth for proper layering
        this.setDepth(10);
    }
    
    initializeStats() {
        const stats = {
            fighter: {
                maxHealth: 50,
                maxShields: 30,
                speed: 150,
                turnSpeed: 4,
                fireRate: 500,
                damage: 10,
                range: 200,
                size: 18
            },
            cruiser: {
                maxHealth: 150,
                maxShields: 75,
                speed: 80,
                turnSpeed: 2,
                fireRate: 800,
                damage: 25,
                range: 250,
                size: 28
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
        // Team colors
        const teamColors = this.isPlayer ? {
            primary: 0x2288ff,
            secondary: 0x66bbff,
            glow: 0x00aaff,
            engine: 0x00ffff
        } : {
            primary: 0xff3333,
            secondary: 0xff7777,
            glow: 0xff4400,
            engine: 0xff6600
        };
        
        this.teamColors = teamColors;
        
        // Create glow effect (behind ship)
        this.glow = this.scene.add.graphics();
        this.glow.fillStyle(teamColors.glow, 0.3);
        this.glow.fillCircle(0, 0, this.shipSize * 1.5);
        this.add(this.glow);
        
        // Ship body graphics
        const graphics = this.scene.add.graphics();
        
        if (this.shipType === 'cruiser') {
            // Cruiser: Large angular warship
            // Main hull
            graphics.fillStyle(teamColors.primary, 1);
            graphics.fillTriangle(
                this.shipSize * 1.2, 0,
                -this.shipSize, -this.shipSize * 0.6,
                -this.shipSize, this.shipSize * 0.6
            );
            
            // Hull detail
            graphics.fillStyle(teamColors.secondary, 1);
            graphics.fillTriangle(
                this.shipSize * 0.8, 0,
                -this.shipSize * 0.3, -this.shipSize * 0.35,
                -this.shipSize * 0.3, this.shipSize * 0.35
            );
            
            // Engine pods
            graphics.fillStyle(0x333344, 1);
            graphics.fillRect(-this.shipSize, -this.shipSize * 0.5, this.shipSize * 0.4, this.shipSize * 0.25);
            graphics.fillRect(-this.shipSize, this.shipSize * 0.25, this.shipSize * 0.4, this.shipSize * 0.25);
            
            // Outline glow
            graphics.lineStyle(2, teamColors.glow, 0.8);
            graphics.strokeTriangle(
                this.shipSize * 1.2, 0,
                -this.shipSize, -this.shipSize * 0.6,
                -this.shipSize, this.shipSize * 0.6
            );
            
            // Flagship crown
            if (this.isFlagship) {
                graphics.fillStyle(0xffdd00, 1);
                graphics.fillCircle(0, 0, 6);
                graphics.fillStyle(0xffff88, 1);
                graphics.fillCircle(0, 0, 3);
            }
        } else {
            // Fighter: Sleek, fast design
            // Main body
            graphics.fillStyle(teamColors.primary, 1);
            graphics.fillTriangle(
                this.shipSize, 0,
                -this.shipSize * 0.7, -this.shipSize * 0.5,
                -this.shipSize * 0.7, this.shipSize * 0.5
            );
            
            // Cockpit
            graphics.fillStyle(0x88ccff, 0.8);
            graphics.fillEllipse(this.shipSize * 0.2, 0, this.shipSize * 0.4, this.shipSize * 0.25);
            
            // Wings
            graphics.fillStyle(teamColors.secondary, 1);
            graphics.fillTriangle(
                -this.shipSize * 0.3, -this.shipSize * 0.3,
                -this.shipSize * 0.8, -this.shipSize * 0.7,
                -this.shipSize * 0.5, 0
            );
            graphics.fillTriangle(
                -this.shipSize * 0.3, this.shipSize * 0.3,
                -this.shipSize * 0.8, this.shipSize * 0.7,
                -this.shipSize * 0.5, 0
            );
            
            // Outline
            graphics.lineStyle(1.5, teamColors.glow, 0.7);
            graphics.strokeTriangle(
                this.shipSize, 0,
                -this.shipSize * 0.7, -this.shipSize * 0.5,
                -this.shipSize * 0.7, this.shipSize * 0.5
            );
        }
        
        // Generate texture
        const key = `ship_${this.shipType}_${this.isPlayer ? 'p' : 'e'}_${this.isFlagship ? 'f' : 'n'}_v2`;
        const texSize = this.shipSize * 3;
        
        if (!this.scene.textures.exists(key)) {
            graphics.generateTexture(key, texSize, texSize);
        }
        graphics.destroy();
        
        // Create sprite
        this.sprite = this.scene.add.image(0, 0, key);
        this.add(this.sprite);
        
        // Selection ring with animated glow
        this.selectionRing = this.scene.add.graphics();
        this.selectionRing.setVisible(false);
        this.add(this.selectionRing);
        this.selectionPulse = 0;
        
        // Health bar container (modern style)
        this.createHealthBars();
    }
    
    createHealthBars() {
        const barWidth = this.shipSize * 1.8;
        const barY = -this.shipSize - 12;
        
        // Bar background with border
        this.healthBarBg = this.scene.add.graphics();
        this.healthBarBg.fillStyle(0x000000, 0.6);
        this.healthBarBg.fillRoundedRect(-barWidth/2 - 1, barY - 4, barWidth + 2, 7, 2);
        this.healthBarBg.lineStyle(1, 0x444444, 0.8);
        this.healthBarBg.strokeRoundedRect(-barWidth/2 - 1, barY - 4, barWidth + 2, 7, 2);
        this.add(this.healthBarBg);
        
        // Health bar (gradient effect via multiple rects)
        this.healthBar = this.scene.add.graphics();
        this.add(this.healthBar);
        
        // Shield bar
        this.shieldBarBg = this.scene.add.graphics();
        this.shieldBarBg.fillStyle(0x000000, 0.6);
        this.shieldBarBg.fillRoundedRect(-barWidth/2 - 1, barY - 10, barWidth + 2, 5, 2);
        this.add(this.shieldBarBg);
        
        this.shieldBar = this.scene.add.graphics();
        this.add(this.shieldBar);
        
        this.barWidth = barWidth;
        this.barY = barY;
    }
    
    createEngineParticles() {
        // Engine glow points
        this.engineGlows = [];
        
        const enginePositions = this.shipType === 'cruiser' 
            ? [{ x: -this.shipSize, y: -this.shipSize * 0.35 }, { x: -this.shipSize, y: this.shipSize * 0.35 }]
            : [{ x: -this.shipSize * 0.7, y: 0 }];
        
        for (const pos of enginePositions) {
            const glow = this.scene.add.graphics();
            glow.x = pos.x;
            glow.y = pos.y;
            this.add(glow);
            this.engineGlows.push({ graphics: glow, baseX: pos.x, baseY: pos.y });
        }
        
        this.engineFlicker = 0;
    }
    
    moveTo(x, y) {
        this.targetX = x;
        this.targetY = y;
    }
    
    setTarget(target) {
        this.target = target;
    }
    
    update(time, delta) {
        if (this.health <= 0) return;
        
        this.updateMovement(delta);
        this.updateCombat(time);
        this.updateShields(delta);
        this.updateVisuals(time, delta);
        
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
        
        this.isMoving = distance > 5;
        
        if (this.isMoving) {
            const targetAngle = Math.atan2(dy, dx);
            let angleDiff = targetAngle - this.rotation;
            while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
            while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
            
            this.rotation += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), this.turnSpeed * delta / 1000);
            
            const moveSpeed = this.speed * delta / 1000;
            const moveDistance = Math.min(moveSpeed, distance);
            
            this.x += Math.cos(this.rotation) * moveDistance;
            this.y += Math.sin(this.rotation) * moveDistance;
        }
        
        this.setRotation(this.rotation);
    }
    
    updateCombat(time) {
        if (!this.target || this.target.health <= 0) {
            this.target = null;
            return;
        }
        
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= this.range) {
            if (time - this.lastFireTime >= this.fireRate) {
                this.fireLaser(this.target);
                this.lastFireTime = time;
            }
        } else {
            this.moveTo(
                this.target.x - Math.cos(Math.atan2(dy, dx)) * (this.range * 0.8),
                this.target.y - Math.sin(Math.atan2(dy, dx)) * (this.range * 0.8)
            );
        }
    }
    
    updateShields(delta) {
        if (this.shields < this.maxShields) {
            this.shields = Math.min(this.maxShields, this.shields + 5 * delta / 1000);
        }
    }
    
    updateVisuals(time, delta) {
        // Update health bar
        const healthPercent = this.health / this.maxHealth;
        const shieldPercent = this.shields / this.maxShields;
        
        this.healthBar.clear();
        const healthWidth = this.barWidth * healthPercent;
        const healthColor = healthPercent > 0.6 ? 0x44ff44 : (healthPercent > 0.3 ? 0xffcc00 : 0xff3333);
        this.healthBar.fillStyle(healthColor, 1);
        this.healthBar.fillRoundedRect(-this.barWidth/2, this.barY - 3, healthWidth, 5, 1);
        // Highlight
        this.healthBar.fillStyle(0xffffff, 0.3);
        this.healthBar.fillRect(-this.barWidth/2, this.barY - 3, healthWidth, 2);
        
        this.shieldBar.clear();
        const shieldWidth = this.barWidth * shieldPercent;
        this.shieldBar.fillStyle(0x00ddff, 0.9);
        this.shieldBar.fillRoundedRect(-this.barWidth/2, this.barY - 9, shieldWidth, 3, 1);
        this.shieldBar.fillStyle(0xffffff, 0.4);
        this.shieldBar.fillRect(-this.barWidth/2, this.barY - 9, shieldWidth, 1);
        
        // Selection ring animation
        if (this.isSelected) {
            this.selectionRing.setVisible(true);
            this.selectionPulse += delta * 0.005;
            const pulse = 0.5 + Math.sin(this.selectionPulse) * 0.3;
            
            this.selectionRing.clear();
            this.selectionRing.lineStyle(2, 0x00ff88, pulse);
            this.selectionRing.strokeCircle(0, 0, this.shipSize + 10 + Math.sin(this.selectionPulse * 2) * 2);
            this.selectionRing.lineStyle(1, 0x88ffcc, pulse * 0.5);
            this.selectionRing.strokeCircle(0, 0, this.shipSize + 14);
        } else {
            this.selectionRing.setVisible(false);
        }
        
        // Engine glow animation
        this.engineFlicker += delta * 0.01;
        for (const engine of this.engineGlows) {
            engine.graphics.clear();
            
            const intensity = this.isMoving ? 1 : 0.4;
            const flicker = 0.8 + Math.sin(this.engineFlicker + engine.baseY) * 0.2;
            const size = (this.isMoving ? 8 : 4) * flicker;
            
            // Engine glow
            engine.graphics.fillStyle(this.teamColors.engine, 0.8 * intensity * flicker);
            engine.graphics.fillCircle(0, 0, size);
            engine.graphics.fillStyle(0xffffff, 0.6 * intensity * flicker);
            engine.graphics.fillCircle(0, 0, size * 0.5);
            
            // Thrust trail when moving
            if (this.isMoving) {
                engine.graphics.fillStyle(this.teamColors.engine, 0.4 * flicker);
                engine.graphics.fillEllipse(-size * 1.5, 0, size * 2, size * 0.6);
            }
        }
        
        // Glow pulse
        const glowPulse = 0.2 + Math.sin(time * 0.003) * 0.1;
        this.glow.setAlpha(glowPulse);
    }
    
    fireLaser(target) {
        // Create enhanced laser with glow
        const startX = this.x + Math.cos(this.rotation) * this.shipSize;
        const startY = this.y + Math.sin(this.rotation) * this.shipSize;
        
        const laserColor = this.isPlayer ? 0x00ffff : 0xff6600;
        const glowColor = this.isPlayer ? 0x0088ff : 0xff3300;
        
        // Glow line (thicker, transparent)
        const laserGlow = this.scene.add.line(
            0, 0, startX, startY, target.x, target.y, glowColor
        );
        laserGlow.setLineWidth(6);
        laserGlow.setOrigin(0, 0);
        laserGlow.setAlpha(0.4);
        laserGlow.setDepth(15);
        
        // Core line
        const laser = this.scene.add.line(
            0, 0, startX, startY, target.x, target.y, laserColor
        );
        laser.setLineWidth(2);
        laser.setOrigin(0, 0);
        laser.setDepth(16);
        
        // Muzzle flash
        const flash = this.scene.add.circle(startX, startY, 8, laserColor, 0.8);
        flash.setDepth(17);
        
        // Animate
        this.scene.tweens.add({
            targets: [laser, laserGlow, flash],
            alpha: 0,
            duration: 120,
            onComplete: () => {
                laser.destroy();
                laserGlow.destroy();
                flash.destroy();
            }
        });
        
        // Impact effect
        this.createImpactEffect(target.x, target.y, laserColor);
        
        target.takeDamage(this.damage);
        
        this.scene.events.emit('ship-attack', {
            attacker: this,
            target: target,
            damage: this.damage
        });
    }
    
    createImpactEffect(x, y, color) {
        // Impact particles
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i + Math.random() * 0.5;
            const speed = 30 + Math.random() * 40;
            const particle = this.scene.add.circle(x, y, 3, color, 0.8);
            particle.setDepth(18);
            
            this.scene.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0,
                scale: 0.3,
                duration: 200 + Math.random() * 100,
                onComplete: () => particle.destroy()
            });
        }
        
        // Impact flash
        const impact = this.scene.add.circle(x, y, 12, 0xffffff, 0.6);
        impact.setDepth(17);
        this.scene.tweens.add({
            targets: impact,
            scale: 2,
            alpha: 0,
            duration: 150,
            onComplete: () => impact.destroy()
        });
    }
    
    takeDamage(amount) {
        if (this.shields > 0) {
            const shieldDamage = Math.min(this.shields, amount);
            this.shields -= shieldDamage;
            amount -= shieldDamage;
            
            // Shield hit ripple
            this.createShieldHitEffect();
        }
        
        if (amount > 0) {
            this.health -= amount;
            
            // Hull hit flash
            this.scene.tweens.add({
                targets: this.sprite,
                alpha: 0.5,
                duration: 50,
                yoyo: true,
                repeat: 1
            });
            
            // Screen shake for flagships
            if (this.isFlagship && this.scene.cameras && this.scene.cameras.main) {
                this.scene.cameras.main.shake(100, 0.005);
            }
        }
        
        if (this.health <= 0) {
            this.die();
        }
    }
    
    createShieldHitEffect() {
        const shield = this.scene.add.graphics();
        shield.lineStyle(3, 0x00ffff, 0.8);
        shield.strokeCircle(this.x, this.y, this.shipSize * 1.5);
        shield.setDepth(20);
        
        this.scene.tweens.add({
            targets: shield,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 200,
            onComplete: () => shield.destroy()
        });
    }
    
    die() {
        // Epic explosion effect
        this.createExplosion();
        
        // Screen shake
        if (this.scene.cameras && this.scene.cameras.main) {
            const intensity = this.isFlagship ? 0.02 : 0.01;
            this.scene.cameras.main.shake(300, intensity);
        }
        
        this.scene.events.emit('ship-destroyed', {
            ship: this,
            isPlayer: this.isPlayer,
            isFlagship: this.isFlagship,
            timelineIndex: this.timelineIndex
        });
        
        this.destroy();
    }
    
    createExplosion() {
        const x = this.x;
        const y = this.y;
        const size = this.isFlagship ? 2 : 1;
        
        // Multiple explosion rings
        for (let i = 0; i < 3; i++) {
            const ring = this.scene.add.circle(x, y, 10, 0xff8800, 0.8);
            ring.setDepth(25);
            
            this.scene.tweens.add({
                targets: ring,
                scale: (3 + i * 2) * size,
                alpha: 0,
                duration: 300 + i * 100,
                delay: i * 50,
                onComplete: () => ring.destroy()
            });
        }
        
        // Core flash
        const flash = this.scene.add.circle(x, y, 20 * size, 0xffffff, 1);
        flash.setDepth(26);
        this.scene.tweens.add({
            targets: flash,
            scale: 3,
            alpha: 0,
            duration: 200,
            onComplete: () => flash.destroy()
        });
        
        // Debris particles
        const debrisCount = this.isFlagship ? 20 : 10;
        for (let i = 0; i < debrisCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 100;
            const debrisSize = 2 + Math.random() * 4;
            const color = Math.random() > 0.5 ? 0xff6600 : 0xffaa00;
            
            const debris = this.scene.add.rectangle(x, y, debrisSize, debrisSize, color);
            debris.setDepth(24);
            debris.setRotation(Math.random() * Math.PI);
            
            this.scene.tweens.add({
                targets: debris,
                x: x + Math.cos(angle) * speed * size,
                y: y + Math.sin(angle) * speed * size,
                alpha: 0,
                rotation: debris.rotation + Math.PI * 2,
                duration: 400 + Math.random() * 300,
                ease: 'Power2',
                onComplete: () => debris.destroy()
            });
        }
        
        // Smoke puffs
        for (let i = 0; i < 5; i++) {
            const puff = this.scene.add.circle(
                x + (Math.random() - 0.5) * 20,
                y + (Math.random() - 0.5) * 20,
                8, 0x444444, 0.6
            );
            puff.setDepth(23);
            
            this.scene.tweens.add({
                targets: puff,
                scale: 3,
                alpha: 0,
                y: puff.y - 30,
                duration: 600 + Math.random() * 300,
                delay: Math.random() * 100,
                onComplete: () => puff.destroy()
            });
        }
    }
    
    select() {
        this.isSelected = true;
    }
    
    deselect() {
        this.isSelected = false;
    }
    
    getBounds() {
        return new Phaser.Geom.Rectangle(
            this.x - this.shipSize,
            this.y - this.shipSize,
            this.shipSize * 2,
            this.shipSize * 2
        );
    }
    
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

if (typeof window !== 'undefined') {
    window.Ship = Ship;
}
