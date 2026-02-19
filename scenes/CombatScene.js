/**
 * CombatScene - Main game scene with combat and timeline management
 */
class CombatScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CombatScene' });
    }
    
    create() {
        // Game state
        this.isPaused = false;
        this.gameTime = 0;
        this.selectedShip = null;
        this.temporalJumpMode = false;
        
        // Detect portrait vs landscape
        this.isPortrait = this.scale.height > this.scale.width;
        
        // Responsive arena bounds
        if (this.isPortrait) {
            // Portrait: arena fills width, timeline at top, controls at bottom
            const padding = 10;
            this.arenaWidth = this.scale.width - padding * 2;
            this.arenaHeight = this.scale.height - 180; // Room for top ribbon + bottom controls
            this.arenaX = padding;
            this.arenaY = 70; // Below timeline ribbon
        } else {
            // Landscape: original layout
            this.arenaWidth = 700;
            this.arenaHeight = 500;
            this.arenaX = 180;
            this.arenaY = 80;
        }
        
        // Initialize systems
        this.timelineManager = new TimelineManager(this);
        this.combatSystem = new CombatSystem(this);
        this.aiSystem = new AISystem(this, this.combatSystem);
        
        // Create visuals
        this.createBackground();
        this.createArena();
        this.createUI();
        this.createTimelineRibbon();
        
        // Initialize timeline
        this.timelineManager.initialize({});
        
        // Spawn initial ships
        this.spawnInitialShips();
        
        // Setup input
        this.setupInput();
        
        // Event listeners
        this.setupEventListeners();
        
        // Start message
        this.showMessage('COMBAT INITIATED', 'Destroy the enemy flagship!');
    }
    
    createBackground() {
        // Starfield background
        const graphics = this.add.graphics();
        graphics.fillStyle(0x0a0a1a, 1);
        graphics.fillRect(0, 0, this.scale.width, this.scale.height);
        
        // Stars
        for (let i = 0; i < 200; i++) {
            const x = Phaser.Math.Between(0, this.scale.width);
            const y = Phaser.Math.Between(0, this.scale.height);
            const size = Phaser.Math.FloatBetween(0.5, 2);
            const alpha = Phaser.Math.FloatBetween(0.2, 0.8);
            
            graphics.fillStyle(0xffffff, alpha);
            graphics.fillCircle(x, y, size);
        }
    }
    
    createArena() {
        // Combat arena border
        const arena = this.add.rectangle(
            this.arenaX + this.arenaWidth / 2,
            this.arenaY + this.arenaHeight / 2,
            this.arenaWidth,
            this.arenaHeight,
            0x111122, 0.5
        );
        arena.setStrokeStyle(2, 0x334455);
        
        // Grid lines
        const grid = this.add.graphics();
        grid.lineStyle(1, 0x222233, 0.3);
        
        const gridSize = 50;
        for (let x = this.arenaX; x <= this.arenaX + this.arenaWidth; x += gridSize) {
            grid.moveTo(x, this.arenaY);
            grid.lineTo(x, this.arenaY + this.arenaHeight);
        }
        for (let y = this.arenaY; y <= this.arenaY + this.arenaHeight; y += gridSize) {
            grid.moveTo(this.arenaX, y);
            grid.lineTo(this.arenaX + this.arenaWidth, y);
        }
        grid.strokePath();
    }
    
    createUI() {
        const uiY = this.arenaY + this.arenaHeight + 20;
        
        // Pause indicator
        this.pauseText = this.add.text(this.scale.width / 2, 30, '▐▐ PAUSED', {
            fontSize: '24px',
            fontFamily: 'Segoe UI',
            color: '#ff8800',
            fontStyle: 'bold'
        }).setOrigin(0.5).setVisible(false);
        
        // Temporal controls panel (shown when paused)
        this.temporalPanel = this.add.container(this.scale.width / 2, this.scale.height / 2);
        this.temporalPanel.setVisible(false);
        
        const panelBg = this.add.rectangle(0, 0, 300, 150, 0x111133, 0.95);
        panelBg.setStrokeStyle(2, 0x4488ff);
        this.temporalPanel.add(panelBg);
        
        this.temporalPanel.add(this.add.text(0, -55, 'TEMPORAL CONTROLS', {
            fontSize: '16px',
            fontFamily: 'Segoe UI',
            color: '#4488ff'
        }).setOrigin(0.5));
        
        this.temporalPanel.add(this.add.text(0, -20, 'Press T to create timeline branch', {
            fontSize: '12px',
            fontFamily: 'Segoe UI',
            color: '#88aacc'
        }).setOrigin(0.5));
        
        this.temporalPanel.add(this.add.text(0, 10, 'Right-click to issue move orders', {
            fontSize: '12px',
            fontFamily: 'Segoe UI',
            color: '#88aacc'
        }).setOrigin(0.5));
        
        this.temporalPanel.add(this.add.text(0, 40, 'Press SPACE to resume', {
            fontSize: '14px',
            fontFamily: 'Segoe UI',
            color: '#ffaa00'
        }).setOrigin(0.5));
        
        // Bottom HUD
        const hudY = this.scale.height - 60;
        
        // Ship info panel (left)
        this.shipInfoText = this.add.text(this.arenaX, hudY, '', {
            fontSize: '14px',
            fontFamily: 'Segoe UI',
            color: '#aabbcc',
            lineSpacing: 4
        });
        
        // Temporal energy (center)
        this.add.text(this.scale.width / 2, hudY - 15, 'TEMPORAL ENERGY', {
            fontSize: '12px',
            fontFamily: 'Segoe UI',
            color: '#667'
        }).setOrigin(0.5);
        
        this.teBarBg = this.add.rectangle(this.scale.width / 2, hudY + 10, 150, 16, 0x222222);
        this.teBar = this.add.rectangle(this.scale.width / 2 - 72, hudY + 10, 144, 12, 0x00ffff);
        this.teBar.setOrigin(0, 0.5);
        
        this.teText = this.add.text(this.scale.width / 2, hudY + 10, '100%', {
            fontSize: '10px',
            fontFamily: 'Segoe UI',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Game time (right)
        this.gameTimeText = this.add.text(this.arenaX + this.arenaWidth, hudY, 'T+0.0s', {
            fontSize: '16px',
            fontFamily: 'Segoe UI',
            color: '#88aacc'
        }).setOrigin(1, 0);
        
        // Combat stats
        this.statsText = this.add.text(this.arenaX + this.arenaWidth, hudY + 25, '', {
            fontSize: '12px',
            fontFamily: 'Segoe UI',
            color: '#667'
        }).setOrigin(1, 0);
        
        // Message display
        this.messageContainer = this.add.container(this.scale.width / 2, 100);
        this.messageContainer.setAlpha(0);
        
        this.messageBg = this.add.rectangle(0, 0, 400, 60, 0x000000, 0.8);
        this.messageContainer.add(this.messageBg);
        
        this.messageTitle = this.add.text(0, -12, '', {
            fontSize: '18px',
            fontFamily: 'Segoe UI',
            color: '#ffaa00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.messageContainer.add(this.messageTitle);
        
        this.messageBody = this.add.text(0, 12, '', {
            fontSize: '14px',
            fontFamily: 'Segoe UI',
            color: '#aabbcc'
        }).setOrigin(0.5);
        this.messageContainer.add(this.messageBody);
    }
    
    createTimelineRibbon() {
        if (this.isPortrait) {
            // Portrait: horizontal ribbon at top
            this.ribbonX = 10;
            this.ribbonY = 5;
            this.ribbonHeight = 55;
            
            // Ribbon background - full width
            this.ribbonBg = this.add.rectangle(
                this.scale.width / 2,
                this.ribbonY + this.ribbonHeight / 2,
                this.scale.width - 20,
                this.ribbonHeight,
                0x111122, 0.9
            );
            this.ribbonBg.setStrokeStyle(1, 0x334455);
        } else {
            // Landscape: vertical ribbon on left
            this.ribbonX = 20;
            this.ribbonY = this.arenaY;
            this.ribbonWidth = 140;
            
            // Ribbon background
            this.ribbonBg = this.add.rectangle(
                this.ribbonX + this.ribbonWidth / 2,
                this.ribbonY + 100,
                this.ribbonWidth,
                200,
                0x111122, 0.8
            );
            this.ribbonBg.setStrokeStyle(1, 0x334455);
            
            // Timeline title
            this.add.text(this.ribbonX + this.ribbonWidth / 2, this.ribbonY + 10, 'TIMELINES', {
                fontSize: '12px',
                fontFamily: 'Segoe UI',
                color: '#667'
            }).setOrigin(0.5);
        }
        
        // Timeline entries container
        this.timelineEntries = [];
        this.updateTimelineRibbon();
    }
    
    updateTimelineRibbon() {
        // Clear existing entries
        for (const entry of this.timelineEntries) {
            entry.destroy();
        }
        this.timelineEntries = [];
        
        const timelines = this.timelineManager.getTimelineStatus();
        
        if (this.isPortrait) {
            // Portrait: horizontal timeline buttons
            const buttonWidth = (this.scale.width - 40) / 3;
            
            for (let i = 0; i < timelines.length; i++) {
                const t = timelines[i];
                const x = 20 + i * buttonWidth + buttonWidth / 2;
                const y = this.ribbonY + this.ribbonHeight / 2;
                
                // Entry background
                const bg = this.add.rectangle(
                    x, y,
                    buttonWidth - 8,
                    40,
                    t.isActive ? 0x223344 : 0x1a1a2e,
                    0.9
                );
                bg.setStrokeStyle(2, t.isActive ? t.color : 0x333333);
                bg.setInteractive({ useHandCursor: true });
                bg.on('pointerdown', () => this.switchToTimeline(i));
                this.timelineEntries.push(bg);
                
                // Timeline name + status
                const ships = this.combatSystem.getShipsInTimeline(i);
                const playerCount = ships.filter(s => s.isPlayer && s.health > 0).length;
                const enemyCount = ships.filter(s => !s.isPlayer && s.health > 0).length;
                
                const label = this.add.text(x, y - 8, `TL ${t.name}`, {
                    fontSize: '12px',
                    fontFamily: 'Segoe UI',
                    fontStyle: 'bold',
                    color: t.isActive ? '#ffffff' : '#888888'
                }).setOrigin(0.5);
                this.timelineEntries.push(label);
                
                const count = this.add.text(x, y + 8, `⬢${playerCount} vs ⬡${enemyCount}`, {
                    fontSize: '10px',
                    fontFamily: 'Segoe UI',
                    color: '#667'
                }).setOrigin(0.5);
                this.timelineEntries.push(count);
                
                // Active indicator
                if (t.isActive) {
                    const marker = this.add.text(x + buttonWidth/2 - 15, y, '◀', {
                        fontSize: '10px',
                        color: '#4488ff'
                    }).setOrigin(0.5);
                    this.timelineEntries.push(marker);
                }
            }
        } else {
            // Landscape: original vertical layout
            for (let i = 0; i < timelines.length; i++) {
                const t = timelines[i];
                const y = this.ribbonY + 35 + i * 55;
                
                // Entry background
                const bg = this.add.rectangle(
                    this.ribbonX + this.ribbonWidth / 2,
                    y + 15,
                    this.ribbonWidth - 10,
                    45,
                    t.isActive ? 0x223344 : 0x1a1a2e,
                    0.8
                );
                bg.setStrokeStyle(2, t.isActive ? t.color : 0x333333);
                bg.setInteractive({ useHandCursor: true });
                bg.on('pointerdown', () => this.switchToTimeline(i));
                this.timelineEntries.push(bg);
                
                // Timeline name
                const name = this.add.text(this.ribbonX + 15, y + 5, `Timeline ${t.name}`, {
                    fontSize: '13px',
                    fontFamily: 'Segoe UI',
                    color: t.isActive ? '#ffffff' : '#888888'
                });
                this.timelineEntries.push(name);
                
                // Status indicator
                const statusColor = t.health > 75 ? 0x44ff44 : (t.health > 25 ? 0xffff44 : 0xff4444);
                const status = this.add.circle(this.ribbonX + this.ribbonWidth - 20, y + 12, 6, statusColor);
                this.timelineEntries.push(status);
                
                // Ship count
                const ships = this.combatSystem.getShipsInTimeline(i);
                const playerCount = ships.filter(s => s.isPlayer && s.health > 0).length;
                const enemyCount = ships.filter(s => !s.isPlayer && s.health > 0).length;
                
                const countText = this.add.text(this.ribbonX + 15, y + 23, `⬢${playerCount} vs ⬡${enemyCount}`, {
                    fontSize: '11px',
                    fontFamily: 'Segoe UI',
                    color: '#667'
                });
                this.timelineEntries.push(countText);
                
                // Active indicator
                if (t.isActive) {
                    const activeMarker = this.add.text(this.ribbonX + this.ribbonWidth - 35, y + 23, '◀', {
                        fontSize: '10px',
                        color: '#4488ff'
                    });
                    this.timelineEntries.push(activeMarker);
                }
            }
        }
    }
    
    spawnInitialShips() {
        const timeline = this.timelineManager.getActiveTimeline();
        
        // Player ships (left side)
        // Player Flagship (Cruiser)
        const playerFlagship = new Ship(this, this.arenaX + 100, this.arenaY + this.arenaHeight / 2, {
            type: 'cruiser',
            isPlayer: true,
            isFlagship: true,
            timelineIndex: 0
        });
        this.combatSystem.registerShip(playerFlagship);
        
        // Player Fighters
        const fighter1 = new Ship(this, this.arenaX + 80, this.arenaY + this.arenaHeight / 2 - 60, {
            type: 'fighter',
            isPlayer: true,
            timelineIndex: 0
        });
        this.combatSystem.registerShip(fighter1);
        
        const fighter2 = new Ship(this, this.arenaX + 80, this.arenaY + this.arenaHeight / 2 + 60, {
            type: 'fighter',
            isPlayer: true,
            timelineIndex: 0
        });
        this.combatSystem.registerShip(fighter2);
        
        // Enemy ships (right side)
        // Enemy Flagship (Cruiser)
        const enemyFlagship = new Ship(this, this.arenaX + this.arenaWidth - 100, this.arenaY + this.arenaHeight / 2, {
            type: 'cruiser',
            isPlayer: false,
            isFlagship: true,
            timelineIndex: 0
        });
        this.combatSystem.registerShip(enemyFlagship);
        
        // Enemy Fighters
        const enemyFighter1 = new Ship(this, this.arenaX + this.arenaWidth - 80, this.arenaY + this.arenaHeight / 2 - 50, {
            type: 'fighter',
            isPlayer: false,
            timelineIndex: 0
        });
        this.combatSystem.registerShip(enemyFighter1);
        
        const enemyFighter2 = new Ship(this, this.arenaX + this.arenaWidth - 80, this.arenaY + this.arenaHeight / 2 + 50, {
            type: 'fighter',
            isPlayer: false,
            timelineIndex: 0
        });
        this.combatSystem.registerShip(enemyFighter2);
    }
    
    setupInput() {
        // Detect if mobile
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            || this.scale.width < 768;
        
        // Pause toggle (Space)
        this.input.keyboard.on('keydown-SPACE', () => {
            this.togglePause();
        });
        
        // Timeline switching (1-3)
        this.input.keyboard.on('keydown-ONE', () => this.switchToTimeline(0));
        this.input.keyboard.on('keydown-TWO', () => this.switchToTimeline(1));
        this.input.keyboard.on('keydown-THREE', () => this.switchToTimeline(2));
        
        // Temporal jump (T)
        this.input.keyboard.on('keydown-T', () => {
            if (this.isPaused && this.selectedShip && this.selectedShip.isPlayer) {
                this.initiateTemporalJump();
            }
        });
        
        // Restart (R)
        this.input.keyboard.on('keydown-R', () => {
            this.scene.restart();
        });
        
        // Track double-tap for mobile orders
        this.lastTapTime = 0;
        this.doubleTapDelay = 300;
        
        // Unified pointer handling (works for mouse and touch)
        this.input.on('pointerdown', (pointer) => {
            // Ignore if clicking on mobile controls
            if (this.touchControls && pointer.y > this.scale.height - 70) {
                return;
            }
            
            // Desktop: right-click for orders
            if (pointer.rightButtonDown() && this.selectedShip && this.selectedShip.isPlayer) {
                this.handleOrder(pointer);
                return;
            }
            
            // Mobile/Touch: double-tap for orders
            const currentTime = Date.now();
            const timeSinceLastTap = currentTime - this.lastTapTime;
            
            if (timeSinceLastTap < this.doubleTapDelay && this.selectedShip && this.selectedShip.isPlayer) {
                // Double tap = order
                this.handleOrder(pointer);
                this.lastTapTime = 0; // Reset to prevent triple-tap
            } else {
                // Single tap = select
                this.handleSelection(pointer);
                this.lastTapTime = currentTime;
            }
        });
        
        // Create mobile touch controls
        this.createTouchControls();
    }
    
    createTouchControls() {
        // Mobile touch control bar at bottom
        this.touchControls = this.add.container(0, this.scale.height - 60);
        
        // Background bar
        const barBg = this.add.rectangle(
            this.scale.width / 2, 30,
            this.scale.width, 60,
            0x0a0a1a, 0.95
        );
        barBg.setStrokeStyle(1, 0x334455);
        this.touchControls.add(barBg);
        
        // Button style helper
        const createButton = (x, label, color, callback, width = 70) => {
            const btn = this.add.rectangle(x, 30, width, 45, color, 0.8);
            btn.setStrokeStyle(2, Phaser.Display.Color.GetColor(
                Phaser.Display.Color.IntegerToRGB(color).r + 40,
                Phaser.Display.Color.IntegerToRGB(color).g + 40,
                Phaser.Display.Color.IntegerToRGB(color).b + 40
            ));
            btn.setInteractive({ useHandCursor: true });
            btn.on('pointerdown', callback);
            btn.on('pointerover', () => btn.setAlpha(1));
            btn.on('pointerout', () => btn.setAlpha(0.8));
            this.touchControls.add(btn);
            
            const text = this.add.text(x, 30, label, {
                fontSize: this.isPortrait ? '11px' : '12px',
                fontFamily: 'Segoe UI',
                color: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            this.touchControls.add(text);
            
            return { btn, text };
        };
        
        if (this.isPortrait) {
            // Portrait: simplified bottom bar (timelines are at top)
            const btnWidth = (this.scale.width - 30) / 3;
            
            // Pause button (left)
            this.pauseBtn = createButton(15 + btnWidth/2, '⏸ PAUSE', 0x444444, () => this.togglePause(), btnWidth - 5);
            
            // Jump button (center)
            this.jumpBtn = createButton(this.scale.width/2, '⚡ JUMP', 0x00aaaa, () => {
                if (this.isPaused && this.selectedShip && this.selectedShip.isPlayer) {
                    this.initiateTemporalJump();
                }
            }, btnWidth - 5);
            
            // Restart button (right)
            createButton(this.scale.width - 15 - btnWidth/2, '↻ RESTART', 0x662222, () => this.scene.restart(), btnWidth - 5);
            
        } else {
            // Landscape: full control bar
            // Pause button
            this.pauseBtn = createButton(50, '⏸ PAUSE', 0x444444, () => this.togglePause());
            
            // Timeline buttons
            createButton(140, 'TL 1', 0x3366cc, () => this.switchToTimeline(0));
            createButton(220, 'TL 2', 0x33cc66, () => this.switchToTimeline(1));
            createButton(300, 'TL 3', 0xcc6633, () => this.switchToTimeline(2));
            
            // Temporal Jump button
            this.jumpBtn = createButton(this.scale.width - 90, '⚡ JUMP', 0x00aaaa, () => {
                if (this.isPaused && this.selectedShip && this.selectedShip.isPlayer) {
                    this.initiateTemporalJump();
                }
            });
            
            // Restart button (smaller, far right)
            createButton(this.scale.width - 30, '↻', 0x662222, () => this.scene.restart());
        }
        
        // Add hint text for touch
        this.touchHint = this.add.text(this.scale.width / 2, 8, 'Tap = Select  •  Double-tap = Order', {
            fontSize: '10px',
            fontFamily: 'Segoe UI',
            color: '#556'
        }).setOrigin(0.5);
        this.touchControls.add(this.touchHint);
    }
    
    setupEventListeners() {
        // Ship destroyed
        this.events.on('ship-destroyed', (data) => {
            this.handleShipDestroyed(data);
        });
        
        // Ship attack (for combat log)
        this.events.on('ship-attack', (data) => {
            // Could add combat log here
        });
        
        // Ship clone (from temporal jump)
        this.events.on('ship-clone', (data) => {
            this.handleShipClone(data);
        });
    }
    
    handleSelection(pointer) {
        // Deselect current ship
        if (this.selectedShip) {
            this.selectedShip.deselect();
            this.selectedShip = null;
        }
        
        // Check if we clicked on a ship
        const activeTimeline = this.timelineManager.activeTimelineIndex;
        const ships = this.combatSystem.getShipsInTimeline(activeTimeline);
        
        for (const ship of ships) {
            if (ship.isPlayer && ship.health > 0) {
                const bounds = ship.getBounds();
                if (bounds.contains(pointer.x, pointer.y)) {
                    ship.select();
                    this.selectedShip = ship;
                    break;
                }
            }
        }
        
        this.updateShipInfo();
    }
    
    handleOrder(pointer) {
        // Make sure click is in arena
        if (pointer.x < this.arenaX || pointer.x > this.arenaX + this.arenaWidth ||
            pointer.y < this.arenaY || pointer.y > this.arenaY + this.arenaHeight) {
            return;
        }
        
        // Check if clicking on an enemy to attack
        const activeTimeline = this.timelineManager.activeTimelineIndex;
        const ships = this.combatSystem.getShipsInTimeline(activeTimeline);
        
        let targetEnemy = null;
        for (const ship of ships) {
            if (!ship.isPlayer && ship.health > 0) {
                const bounds = ship.getBounds();
                if (bounds.contains(pointer.x, pointer.y)) {
                    targetEnemy = ship;
                    break;
                }
            }
        }
        
        if (targetEnemy) {
            // Attack order
            this.selectedShip.setTarget(targetEnemy);
            this.showOrderFeedback(targetEnemy.x, targetEnemy.y, 0xff4444);
        } else {
            // Move order
            this.selectedShip.moveTo(pointer.x, pointer.y);
            this.selectedShip.setTarget(null);
            this.showOrderFeedback(pointer.x, pointer.y, 0x44ff44);
        }
    }
    
    showOrderFeedback(x, y, color) {
        const marker = this.add.circle(x, y, 10, color, 0.5);
        marker.setStrokeStyle(2, color);
        
        this.tweens.add({
            targets: marker,
            scale: 2,
            alpha: 0,
            duration: 500,
            onComplete: () => marker.destroy()
        });
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        this.pauseText.setVisible(this.isPaused);
        this.temporalPanel.setVisible(this.isPaused);
        
        // Update mobile pause button text
        if (this.pauseBtn && this.pauseBtn.text) {
            this.pauseBtn.text.setText(this.isPaused ? '▶ PLAY' : '⏸ PAUSE');
        }
        
        if (this.isPaused) {
            // Dim the arena
            this.tweens.add({
                targets: [this.pauseText],
                alpha: { from: 0, to: 1 },
                duration: 200
            });
        }
    }
    
    switchToTimeline(index) {
        if (this.timelineManager.switchTimeline(index)) {
            this.updateTimelineRibbon();
            this.showMessage(`Timeline ${this.timelineManager.getActiveTimeline().name}`, 'Switched focus');
            
            // Deselect current ship since it might not exist in new timeline
            if (this.selectedShip) {
                this.selectedShip.deselect();
                this.selectedShip = null;
            }
        }
    }
    
    initiateTemporalJump() {
        if (!this.selectedShip || !this.selectedShip.canTemporalJump) {
            this.showMessage('JUMP FAILED', 'Ship cannot jump right now');
            return;
        }
        
        const teCost = 15;
        if (this.timelineManager.temporalEnergy < teCost) {
            this.showMessage('JUMP FAILED', 'Insufficient Temporal Energy');
            return;
        }
        
        if (this.timelineManager.timelines.length >= this.timelineManager.maxTimelines) {
            this.showMessage('JUMP FAILED', 'Maximum timelines reached');
            return;
        }
        
        // Create the branch
        const newTimeline = this.timelineManager.createBranch(this.selectedShip, 15);
        
        if (newTimeline) {
            this.showMessage(`TIMELINE CREATED`, `Branch ${newTimeline.name} established!`);
            this.updateTimelineRibbon();
            
            // Set cooldown on the ship
            this.selectedShip.canTemporalJump = false;
            this.selectedShip.temporalCooldown = 10000; // 10 second cooldown
        }
    }
    
    handleShipClone(data) {
        // Clone the ship into the new timeline
        const { originalShip, targetTimeline } = data;
        
        // Temporal jump visual effect on original ship
        const jumpEffect = this.add.circle(originalShip.x, originalShip.y, 10, 0x00ffff, 0.8);
        this.tweens.add({
            targets: jumpEffect,
            scale: 5,
            alpha: 0,
            duration: 500,
            onComplete: () => jumpEffect.destroy()
        });
        
        // Create a copy at a slightly different position
        const offsetX = Phaser.Math.Between(-30, 30);
        const offsetY = Phaser.Math.Between(-30, 30);
        
        const clone = new Ship(this, originalShip.x + offsetX, originalShip.y + offsetY, {
            type: originalShip.shipType,
            isPlayer: originalShip.isPlayer,
            isFlagship: originalShip.isFlagship,
            timelineIndex: targetTimeline
        });
        
        // Copy some state
        clone.health = originalShip.health;
        clone.shields = originalShip.shields;
        
        this.combatSystem.registerShip(clone);
        
        // Also clone ALL ships into the new timeline (branching copies the entire state)
        const activeShips = this.combatSystem.getShipsInTimeline(this.timelineManager.activeTimelineIndex - 1 >= 0 ? this.timelineManager.activeTimelineIndex : 0);
        for (const ship of activeShips) {
            if (ship !== originalShip && ship.health > 0) {
                const shipClone = new Ship(this, ship.x + Phaser.Math.Between(-20, 20), ship.y + Phaser.Math.Between(-20, 20), {
                    type: ship.shipType,
                    isPlayer: ship.isPlayer,
                    isFlagship: ship.isFlagship,
                    timelineIndex: targetTimeline
                });
                shipClone.health = ship.health;
                shipClone.shields = ship.shields;
                this.combatSystem.registerShip(shipClone);
            }
        }
        
        this.updateTimelineRibbon();
    }
    
    handleShipDestroyed(data) {
        const { ship, isPlayer, isFlagship, timelineIndex } = data;
        
        // Remove from combat system
        this.combatSystem.unregisterShip(ship);
        
        if (isFlagship) {
            const timelineName = this.timelineManager.timelines[timelineIndex]?.name || timelineIndex;
            if (isPlayer) {
                this.showMessage('FLAGSHIP LOST', `Your flagship destroyed in Timeline ${timelineName}!`);
            } else {
                this.showMessage('ENEMY FLAGSHIP DOWN', `Enemy flagship destroyed in Timeline ${timelineName}!`);
            }
        }
        
        // Check win condition
        this.checkVictory();
        this.updateTimelineRibbon();
    }
    
    checkVictory() {
        const status = this.combatSystem.getFlagshipStatus();
        
        // Win: Player has flagships, enemy has none (across all timelines)
        if (Object.keys(status.playerFlagships).length > 0 && Object.keys(status.enemyFlagships).length === 0) {
            this.showVictory(true);
            return;
        }
        
        // Lose: Enemy has flagships, player has none
        if (Object.keys(status.enemyFlagships).length > 0 && Object.keys(status.playerFlagships).length === 0) {
            this.showVictory(false);
            return;
        }
        
        // Special: Both have no flagships - draw
        if (Object.keys(status.playerFlagships).length === 0 && Object.keys(status.enemyFlagships).length === 0) {
            this.showDraw();
        }
    }
    
    showVictory(playerWon) {
        this.isPaused = true;
        
        const text = playerWon ? 'VICTORY' : 'DEFEAT';
        const color = playerWon ? '#44ff44' : '#ff4444';
        const subtitle = playerWon ? 
            'Enemy flagship destroyed across all timelines!' : 
            'Your flagship was lost in all timelines...';
        
        // Dim everything
        const overlay = this.add.rectangle(
            this.scale.width / 2, this.scale.height / 2,
            this.scale.width, this.scale.height,
            0x000000, 0.7
        );
        
        this.add.text(this.scale.width / 2, this.scale.height / 2 - 30, text, {
            fontSize: '48px',
            fontFamily: 'Segoe UI',
            color: color,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(this.scale.width / 2, this.scale.height / 2 + 20, subtitle, {
            fontSize: '18px',
            fontFamily: 'Segoe UI',
            color: '#aabbcc'
        }).setOrigin(0.5);
        
        this.add.text(this.scale.width / 2, this.scale.height / 2 + 70, 'Press R to restart', {
            fontSize: '14px',
            fontFamily: 'Segoe UI',
            color: '#667'
        }).setOrigin(0.5);
        
        this.input.keyboard.on('keydown-R', () => {
            this.scene.restart();
        });
    }
    
    showDraw() {
        this.isPaused = true;
        
        const overlay = this.add.rectangle(
            this.scale.width / 2, this.scale.height / 2,
            this.scale.width, this.scale.height,
            0x000000, 0.7
        );
        
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'TEMPORAL STALEMATE', {
            fontSize: '36px',
            fontFamily: 'Segoe UI',
            color: '#ffaa00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Press R to restart', {
            fontSize: '14px',
            fontFamily: 'Segoe UI',
            color: '#667'
        }).setOrigin(0.5);
        
        this.input.keyboard.on('keydown-R', () => {
            this.scene.restart();
        });
    }
    
    showMessage(title, body) {
        this.messageTitle.setText(title);
        this.messageBody.setText(body);
        
        // Fade in
        this.tweens.add({
            targets: this.messageContainer,
            alpha: 1,
            duration: 200
        });
        
        // Fade out after delay
        this.time.delayedCall(2000, () => {
            this.tweens.add({
                targets: this.messageContainer,
                alpha: 0,
                duration: 500
            });
        });
    }
    
    updateShipInfo() {
        if (this.selectedShip && this.selectedShip.health > 0) {
            const ship = this.selectedShip;
            this.shipInfoText.setText([
                `${ship.shipType.toUpperCase()}${ship.isFlagship ? ' ★' : ''}`,
                `Hull: ${Math.round(ship.health)}/${ship.maxHealth}`,
                `Shields: ${Math.round(ship.shields)}/${ship.maxShields}`,
                `Jump: ${ship.canTemporalJump ? 'Ready' : 'Cooling...'}`
            ].join('\n'));
        } else {
            this.shipInfoText.setText('Click a ship to select');
        }
    }
    
    updateUI() {
        // Update temporal energy bar
        const tePercent = this.timelineManager.getTemporalEnergyPercent();
        this.teBar.setScale(tePercent / 100, 1);
        this.teText.setText(`${Math.round(tePercent)}%`);
        
        // Color based on energy level
        if (tePercent > 50) {
            this.teBar.setFillStyle(0x00ffff);
        } else if (tePercent > 25) {
            this.teBar.setFillStyle(0xffff00);
        } else {
            this.teBar.setFillStyle(0xff4400);
        }
        
        // Update game time
        this.gameTimeText.setText(`T+${(this.gameTime / 1000).toFixed(1)}s`);
        
        // Update combat stats
        const stats = this.combatSystem.getStats();
        this.statsText.setText(`Ships: ${stats.playerCount} vs ${stats.enemyCount}`);
        
        // Update ship info
        this.updateShipInfo();
        
        // Show/hide ships based on active timeline
        this.updateShipVisibility();
    }
    
    updateShipVisibility() {
        const activeTimeline = this.timelineManager.activeTimelineIndex;
        
        for (const ship of this.combatSystem.ships) {
            if (ship.active) {
                // Ships in active timeline are fully visible
                // Ships in other timelines are hidden
                if (ship.timelineIndex === activeTimeline) {
                    ship.setAlpha(1);
                    ship.setVisible(true);
                } else {
                    ship.setAlpha(0);
                    ship.setVisible(false);
                }
            }
        }
    }
    
    update(time, delta) {
        if (!this.isPaused) {
            // Update game time
            this.gameTime += delta;
            
            // Update systems
            this.timelineManager.update(delta);
            this.combatSystem.update(time, delta);
            this.aiSystem.update(time, delta);
        }
        
        // Always update UI
        this.updateUI();
        
        // Periodically update timeline ribbon
        if (Math.floor(time / 500) !== Math.floor((time - delta) / 500)) {
            this.updateTimelineRibbon();
        }
    }
}

// Export
if (typeof window !== 'undefined') {
    window.CombatScene = CombatScene;
}
