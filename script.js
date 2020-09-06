let searchTerms = []

const firstStopInput = document.getElementById("firstStop");
firstStopInput.addEventListener('input', event => getStopData(event.target.value));

const getStopData = (stopNumber) => {
    const validStop = validateStopNumber(stopNumber)
}

const validateStopNumber = (stopNumber) => {
    let validSizeAndFormat = false
    // size constraint & special cases
    const firstChar = stopNumber.charAt(0)
    if (stopNumber.length > 0 && stopNumber.length <= 4 && firstChar !== "0") {
        if (stopNumber.substring(0, 2) === "PT" && !isNaN(stopNumber.substring(2))) {
            validSizeAndFormat = true
        } else if ((firstChar === "L" || firstChar === "P" || firstChar === "T") && !isNaN(stopNumber.substring(1))) {
            validSizeAndFormat = true
        } else if (!isNaN(stopNumber)) {
            validSizeAndFormat = true
        }
    } else if (stopNumber === "LTulo") {
        validSizeAndFormat = true
    }

    if (searchTerms[stopNumber]) {
        console.log("don't fire fetch, client already has data")
    } else {
        searchTerms[stopNumber] = "jeij"
    }
}