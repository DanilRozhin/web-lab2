const state = {
    tasks: [],
    currentFilter: 'all',
    searchText: ''
}

function init() {
    // localStorage.removeItem('todoTasks');
    createAppStructure();
    loadTasks();
}

function loadTasks() {
    const saved = localStorage.getItem('todoTasks');
    if (saved) {
        state.tasks = JSON.parse(saved);

        renderTasks();
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
    form.addEventListener('submit', handleAddTask);

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

    const sortButton = document.createElement('button');
    sortButton.className = 'sort-btn';
    sortButton.type = 'button';
    sortButton.textContent = 'Сортировать по дате';
    sortButton.addEventListener('click', sortTasksByDate);


    const filterLabel = document.createElement('label');
    filterLabel.textContent = 'Задачи: ';
    filterLabel.className = 'filter-label';

    const filterSelect = document.createElement('select');
    filterSelect.className = 'filter-select';
    filterSelect.addEventListener('change', handleFilterChange);

    const optionAll = document.createElement('option');
    optionAll.value = 'all';
    optionAll.textContent = 'Все';

    const optionActive = document.createElement('option');
    optionActive.value = 'active';
    optionActive.textContent = 'Невыполненные';
    
    const optionCompleted = document.createElement('option');
    optionCompleted.value = 'completed';
    optionCompleted.textContent = 'Выполненные';

    filterSelect.appendChild(optionAll);
    filterSelect.appendChild(optionActive);
    filterSelect.appendChild(optionCompleted);

    filterLabel.appendChild(filterSelect);



    const searchField = document.createElement('input');
    searchField.type = 'search';
    searchField.placeholder = 'Поиск задач';
    searchField.className = 'search-field';
    searchField.addEventListener('input', handleSearch);

    

    const tasksSection = document.createElement('section');
    tasksSection.className = 'tasks-section';

    const tasksDom = document.createElement('ul');
    tasksDom.className = 'tasks-list';

    tasksSection.appendChild(tasksDom);


    main.appendChild(form);
    main.appendChild(sortButton);
    main.appendChild(filterLabel);
    main.appendChild(searchField);
    main.appendChild(tasksSection);
    document.body.appendChild(main);

    state.tasksDom = tasksDom;
    state.taskInput = input;
    state.dateInput = dateInput;
    state.sortButton = sortButton;
    state.searchField = searchField;
}

function renderTasks() {
    state.searchText = '';
    if (state.searchField) {
        state.searchField.value = '';
    }
    updateDisplay();
}

function sortTasksByDate() {
    state.tasks.sort((a, b) => {
        if (!a.taskDate && !b.taskDate) return 0;
        if (!a.taskDate) return 1;
        if (!b.taskDate) return -1;

        const dateA = new Date(a.taskDate);
        const dateB = new Date(b.taskDate);
        
        return dateA - dateB;
    });

    saveTasks();
    updateDisplay();
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
        
        updateDisplay();
    }
}

function handleFilterChange(event) {
    state.currentFilter = event.target.value;
    updateDisplay();
}

function handleSearch(event) {
    state.searchText = event.target.value.toLowerCase().trim();
    updateDisplay();
}

function updateDisplay() {
    while (state.tasksDom.firstChild) {
        state.tasksDom.removeChild(state.tasksDom.firstChild);
    }

    const filteredTasks = state.tasks.filter(task => {
        let statusMatch = true;
        switch (state.currentFilter) {
            case 'active':
                statusMatch = !task.completed;
                break;
            case 'completed':
                statusMatch = task.completed;
                break;
            default:
                statusMatch = true;
        }
        
        let searchMatch = true;
        if (state.searchText) {
            searchMatch = task.text.toLowerCase().includes(state.searchText);
        }
        
        return statusMatch && searchMatch;
    });

    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        state.tasksDom.appendChild(taskElement);
    });
}

function createTaskElement(task) {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.dataset.id = task.id;

    taskItem.draggable = true;
    taskItem.addEventListener('dragstart', handleDragStart); // Захватили
    taskItem.addEventListener('dragover', handleDragOver); // Тащим
    taskItem.addEventListener('drop', handleDrop); // Бросили

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
    editBtn.addEventListener('click', () => editTask(task.id));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'x';
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);
    taskItem.appendChild(taskDate);
    taskItem.appendChild(editBtn);
    taskItem.appendChild(deleteBtn);

    return taskItem;
}

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', this.dataset.id);
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    
    const draggedId = parseInt(event.dataTransfer.getData('text/plain'));
    const targetId = parseInt(this.dataset.id);
    
    const draggedIndex = state.tasks.findIndex(task => task.id === draggedId);
    const targetIndex = state.tasks.findIndex(task => task.id === targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
        const [movedTask] = state.tasks.splice(draggedIndex, 1);
        state.tasks.splice(targetIndex, 0, movedTask);
        
        saveTasks();
        updateDisplay();
    }
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

function editTask(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const newText = prompt('Редактировать задачу:', task.text);
    if (newText === null) return;
    
    const newDate = prompt('Новая дата (ГГГГ-ММ-ДД):', task.taskDate || '');
    if (newDate === null) return;

    if (newDate && !/^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
        alert('Необходимый формат даты: ГГГГ-ММ-ДД');
        return;
    }

    if (newText.trim() !== '') {
        task.text = newText.trim();
    }
    task.taskDate = newDate;
    saveTasks();
    
    const taskElement = document.querySelector(`[data-id="${taskId}"]`);
    if (taskElement) {
        const taskText = taskElement.querySelector('.task-text');
        const taskDate = taskElement.querySelector('.task-date');
        
        taskText.textContent = task.text;
        taskDate.textContent = task.taskDate || '';
        taskDate.dateTime = task.taskDate;
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
