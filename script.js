let state = {
    searchTerms: [],
    currentStopNumber: "",
    line: "",
}

const firstStopInput = document.getElementById("firstStop");
firstStopInput.addEventListener('input', event => getStopData(event.target.value));
const firstLineInput = document.getElementById("firstLine");
firstLineInput.addEventListener('input', event => updateLineToState(event.target.value));

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
        return e
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
    const firstStopList = document.getElementById("firstStopList")
    //clear previous li-items
    while (firstStopList.firstChild) {
        firstStopList.removeChild(firstStopList.firstChild)
    }

    //append new data
    data.result.slice(0, 10).map(result => {
        if (result.lineref === state.line || state.line === "") {
            const arrivalTime = new Date(result.expectedarrivaltime * 1000)
            const arrivalTimeFormatted = arrivalTime.getHours() + ":" + arrivalTime.getMinutes() + ":" + arrivalTime.getSeconds()
            const li = document.createElement("li");
            li.appendChild(document.createTextNode(result.lineref + " " + arrivalTimeFormatted))
            li.setAttribute("class", "list-group-item")
            firstStopList.appendChild(li)
        }
    })
}