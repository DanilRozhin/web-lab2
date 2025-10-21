const state = {
    tasks: [],
    currentFilter: 'all',
}

function init() {
    createAppStructure();
    attachEventListeners();
}

function createAppStructure() {
    const header = document.createElement('header');
    header.className = 'header';

    const headerTitle = document.createElement('h1');
    headerTitle.textContent = 'ToDo-List';

    header.appendChild(headerTitle);
    document.body.appendChild(header);


    const main = document.createElement('main');
    main.className = 'main-content';


    const form = document.createElement('form');
    form.className = 'todo-form';

    const input = document.createElement('input');
    input.type = 'text';
    input.required = true;
    input.placeholder = 'Новая задача';
    input.className = 'task-input';

    const addButton = document.createElement('button');
    addButton.type = 'submit';
    addButton.className = 'add-btn';
    addButton.textContent = 'Добавить';

    form.appendChild(input);
    form.appendChild(addButton);



    const tasksSection = document.createElement('section');
    tasksSection.className = 'tasks-section';

    const tasksList = document.createElement('ul');
    tasksList.className = 'tasks-list';

    tasksSection.appendChild(tasksList);


    main.appendChild(form);
    main.appendChild(tasksSection);
    document.body.appendChild(main);

    state.tasksList = tasksList;
    state.taskInput = input;
}

function attachEventListeners() {
    const form = document.querySelector('.todo-form');
    form.addEventListener('submit', handleAddTask);
}

function handleAddTask(event) {
    event.preventDefault();

    const text = state.taskInput.value.trim();
    if (text) {
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date.toISOString()
        };

        state.tasks.push(task);
        state.taskInput.value = '';
        
        const taskElement = createTaskElement(task);
        state.tasksList.appendChild(taskElement);
    }
}

function createTaskElement(task) {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.dataset.id = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => toggleTask(task.id));

    const taskText = document.createElement('p');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    if (task.completed) {
        taskText.style.textDecoration = 'line-through';
        taskText.style.color = '#888';
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Удалить';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(deleteBtn);

    return taskItem;
}

document.addEventListener('DOMContentLoaded', init);
