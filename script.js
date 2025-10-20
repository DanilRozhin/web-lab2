const state = {
    tasks: [],
    currentFilter: 'all',
}

function init() {
    createAppStructure();
}

function createAppStructure() {
    const header = document.createElement('header');
    header.className = 'header';

    const headerTitle = document.createElement('h1');
    headerTitle.textContent = 'To-Do List';

    header.appendChild(headerTitle);

    document.body.appendChild(header);
}

document.addEventListener('DOMContentLoaded', init);
