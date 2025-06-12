# Project Battleship

A browser-based implementation of the classic Battleship game, built with JavaScript, HTML and CSS.

## Table of Contents

- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [How It Works](#how-it-works)
- [Features](#features)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

![Screenshot of Battleship JS](src/images/screenshot.png)

## Installation

```bash
# 1. Clone the repo
git clone https://github.com/veles-rgb/battleship

# 2. Install dependencies
cd battleship
npm install

# 3. Start the dev server
npm run dev / or simply open index.html in your browser
```

## Usage

1. Click “Start Game” to begin placement.
2. Hover over your grid to preview where the next ship (lengths 5, 4, 3, 3, 2) will go.
3. Click to place each ship; use the Rotate button to toggle horizontal/vertical.
4. Once all ships are placed, the game starts automatically.
5. Click on the enemy grid to fire; hits, misses, and sunk animations display in real time.
6. The computer will reply—first chasing any partial hits, then firing randomly.
7. The first to sink all opponent ships wins; click Restart Game to play again.

## How It Works

- Grid Representation
  A 10×10 array (Gameboard.grid), where null means empty and a reference to a Ship object means that ship occupies the cell.
- Ship Placement
  The player’s placement uses a hover preview (green for valid, red for invalid) and click to commit. All boundary and overlap checks are handled by Gameboard.placeShip(ship, [x,y], orientation).
- Attacks
  Gameboard.receiveAttack([x,y]) marks hits or misses and calls Ship.hit(). Sunk ships trigger a special animation.
- Computer AI
  In the Player class, chooseRandomAttack() normally picks a random untried cell. Once it scores a hit on an unsunk ship, it enqueues the four orthogonal neighbors in targetQueue and continues attacking those until the ship sinks, then returns to random mode.

## Project Structure

```
└── 📁battleship
    └── 📁src
        └── 📁images
            └── background.jpg
            └── screenshot.png
        └── 📁js
            └── index.js
            └── 📁modules
                └── dom.js
                └── gameboard.js
                └── player.js
                └── ship.js
        └── 📁styles
            └── reset.css
            └── styles.css
        └── template.html
```

## Sources

- Background image by Abdullah Al Hasan on [Uplash](https://unsplash.com/photos/a-large-ship-in-the-middle-of-the-ocean-8dJM0LwzsfU?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash)
