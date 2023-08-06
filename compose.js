function renderBody(innerHTML = ``) {
    document.body.innerHTML = innerHTML;
}

function renderElement(elementToAppend, innerHTML = ``) {
    elementToAppend.innerHTML = innerHTML
}

function createComponent(arrayOfObjects = [{}], parserFunction = () => {}) {
    arrayOfObjects.forEach(item => {
        parserFunction(item);
    })
}

export {renderBody, renderElement, createComponent}