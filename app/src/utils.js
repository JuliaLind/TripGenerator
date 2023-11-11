/**
 * Helper function for creating new elements
 * @param {string} hyperscript
 * @param {Object} [attributes]
 * @param {Object} [options]
 * @returns {HTMLElement}
 */
function createElement(hyperscript, attributes={}, options={}) {
    const hyperscriptArray = hyperscript.split(".");
    const classes = hyperscriptArray.slice(1);
    let element = document.createElement(hyperscriptArray[0]);

    classes.forEach((item) => {
        element.classList.add(item);
    });

    for (const option in options) {
        element[option] = options[option];
    }

    for (const attribute in attributes) {
        element.setAttribute(attribute, attributes[attribute]);
    }

    return element;
}

export { createElement };
