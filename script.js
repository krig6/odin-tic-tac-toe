// Factory function to create player objects with a specific marker
const createPlayer = (marker) => {
    const getMarker = () => marker;
    return { getMarker }
};

// Module for managing the game board
const gameBoard = (() => {
    // Initial empty board array
    let board = ["", "", "", "", "", "", "", "", ""];

    // Save a player's marker to the board array at the given index
    const setMarker = (index, marker) => {
        if (index >= board.length) return;
        board[index] = marker;
    }

    // Retrieve the marker from the board array at the given index
    const getMarker = (index) => {
        if (index >= board.length) return;
        return board[index];
    }

    // Clear the board by resetting all positions to an empty string
    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = ''
        }
    }

    return { setMarker, getMarker, resetBoard }
})();

// Module to handle the game flow logic for the Tic Tac Toe game
const gameFlow = (() => {
    // Game state variables
    let gameOver = false;
    let playerX = createPlayer('X');
    let playerO = createPlayer('O');
    let round = 1;

    // Function to get the current player's mark based on the round number
    const getCurrentMark = () => {
        return round % 2 === 1 ? playerX.getMarker() : playerO.getMarker();
    };

    // Checks if the current move results in a win for the current player.
    const checkWinner = (buttonIndex) => {
        // Define all possible winning combinations of indices on the game board
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
            [0, 4, 8], [2, 4, 6]              // Diagonals
        ];

        // Filter winning combinations to include only those that have the current buttonIndex
        return winningCombinations
            .filter(combination => combination.includes(buttonIndex))
            // Check if all indices in any of the filtered combinations have the same mark as the current player's mark
            .some(possibleCombination => possibleCombination.every(index => gameBoard.getMarker(index) === getCurrentMark()));
    }

    // Plays a round of the game based on the button clicked
    const playRound = (button) => {
        // Place the current player's marker on the game board
        gameBoard.setMarker(button - 1, getCurrentMark());

        // Check if the current move results in a win
        if (checkWinner(button - 1)) {
            display.displayWinnerMessage(getCurrentMark());
            gameOver = true;
            return;
        }
        if (round === 9) {
            display.displayWinnerMessage('Draw');
            gameOver = true;
            return;
        }
        round++;

    }

    // Checks if the game is over and returns true if it is, false otherwise.
    const checkGameOver = () => {
        return gameOver;
    }

    // Resets the game flow variables `round` and `gameOver` to their initial states.
    const resetGameFlow = () => {
        round = 1;
        gameOver = false;
    }

    return { checkGameOver, getCurrentMark, playRound, resetGameFlow };
})();

// Module for managing display messages and elements
const display = (() => {
    const messageContainer = document.querySelector('[data-message]');
    const cellElements = document.querySelectorAll('[data-cell]');
    const playerX = document.querySelector('[data-player-x]')
    const playerO = document.querySelector('[data-player-o]')
    const scoreElementX = document.querySelector('[data-x-score]');
    const scoreElementO = document.querySelector('[data-o-score]');
    const newGameButton = document.querySelector('[data-action="new-game"]');
    const overlay = document.querySelector('[data-overlay]')

    //  Displays the winner message based on the game outcome
    const displayWinnerMessage = (winner) => {
        const message = winner === 'Draw' ? `It's a draw!` : `Player ${winner} has won!`;
        setMessageElement(message);
        updateScore(winner === 'Draw' ? null : winner);
        toggleOverlay(true);
    }

    // Toggles the visibility of the overlay and manages the body's overflow style.
    const toggleOverlay = (show) => {
        messageContainer.classList.toggle('show-overlay');
        if (show) {
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        } else {
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // Sets the text content of the message container element
    const setMessageElement = (message) => {
        messageContainer.textContent = message;
    }

    // Update the display of each game board cell with the current marker from gameBoard
    const updateGameBoard = () => {
        for (let i = 0; i < cellElements.length; i++) {
            cellElements[i].textContent = gameBoard.getMarker(i);
        }
    }

    // Updates the visual indication of the current player's turn on the UI
    const handleTurn = () => {
        const currentPlayerMark = gameFlow.getCurrentMark();

        if (currentPlayerMark === 'X') {
            playerX.classList.add('active-turn');
            playerO.classList.remove('active-turn');
        } else {
            playerO.classList.add('active-turn');
            playerX.classList.remove('active-turn');
        }
    }

    // Resets the player turn to start with player X by adding 'active-turn' class to playerX and removing it from playerO 
    const resetPlayerTurn = () => {
        playerX.classList.add('active-turn');
        playerO.classList.remove('active-turn');
    }

    // Sets the color of the marker based on the current player's mark
    const setMarkColor = (event) => {
        const targetElement = event.target;
        const currentPlayerMark = gameFlow.getCurrentMark();

        targetElement.classList.add(currentPlayerMark);
    }

    // Clears marker classes ('O' and 'X') from all board cells.
    const clearMarkClasses = () => {
        cellElements.forEach(cell => {
            cell.classList.remove('O', 'X');
        });
    }

    // Updates the score display for the specified player ('X' or 'O').
    const updateScore = (player) => {
        if (player === 'X') {
            scoreElementX.textContent = parseInt(scoreElementX.textContent) + 1;
        } else if (player === 'O') {
            scoreElementO.textContent = parseInt(scoreElementO.textContent) + 1;
        }
    }

    // Handles click events on individual board cells
    const cellClickHandler = (event) => {
        const clickedCell = event.target;

        if (clickedCell.textContent === '') {
            setMarkColor(event);
        }

        if (gameFlow.checkGameOver() || clickedCell.textContent !== '') return;
        gameFlow.playRound(parseInt(clickedCell.id));
        updateGameBoard();
        handleTurn();

    }

    // Function to start a new game by resetting all game state and UI elements except scores
    const startNewGame = () => {
        gameBoard.resetBoard();
        gameFlow.resetGameFlow();
        updateGameBoard();
        clearMarkClasses();
        resetPlayerTurn();
        setMessageElement(``);
    }

    cellElements.forEach(cell => {
        cell.addEventListener('click', cellClickHandler);
    })

    newGameButton.addEventListener('click', () => {
        gameBoard.resetBoard();
        gameFlow.resetGameFlow();
        updateGameBoard();
        clearMarkClasses();
        resetPlayerTurn();
        setMessageElement(``);
    })

    // Event listener to close the overlay when clicked
    overlay.addEventListener('click', () => {
        toggleOverlay(false);
        startNewGame();
    });

    return { setMessageElement, displayWinnerMessage }
})();