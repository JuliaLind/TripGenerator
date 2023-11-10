import { addMap } from './src/map.js';

/**
 * Renders the main view of this single-page application
 */
async function renderMainView() {
    const file = await fetch('../../counter.json');
    const counter = await file.json();
    await addMap(counter.bikes);
}

await renderMainView();