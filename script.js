// Factory function to create player objects with a specific marker
const createPlayer = (marker) => {
    const getMarker = () => marker;
    return { getMarker }
};