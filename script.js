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
        return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
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

        display.setMessageElement(`${getCurrentMark()}'s turn`)
    }

    return { getCurrentMark, playRound };
})();

// Module for managing display messages and elements
const display = (() => {
    const messageContainer = document.querySelector('[data-message]');
    const cellElements = document.querySelectorAll('[data-cell]');

    //  Displays the winner message based on the game outcome
    const displayWinnerMessage = (winner) => {
        if (winner === 'Draw') {
            setMessageElement(`It's a draw!`)
        } else {
            setMessageElement(`Player ${winner} has won!`);
            setScore(gameFlow.getCurrentMark());
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

    return { setMessageElement, displayWinnerMessage }
})();