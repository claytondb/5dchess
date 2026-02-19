/**
 * TutorialScene - Interactive tutorial that teaches game mechanics
 */
class TutorialScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TutorialScene' });
    }
    
    create() {
        this.tutorialStep = 0;
        this.canProgress = false;
        this.isPaused = true; // Start paused for tutorial
        this.gameTime = 0;
        this.selectedShip = null;
        
        // Arena bounds (same as CombatScene)
        this.isPortrait = this.scale.height > this.scale.width;
        if (this.isPortrait) {
            const padding = 10;
            this.arenaWidth = this.scale.width - padding * 2;
            this.arenaHeight = this.scale.height - 250;
            this.arenaX = padding;
            this.arenaY = 70;
        } else {
            this.arenaWidth = 700;
            this.arenaHeight = 450;
            this.arenaX = 100;
            this.arenaY = 80;
        }
        
        // Systems
        this.timelineManager = new TimelineManager(this);
        this.combatSystem = new CombatSystem(this);
        
        // Create visuals
        this.createBackground();
        this.createArena();
        this.createTutorialUI();
        
        // Initialize timeline
        this.timelineManager.initialize({});
        
        // Spawn tutorial ships (simplified setup)
        this.spawnTutorialShips();
        
        // Setup input
        this.setupInput();
        
        // Start tutorial
        this.showStep(0);
    }
    
    createBackground() {
        const bg = this.add.graphics();
        bg.fillStyle(0x0a0a1a, 1);
        bg.fillRect(0, 0, this.scale.width, this.scale.height);
        bg.setDepth(-10);
        
        // Simple stars
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, this.scale.width);
            const y = Phaser.Math.Between(0, this.scale.height);
            const alpha = Phaser.Math.FloatBetween(0.2, 0.6);
            bg.fillStyle(0xffffff, alpha);
            bg.fillCircle(x, y, Phaser.Math.FloatBetween(0.5, 1.5));
        }
    }
    
    createArena() {
        const arena = this.add.graphics();
        arena.setDepth(-5);
        arena.fillStyle(0x0a0a18, 0.8);
        arena.fillRect(this.arenaX, this.arenaY, this.arenaWidth, this.arenaHeight);
        arena.lineStyle(2, 0x3366aa, 0.6);
        arena.strokeRect(this.arenaX, this.arenaY, this.arenaWidth, this.arenaHeight);
    }
    
    createTutorialUI() {
        // Dark overlay for tutorial text
        this.overlay = this.add.graphics();
        this.overlay.setDepth(100);
        
        // Tutorial text box at top
        this.tutorialBox = this.add.graphics();
        this.tutorialBox.setDepth(101);
        this.tutorialBox.fillStyle(0x000000, 0.9);
        this.tutorialBox.fillRoundedRect(20, 10, this.scale.width - 40, 60, 10);
        this.tutorialBox.lineStyle(2, 0x4488ff, 1);
        this.tutorialBox.strokeRoundedRect(20, 10, this.scale.width - 40, 60, 10);
        
        // Tutorial title
        this.tutorialTitle = this.add.text(this.scale.width / 2, 25, 'TUTORIAL', {
            fontSize: '16px',
            fontFamily: 'Orbitron, Arial',
            color: '#4488ff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(102);
        
        // Tutorial instruction text
        this.tutorialText = this.add.text(this.scale.width / 2, 50, '', {
            fontSize: '14px',
            fontFamily: 'Rajdhani, Arial',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: this.scale.width - 60 }
        }).setOrigin(0.5).setDepth(102);
        
        // Continue button
        this.continueBtn = this.add.graphics();
        this.continueBtn.setDepth(101);
        this.continueBtn.setVisible(false);
        
        this.continueText = this.add.text(this.scale.width / 2, this.scale.height - 40, 'TAP TO CONTINUE', {
            fontSize: '14px',
            fontFamily: 'Rajdhani, Arial',
            color: '#88ff88'
        }).setOrigin(0.5).setDepth(102).setVisible(false);
        
        // Highlight circle for pointing at things
        this.highlight = this.add.graphics();
        this.highlight.setDepth(99);
        this.highlightTween = null;
        
        // Skip button
        const skipBtn = this.add.text(this.scale.width - 30, this.scale.height - 20, 'SKIP →', {
            fontSize: '12px',
            fontFamily: 'Rajdhani, Arial',
            color: '#666'
        }).setOrigin(1, 0.5).setDepth(102).setInteractive();
        
        skipBtn.on('pointerdown', () => {
            this.scene.start('CombatScene');
        });
    }
    
    spawnTutorialShips() {
        const centerX = this.arenaX + this.arenaWidth / 2;
        const centerY = this.arenaY + this.arenaHeight / 2;
        
        // Player flagship (left side)
        this.playerShip = new Ship(this, this.arenaX + 100, centerY, {
            type: 'cruiser',
            isPlayer: true,
            isFlagship: true,
            timelineIndex: 0
        });
        this.combatSystem.registerShip(this.playerShip);
        
        // Player fighter
        this.playerFighter = new Ship(this, this.arenaX + 80, centerY - 60, {
            type: 'fighter',
            isPlayer: true,
            timelineIndex: 0
        });
        this.combatSystem.registerShip(this.playerFighter);
        
        // Enemy (right side, weaker for tutorial)
        this.enemyShip = new Ship(this, this.arenaX + this.arenaWidth - 120, centerY, {
            type: 'cruiser',
            isPlayer: false,
            isFlagship: true,
            timelineIndex: 0
        });
        this.enemyShip.health = 80; // Weaker for tutorial
        this.combatSystem.registerShip(this.enemyShip);
    }
    
    setupInput() {
        // Track taps/clicks
        this.input.on('pointerdown', (pointer) => {
            this.handleInput(pointer);
        });
        
        // Keyboard
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.tutorialStep >= 3) {
                this.togglePause();
            }
        });
        
        this.input.keyboard.on('keydown-T', () => {
            if (this.tutorialStep >= 6 && this.selectedShip) {
                this.doTemporalJump();
            }
        });
    }
    
    handleInput(pointer) {
        // If waiting for continue, progress
        if (this.canProgress) {
            this.canProgress = false;
            this.continueText.setVisible(false);
            this.nextStep();
            return;
        }
        
        // Handle step-specific input
        switch (this.tutorialStep) {
            case 1: // Select ship
                if (this.trySelectShip(pointer)) {
                    this.time.delayedCall(500, () => this.nextStep());
                }
                break;
            case 2: // Give move order
                if (this.selectedShip && this.isInArena(pointer)) {
                    this.selectedShip.moveTo(pointer.x, pointer.y);
                    this.showOrderFeedback(pointer.x, pointer.y, 0x44ff44);
                    this.time.delayedCall(500, () => this.nextStep());
                }
                break;
            case 4: // Attack enemy
                if (this.trySelectEnemy(pointer)) {
                    this.selectedShip.setTarget(this.enemyShip);
                    this.showOrderFeedback(this.enemyShip.x, this.enemyShip.y, 0xff4444);
                    this.time.delayedCall(1500, () => this.nextStep());
                }
                break;
            case 6: // Temporal jump
                if (this.selectedShip) {
                    this.doTemporalJump();
                }
                break;
        }
    }
    
    trySelectShip(pointer) {
        const ships = [this.playerShip, this.playerFighter];
        for (const ship of ships) {
            if (ship && ship.active) {
                const bounds = ship.getBounds();
                if (bounds.contains(pointer.x, pointer.y)) {
                    if (this.selectedShip) this.selectedShip.deselect();
                    ship.select();
                    this.selectedShip = ship;
                    return true;
                }
            }
        }
        return false;
    }
    
    trySelectEnemy(pointer) {
        if (this.enemyShip && this.enemyShip.active) {
            const bounds = this.enemyShip.getBounds();
            if (bounds.contains(pointer.x, pointer.y)) {
                return true;
            }
        }
        return false;
    }
    
    isInArena(pointer) {
        return pointer.x >= this.arenaX && 
               pointer.x <= this.arenaX + this.arenaWidth &&
               pointer.y >= this.arenaY && 
               pointer.y <= this.arenaY + this.arenaHeight;
    }
    
    showOrderFeedback(x, y, color) {
        const marker = this.add.circle(x, y, 10, color, 0.5);
        marker.setStrokeStyle(2, color);
        marker.setDepth(50);
        
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
        if (this.tutorialStep === 3 && !this.isPaused) {
            this.time.delayedCall(500, () => this.nextStep());
        }
    }
    
    doTemporalJump() {
        if (this.timelineManager.timelines.length >= 2) {
            this.showTutorialMessage('Timeline already created!', 'You can only have 3 timelines max.');
            return;
        }
        
        // Create branch effect
        const flash = this.add.circle(this.selectedShip.x, this.selectedShip.y, 20, 0x00ffff, 0.8);
        flash.setDepth(50);
        this.tweens.add({
            targets: flash,
            scale: 5,
            alpha: 0,
            duration: 500,
            onComplete: () => flash.destroy()
        });
        
        // Create new timeline
        this.timelineManager.createBranch(this.selectedShip, 10);
        
        this.time.delayedCall(1000, () => this.nextStep());
    }
    
    highlightArea(x, y, radius) {
        if (this.highlightTween) this.highlightTween.stop();
        
        this.highlight.clear();
        this.highlight.lineStyle(3, 0x00ff88, 0.8);
        this.highlight.strokeCircle(x, y, radius);
        
        this.highlightTween = this.tweens.add({
            targets: { scale: 1 },
            scale: 1.2,
            duration: 500,
            yoyo: true,
            repeat: -1,
            onUpdate: (tween) => {
                const s = tween.getValue();
                this.highlight.clear();
                this.highlight.lineStyle(3, 0x00ff88, 0.8);
                this.highlight.strokeCircle(x, y, radius * s);
            }
        });
    }
    
    clearHighlight() {
        if (this.highlightTween) {
            this.highlightTween.stop();
            this.highlightTween = null;
        }
        this.highlight.clear();
    }
    
    showTutorialMessage(title, text) {
        this.tutorialTitle.setText(title);
        this.tutorialText.setText(text);
    }
    
    showContinuePrompt() {
        this.canProgress = true;
        this.continueText.setVisible(true);
        
        // Pulse animation
        this.tweens.add({
            targets: this.continueText,
            alpha: 0.5,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }
    
    showStep(step) {
        this.tutorialStep = step;
        this.clearHighlight();
        
        const steps = [
            // Step 0: Welcome
            {
                title: 'WELCOME TO 5D CHESS',
                text: 'A tactical space combat game with TIME TRAVEL!',
                action: () => this.showContinuePrompt()
            },
            // Step 1: Select ship
            {
                title: 'STEP 1: SELECT A SHIP',
                text: 'Tap on your blue ship to select it.',
                action: () => {
                    this.highlightArea(this.playerShip.x, this.playerShip.y, 50);
                }
            },
            // Step 2: Move
            {
                title: 'STEP 2: MOVE YOUR SHIP',
                text: 'Tap anywhere in the arena to move your ship there.',
                action: () => {
                    this.clearHighlight();
                }
            },
            // Step 3: Pause
            {
                title: 'STEP 3: PAUSE THE GAME',
                text: this.isPortrait ? 'Tap the PAUSE button below.' : 'Press SPACE or tap PAUSE to pause.',
                action: () => {
                    this.isPaused = true;
                    this.showContinuePrompt();
                }
            },
            // Step 4: Combat
            {
                title: 'STEP 4: ATTACK!',
                text: 'With your ship selected, tap the RED enemy ship to attack it.',
                action: () => {
                    this.isPaused = false;
                    this.highlightArea(this.enemyShip.x, this.enemyShip.y, 50);
                }
            },
            // Step 5: Explain timelines
            {
                title: 'THE MULTIVERSE',
                text: 'In 5D Chess, you can CREATE ALTERNATE TIMELINES. Win in ALL timelines to achieve victory!',
                action: () => {
                    this.clearHighlight();
                    this.showContinuePrompt();
                }
            },
            // Step 6: Temporal jump
            {
                title: 'STEP 5: TEMPORAL JUMP',
                text: this.isPortrait ? 'Select your ship, then tap JUMP to create a new timeline!' : 'Select your ship and press T (or tap JUMP) to branch time!',
                action: () => {
                    if (this.selectedShip) this.selectedShip.deselect();
                    this.selectedShip = this.playerShip;
                    this.playerShip.select();
                    this.highlightArea(this.playerShip.x, this.playerShip.y, 50);
                }
            },
            // Step 7: Complete
            {
                title: 'TUTORIAL COMPLETE!',
                text: 'You\'re ready for battle! Destroy the enemy flagship in ALL timelines to win.',
                action: () => {
                    this.clearHighlight();
                    
                    // Show start battle button
                    const btn = this.add.graphics();
                    btn.setDepth(101);
                    btn.fillStyle(0x44aa44, 1);
                    btn.fillRoundedRect(this.scale.width/2 - 100, this.scale.height - 80, 200, 50, 12);
                    
                    const btnText = this.add.text(this.scale.width/2, this.scale.height - 55, 'START BATTLE!', {
                        fontSize: '20px',
                        fontFamily: 'Orbitron, Arial',
                        color: '#ffffff',
                        fontStyle: 'bold'
                    }).setOrigin(0.5).setDepth(102);
                    
                    const zone = this.add.zone(this.scale.width/2, this.scale.height - 55, 200, 50).setInteractive().setDepth(103);
                    zone.on('pointerdown', () => {
                        this.scene.start('CombatScene');
                    });
                }
            }
        ];
        
        if (step < steps.length) {
            const s = steps[step];
            this.showTutorialMessage(s.title, s.text);
            s.action();
        }
    }
    
    nextStep() {
        this.showStep(this.tutorialStep + 1);
    }
    
    update(time, delta) {
        // Update ships even in tutorial
        if (!this.isPaused) {
            this.combatSystem.update(time, delta);
        }
        
        // Update ship visuals
        for (const ship of this.combatSystem.ships) {
            if (ship.active && ship.update) {
                ship.update(time, delta);
            }
        }
    }
}

if (typeof window !== 'undefined') {
    window.TutorialScene = TutorialScene;
}
