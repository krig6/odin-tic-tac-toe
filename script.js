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