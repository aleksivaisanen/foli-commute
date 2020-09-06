let state = {
    searchTerms: [],
    currentStopNumber: "",
    line: "",
    favoriteStops: [],
    favoriteLines: []
}

const stopInput = document.getElementById("firstStop");
stopInput.addEventListener('input', event => getStopData(event.target.value));
const lineInput = document.getElementById("firstLine");
lineInput.addEventListener('input', event => updateLineToState(event.target.value));
const stopFavorite = document.getElementById("stopFavorite");
stopFavorite.addEventListener('click', () => setFavoriteStop());
const lineFavorite = document.getElementById("lineFavorite");
lineFavorite.addEventListener('click', () => setFavoriteLine());

const getStopData = (stopNumber) => {
    state.currentStopNumber = stopNumber;
    const validStop = validateStopNumber()
    if (validStop) {
        fetchStopData(state.currentStopNumber)
            .then(data => {
                renderResults(data)
            })
    } else if (state.searchTerms[state.currentStopNumber]) {
        //if there already is data
        renderResults()
    }
}

const validateStopNumber = () => {
    let validSizeAndFormat = false
    // size constraint & special cases
    const firstChar = state.currentStopNumber.charAt(0)
    if (state.currentStopNumber.length > 0 && state.currentStopNumber.length <= 4 && firstChar !== "0") {
        if (state.currentStopNumber.substring(0, 2) === "PT" && !isNaN(state.currentStopNumber.substring(2))) {
            validSizeAndFormat = true
        } else if ((firstChar === "L" || firstChar === "P" || firstChar === "T") && !isNaN(state.currentStopNumber.substring(1))) {
            validSizeAndFormat = true
        } else if (!isNaN(state.currentStopNumber)) {
            validSizeAndFormat = true
        }
    } else if (state.currentStopNumber === "LTulo") {
        validSizeAndFormat = true
    }

    if (!state.searchTerms[state.currentStopNumber] && validSizeAndFormat) {
        return true
    } else {
        return false
    }
}

const fetchStopData = async function () {
    try {
        const response = await fetch("http://data.foli.fi/siri/sm/" + state.currentStopNumber);
        return response.json();
    } catch (e) {
        console.error("Fetch failed", e)
    }
}

const updateLineToState = (line) => {
    state.line = line
    renderResults()
}

const renderResults = (data = null) => {
    if (data !== null) {
        state.searchTerms[state.currentStopNumber] = data
    } else {
        data = state.searchTerms[state.currentStopNumber]
    }

    //append new data
    const newTBody = document.createElement('tbody');
    const oldTBody = document.querySelector("tbody")
    if (data !== undefined) {
        data.result.slice(0, 8).map(result => {
            if (result.lineref === state.line || state.line === "") {
                const arrivalTime = new Date(result.expectedarrivaltime * 1000)
                const arrivalTimeFormatted = arrivalTime.getHours() + ":" + arrivalTime.getMinutes() + ":" + arrivalTime.getSeconds()
                const row = newTBody.insertRow(-1);
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                cell1.innerHTML = result.lineref;
                cell2.innerHTML = arrivalTimeFormatted;
            }
        })
    }
    oldTBody.parentNode.replaceChild(newTBody, oldTBody)
}

const setFavoriteStop = () => {
    if (!state.favoriteStops.includes(state.currentStopNumber)) {
        state.favoriteStops.push(state.currentStopNumber)
        addFavoriteToUI(state.currentStopNumber, "favoriteStops")
    } else {
        // don't add duplicates
    }
}

const setFavoriteLine = () => {
    if (!state.favoriteLines.includes(state.line)) {
        state.favoriteLines.push(state.line)
        addFavoriteToUI(state.line, "favoriteLines")
    } else {
        // don't add duplicates
    }
}

const addFavoriteToUI = (id, element) => {
    const favoriteStopsContainer = document.getElementById(element)
    const button = document.createElement("button")
    button.innerHTML = id
    button.id = id
    button.classList.add("btn", "btn-outline-primary", "btn-sm")
    favoriteStopsContainer.appendChild(button)
}