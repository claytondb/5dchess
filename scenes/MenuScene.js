/**
 * MenuScene - Main menu with Tutorial and Play options
 */
class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    create() {
        // Background
        this.createBackground();
        
        // Title
        this.add.text(this.scale.width / 2, 80, '5D CHESS', {
            fontSize: '48px',
            fontFamily: 'Orbitron, Arial Black',
            color: '#4488ff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setShadow(0, 0, '#0044aa', 10, true, true);
        
        this.add.text(this.scale.width / 2, 130, 'MULTIVERSE TACTICS', {
            fontSize: '20px',
            fontFamily: 'Rajdhani, Arial',
            color: '#88aacc',
            letterSpacing: 8
        }).setOrigin(0.5);
        
        // Tagline
        this.add.text(this.scale.width / 2, 170, 'Real-time combat across time and space', {
            fontSize: '14px',
            fontFamily: 'Rajdhani, Arial',
            color: '#667788'
        }).setOrigin(0.5);
        
        // Animated ship preview
        this.createShipPreview();
        
        // Menu buttons
        const centerY = this.scale.height / 2 + 40;
        
        this.createButton(this.scale.width / 2, centerY - 40, 'TUTORIAL', 0x44aa44, () => {
            this.scene.start('TutorialScene');
        });
        
        this.createButton(this.scale.width / 2, centerY + 30, 'PLAY', 0x4488ff, () => {
            this.scene.start('CombatScene');
        });
        
        // Instructions at bottom
        const isPortrait = this.scale.height > this.scale.width;
        const instructionText = isPortrait 
            ? 'Tap to select • Double-tap to order'
            : 'Click to select • Right-click to order • SPACE to pause';
        
        this.add.text(this.scale.width / 2, this.scale.height - 60, instructionText, {
            fontSize: '12px',
            fontFamily: 'Rajdhani, Arial',
            color: '#556677'
        }).setOrigin(0.5);
        
        // Version
        this.add.text(this.scale.width / 2, this.scale.height - 30, 'v1.0 MVP', {
            fontSize: '11px',
            fontFamily: 'Rajdhani, Arial',
            color: '#334455'
        }).setOrigin(0.5);
    }
    
    createBackground() {
        const bg = this.add.graphics();
        
        // Gradient background
        const colors = [0x050510, 0x0a0a20, 0x0d0d28, 0x0a0a18];
        const height = this.scale.height / colors.length;
        colors.forEach((color, i) => {
            bg.fillStyle(color, 1);
            bg.fillRect(0, i * height, this.scale.width, height + 1);
        });
        
        // Stars
        for (let i = 0; i < 150; i++) {
            const x = Phaser.Math.Between(0, this.scale.width);
            const y = Phaser.Math.Between(0, this.scale.height);
            const size = Phaser.Math.FloatBetween(0.5, 2);
            const alpha = Phaser.Math.FloatBetween(0.2, 0.7);
            bg.fillStyle(0xffffff, alpha);
            bg.fillCircle(x, y, size);
        }
        
        // Nebula accents
        bg.fillStyle(0x2a1040, 0.3);
        bg.fillCircle(this.scale.width * 0.2, this.scale.height * 0.3, 150);
        bg.fillStyle(0x102040, 0.3);
        bg.fillCircle(this.scale.width * 0.8, this.scale.height * 0.7, 120);
    }
    
    createShipPreview() {
        // Draw simple ship graphics for the menu
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2 - 60;
        
        // Player ship (left)
        const playerShip = this.add.graphics();
        playerShip.fillStyle(0x2288ff, 1);
        playerShip.fillTriangle(0, -15, 20, 0, 0, 15);
        playerShip.fillTriangle(0, -15, -15, -10, 0, 15);
        playerShip.fillTriangle(0, 15, -15, 10, 0, -15);
        playerShip.lineStyle(2, 0x66bbff, 0.8);
        playerShip.strokeTriangle(0, -15, 20, 0, 0, 15);
        playerShip.setPosition(centerX - 60, centerY);
        
        // Enemy ship (right)
        const enemyShip = this.add.graphics();
        enemyShip.fillStyle(0xff3333, 1);
        enemyShip.fillTriangle(0, -15, -20, 0, 0, 15);
        enemyShip.fillTriangle(0, -15, 15, -10, 0, 15);
        enemyShip.fillTriangle(0, 15, 15, 10, 0, -15);
        enemyShip.lineStyle(2, 0xff7777, 0.8);
        enemyShip.strokeTriangle(0, -15, -20, 0, 0, 15);
        enemyShip.setPosition(centerX + 60, centerY);
        
        // VS text
        this.add.text(centerX, centerY, 'VS', {
            fontSize: '24px',
            fontFamily: 'Orbitron, Arial',
            color: '#ffaa00'
        }).setOrigin(0.5);
        
        // Timeline indicator
        const timeline = this.add.graphics();
        timeline.lineStyle(2, 0x00ffff, 0.5);
        timeline.strokeCircle(centerX, centerY, 80);
        
        // Animate ships
        this.tweens.add({
            targets: playerShip,
            x: centerX - 55,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        this.tweens.add({
            targets: enemyShip,
            x: centerX + 55,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Pulse timeline ring
        this.tweens.add({
            targets: timeline,
            alpha: 0.3,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createButton(x, y, text, color, callback) {
        const width = 180;
        const height = 50;
        
        // Button background
        const btn = this.add.graphics();
        btn.fillStyle(color, 0.9);
        btn.fillRoundedRect(x - width/2, y - height/2, width, height, 12);
        btn.lineStyle(2, Phaser.Display.Color.ValueToColor(color).lighten(30).color, 1);
        btn.strokeRoundedRect(x - width/2, y - height/2, width, height, 12);
        
        // Glow effect
        const glow = this.add.graphics();
        glow.fillStyle(color, 0.2);
        glow.fillRoundedRect(x - width/2 - 4, y - height/2 - 4, width + 8, height + 8, 14);
        glow.setDepth(-1);
        
        // Button text
        const btnText = this.add.text(x, y, text, {
            fontSize: '20px',
            fontFamily: 'Orbitron, Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Interactive zone
        const zone = this.add.zone(x, y, width, height).setInteractive({ useHandCursor: true });
        
        zone.on('pointerover', () => {
            btn.clear();
            btn.fillStyle(Phaser.Display.Color.ValueToColor(color).lighten(20).color, 1);
            btn.fillRoundedRect(x - width/2, y - height/2, width, height, 12);
            btn.lineStyle(2, 0xffffff, 1);
            btn.strokeRoundedRect(x - width/2, y - height/2, width, height, 12);
        });
        
        zone.on('pointerout', () => {
            btn.clear();
            btn.fillStyle(color, 0.9);
            btn.fillRoundedRect(x - width/2, y - height/2, width, height, 12);
            btn.lineStyle(2, Phaser.Display.Color.ValueToColor(color).lighten(30).color, 1);
            btn.strokeRoundedRect(x - width/2, y - height/2, width, height, 12);
        });
        
        zone.on('pointerdown', callback);
    }
}

if (typeof window !== 'undefined') {
    window.MenuScene = MenuScene;
}
