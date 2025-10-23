const state = {
    tasks: [],
    currentFilter: 'all',
}

function init() {
    // localStorage.removeItem('todoTasks');
    createAppStructure();
    loadTasks();
    attachEventListeners();
}

function loadTasks() {
    const saved = localStorage.getItem('todoTasks');
    if (saved) {
        state.tasks = JSON.parse(saved);

        state.tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            state.tasksList.appendChild(taskElement);
        });
    }
}

function saveTasks() {
    localStorage.setItem('todoTasks', JSON.stringify(state.tasks));
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

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'date-input';
    dateInput.valueAsDate = new Date();

    const addButton = document.createElement('button');
    addButton.type = 'submit';
    addButton.className = 'add-btn';
    addButton.textContent = 'Добавить';

    form.appendChild(input);
    form.appendChild(dateInput);
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
    state.dateInput = dateInput;
}

function attachEventListeners() {
    const form = document.querySelector('.todo-form');
    form.addEventListener('submit', handleAddTask);
}

function handleAddTask(event) {
    event.preventDefault();

    const text = state.taskInput.value.trim();
    const taskDate = state.dateInput.value;

    if (text) {
        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            taskDate: taskDate
        };

        state.tasks.push(task);
        saveTasks();
        state.taskInput.value = '';
        state.dateInput.valueAsDate = new Date();
        
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

    const taskDate = document.createElement('time');
    taskDate.className = 'task-date';
    taskDate.dateTime = task.taskDate;

    if (task.completed) {
        taskText.style.textDecoration = 'line-through';
        taskText.style.color = '#888';
    }

    if (task.taskDate) {
        taskDate.textContent = task.taskDate;
    }

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Изменить';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Удалить';
    deleteBtn.textContent = 'x';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(taskDate);
    taskItem.appendChild(editBtn);
    taskItem.appendChild(deleteBtn);

    return taskItem;
}

function toggleTask(taskId) {
    const task = state.tasks.find(t => t.id === taskId);

    if (task) {
        task.completed = !task.completed;
        saveTasks();
    
        const taskElement = document.querySelector(`[data-id="${taskId}"]`);
        
        if (taskElement) {
            const taskText = taskElement.querySelector('.task-text');
            taskText.style.textDecoration = task.completed ? 'line-through' : 'none';
            taskText.style.color = task.completed ? '#888' : 'inherit';
        }
    }
}

function deleteTask(taskId) {
    state.tasks = state.tasks.filter(t => t.id !== taskId);
    saveTasks();

    const taskElement = document.querySelector(`[data-id="${taskId}"]`);
    if (taskElement) {
        taskElement.remove();
    }
}

document.addEventListener('DOMContentLoaded', init);
