let WORD = "";
const MAX_ATTEMPTS = 6;
let currentAttempt = 0;

const grid = document.getElementById('grid');
const input = document.getElementById('guess-input');
const message = document.getElementById('message');

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    submitGuess();
  }
});

function createGrid() {
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const row = document.createElement('div');
        row.className = 'row';

        for (let j = 0; j < 5; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            row.appendChild(tile);
        }

        grid.appendChild(row);
    }
}

function submitGuess() {
    if (!WORD) return;

    const guess = input.value.toUpperCase();
    if (guess.length !== 5) {
        message.textContent = "Enter a 5-letter word!";
        input.focus();
        return;
    }

    const row = grid.children[currentAttempt];
    const tiles = row.children;

    const letterCount = {};
    for (let l of WORD) {
        letterCount[l] = (letterCount[l] || 0) + 1;
    }

    for (let i = 0; i < 5; i++) {
        const tile = tiles[i];
        tile.textContent = guess[i];

        if (guess[i] === WORD[i]) {
            tile.classList.add("correct");
            letterCount[guess[i]]--;
        }
    }

    for (let i = 0; i < 5; i++) {
        const tile = tiles[i];
        if (!tile.classList.contains("correct")) {
            if (WORD.includes(guess[i]) && letterCount[guess[i]] > 0) {
                tile.classList.add("present");
                letterCount[guess[i]]--;
            } else {
                tile.classList.add("absent");
            }
        }
    }

    currentAttempt++;
    input.value = "";
    input.focus();

    if (guess === WORD) {
        message.textContent = "You got it!";
        input.disabled = true;
    } else if (currentAttempt === MAX_ATTEMPTS) {
        message.textContent = `Word was "${WORD}"`;
        input.disabled = true;
    }
    
}

async function loadWord() {
    try {
        const response = await fetch("data/words.json");
        const words = await response.json();
        WORD = words[Math.floor(Math.random() * words.length)].toUpperCase();
        console.log("Word selected:", WORD);
        message.textContent = "Start guessing!";
    } catch (err) {
        console.error("Failed to load word list", err);
        message.textContent = "Error loading word list.";
        input.disabled = true;
    }
}

createGrid();
loadWord();