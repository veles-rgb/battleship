// index.js
import "../styles/styles.css";
import "../styles/reset.css";
import { createGrid, renderBoard } from './modules/dom.js';

import { Player } from "./modules/player.js";
import { Ship } from "./modules/ship.js";

// Grab DOM containers
const playerGridContainer = document.getElementById('player-grid');
const enemyGridContainer = document.getElementById('enemy-grid');
const restartButton = document.getElementById('restart-button');

// Create players
const human = new Player('human');
const enemy = new Player('computer');

// Create empty grids
createGrid(playerGridContainer);
createGrid(enemyGridContainer);

// Hard coded player ships
human.gameboard.placeShip(new Ship(5), [0, 0], 'horizontal');
human.gameboard.placeShip(new Ship(4), [2, 2], 'vertical');
human.gameboard.placeShip(new Ship(3), [9, 5], 'horizontal');
human.gameboard.placeShip(new Ship(3), [2, 5], 'horizontal');
human.gameboard.placeShip(new Ship(2), [5, 8], 'horizontal');

// Hard coded computer ships
enemy.gameboard.placeShip(new Ship(5), [0, 0], 'horizontal');
enemy.gameboard.placeShip(new Ship(4), [2, 2], 'vertical');
enemy.gameboard.placeShip(new Ship(3), [9, 5], 'horizontal');
enemy.gameboard.placeShip(new Ship(3), [2, 5], 'horizontal');
enemy.gameboard.placeShip(new Ship(2), [5, 8], 'horizontal');

enemy.gameboard.receiveAttack([2, 0]);
enemy.gameboard.receiveAttack([0, 0]);

enemy.gameboard.receiveAttack([5, 8]);
enemy.gameboard.receiveAttack([5, 9]);

renderBoard(
    playerGridContainer,
    human.gameboard.grid,
    human.gameboard.hitShots,
    human.gameboard.missedShots,
    false
);

renderBoard(
    enemyGridContainer,
    enemy.gameboard.grid,
    enemy.gameboard.hitShots,
    enemy.gameboard.missedShots,
    true
);