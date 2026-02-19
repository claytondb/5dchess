/**
 * BootScene - Initial loading screen
 */
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }
    
    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Title
        this.add.text(width / 2, height / 2 - 100, '5D CHESS', {
            fontSize: '48px',
            fontFamily: 'Segoe UI',
            color: '#4488ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(width / 2, height / 2 - 50, 'MULTIVERSE TACTICS', {
            fontSize: '24px',
            fontFamily: 'Segoe UI',
            color: '#88bbff'
        }).setOrigin(0.5);
        
        // Loading text
        const loadingText = this.add.text(width / 2, height / 2 + 30, 'INITIALIZING TEMPORAL DRIVE...', {
            fontSize: '16px',
            fontFamily: 'Segoe UI',
            color: '#667'
        }).setOrigin(0.5);
        
        // Progress bar background
        const progressBg = this.add.rectangle(width / 2, height / 2 + 70, 300, 20, 0x222222);
        
        // Progress bar
        const progressBar = this.add.rectangle(width / 2 - 145, height / 2 + 70, 0, 16, 0x4488ff);
        progressBar.setOrigin(0, 0.5);
        
        // Simulate loading
        this.time.delayedCall(500, () => {
            this.tweens.add({
                targets: progressBar,
                width: 290,
                duration: 1000,
                ease: 'Cubic.out',
                onComplete: () => {
                    loadingText.setText('READY');
                    this.time.delayedCall(300, () => {
                        this.scene.start('MenuScene');
                    });
                }
            });
        });
    }
    
    create() {
        // No assets to preload for MVP - we generate graphics
    }
}

// Export
if (typeof window !== 'undefined') {
    window.BootScene = BootScene;
}
