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

// Game configuration
const config = {
    type: Phaser.AUTO,
    width: 900,
    height: 650,
    parent: 'game-container',
    backgroundColor: '#0a0a12',
    scene: [BootScene, CombatScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
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
