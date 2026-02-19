/**
 * 5D Chess: Multiverse Tactics
 * MVP Prototype - Main Entry Point
 * 
 * Core Mechanics:
 * - Real-time combat with pause
 * - Temporal jumps create timeline branches
 * - Maximum 3 concurrent timelines
 * - Win by destroying enemy flagship in all timelines
 * 
 * Controls:
 * - SPACE: Pause/Unpause
 * - Left Click: Select ship
 * - Right Click: Move/Attack order
 * - T: Temporal jump (creates new timeline branch)
 * - 1-3: Switch between timelines
 */

// Detect mobile and orientation
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
    || window.innerWidth < 768;
const isPortrait = window.innerHeight > window.innerWidth;

// Set canvas size based on orientation
// Portrait: taller, narrower canvas
// Landscape: wider canvas (original)
const canvasWidth = isPortrait ? 400 : 900;
const canvasHeight = isPortrait ? 700 : 650;

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: canvasWidth,
    height: canvasHeight,
    parent: 'game-container',
    backgroundColor: '#0a0a12',
    scene: [BootScene, MenuScene, TutorialScene, CombatScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: canvasWidth,
        height: canvasHeight
    },
    input: {
        activePointers: 3,  // Support multi-touch
        touch: {
            capture: true
        }
    },
    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: true
    }
};

// Initialize game
const game = new Phaser.Game(config);

// Expose game globally for debugging
window.game = game;

console.log('5D Chess: Multiverse Tactics - MVP Initialized');
console.log('Controls:');
console.log('  SPACE - Pause/Unpause');
console.log('  Click - Select ship');
console.log('  Right-Click - Move/Attack');
console.log('  T - Temporal Jump (when paused)');
console.log('  1-3 - Switch timelines');
