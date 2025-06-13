
document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Текущий фильтр
    let currentFilter = 'all';
    
    // Загрузка задач из localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Отображение задач
    function renderTasks() {
        // Фильтрация задач
        let filteredTasks = tasks;
        if (currentFilter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (currentFilter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }
        
        // Очистка списка
        taskList.innerHTML = '';
        
        if (filteredTasks.length === 0) {
            // Отображение состояния "список пуст"
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div>📝</div>
                <p>Задач нет</p>
            `;
            taskList.appendChild(emptyState);
        } else {
            // Добавление задач в список
            filteredTasks.forEach((task, index) => {
                const taskItem = document.createElement('li');
                taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskItem.innerHTML = `
                    <input 
                        type="checkbox" 
                        class="task-checkbox" 
                        ${task.completed ? 'checked' : ''}
                        data-index="${index}"
                    >
                    <span class="task-text">${task.text}</span>
                    <button class="delete-btn" data-index="${index}">×</button>
                `;
                taskList.appendChild(taskItem);
                
            });
        }
        
        // Обновление счетчика задач
        updateTaskCount();
        
        // Сохранение в localStorage
        saveTasks();
    }
    
    // Обновление счетчика задач
    function updateTaskCount() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeTasks} ${getTaskWord(activeTasks)} осталось`;
    }
   
    // Функция для склонения слова "задача"
    function getTaskWord(count) {
        if (count % 10 === 1 && count % 100 !== 11) {
            return 'задача';
        } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
            return 'задачи';
        }
        return 'задач';
    }
    
    // Сохранение задач в localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Добавление новой задачи
    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({
                text: text,
                completed: false,
                timestamp: new Date().toISOString()
            });
            taskInput.value = '';
            renderTasks();
            
        }
    }
    
    // Обработчики событий
    addBtn.addEventListener('click', addTask);
    
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Обработка чекбоксов и кнопок удаления
    taskList.addEventListener('click', function(e) {
        // Переключение состояния задачи
        if (e.target.classList.contains('task-checkbox')) {
            const index = parseInt(e.target.dataset.index);
            tasks[index].completed = e.target.checked;
            renderTasks();
        }
        
        // Удаление задачи
        if (e.target.classList.contains('delete-btn')) {
            const index = parseInt(e.target.dataset.index);
            tasks.splice(index, 1);
            renderTasks();
        }
    });
    
    // Очистка выполненных задач
    clearCompletedBtn.addEventListener('click', function() {
        tasks = tasks.filter(task => !task.completed);
        renderTasks();
    });
    
    // Фильтрация задач
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderTasks();
        });
    });
    
    // Инициализация
    renderTasks();
});
