// Seleção de elementos do modal e inputs para manipulação de tarefas
const $modal = document.getElementById('modal');
const $descriptionInput = document.getElementById('description');
const $tagsInput = document.getElementById('tags');
const $deadlineInput = document.getElementById('deadline');
const $idInput = document.getElementById('idInput');

const $creationModeTitle = document.getElementById('creationModeTitle');
const $editingModeTitle = document.getElementById('editingModeTitle');

const $creationModeBtn = document.getElementById('creationModeBtn');
const $editingModeBtn = document.getElementById('editingModeBtn');

// Usuários
class App {
  constructor() {
    this.$users = document.querySelector('#users');
    this.selectedUserId = this.loadSelectedUserId(); // Carrega o ID do usuário selecionado do localStorage
    this.users = this.loadUsers() || []; // Carrega a lista de usuários do localStorage ou inicializa uma vazia
    this.fetchUsers();
  }

  async fetchUsers() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users'); // API de exemplo para usuários
      if (!response.ok) {
        throw new Error(`Erro na resposta da API: ${response.status} ${response.statusText}`);
      }

      const users = await response.json();
      if (users.length === 0) {
        throw new Error('Nenhum usuário encontrado.');
      }

      // Limitar a 4 usuários e adicionar uma URL de foto fictícia e tarefas fictícias
      this.users = users.slice(0, 4).map(user => ({
        ...user,
        photoUrl: `https://i.pravatar.cc/150?img=${user.id}`, // API de exemplo para fotos
        tasks: this.loadTasksForUser(user.id) || [] // Carrega tarefas do localStorage
      }));

      // Define um usuário padrão como selecionado se não houver no localStorage
      if (!this.selectedUserId) {
        this.selectedUserId = this.users[0].id;
      }

      this.renderUsers();
      this.renderTasks();
      updateTaskCount();
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  }

  saveUsers() {
    localStorage.setItem('kanbanUsers', JSON.stringify(this.users));
  }

  loadUsers() {
    return JSON.parse(localStorage.getItem('kanbanUsers'));
  }

  saveSelectedUserId() {
    localStorage.setItem('selectedUserId', this.selectedUserId);
  }

  loadSelectedUserId() {
    return parseInt(localStorage.getItem('selectedUserId'));
  }

  saveTasksForUser(userId) {
    const user = this.users.find(user => user.id === userId);
    if (user) {
      localStorage.setItem(`tasks_${userId}`, JSON.stringify(user.tasks));
    }
  }

  loadTasksForUser(userId) {
    return JSON.parse(localStorage.getItem(`tasks_${userId}`));
  }

  renderUsers() {
    const userListContainer = document.getElementById('user-list');

    const html = this.users
      .map((user) => {
        const selectedClass = user.id === this.selectedUserId ? 'selected' : '';
        return `
          <div class="user-card ${selectedClass}" data-user-id="${user.id}">
            <img src="${user.photoUrl}" alt="Foto de ${user.name}" />
          </div>
        `;
      })
      .join('');

    userListContainer.innerHTML = html;

    // Adicionar evento de clique a cada cartão de usuário
    document.querySelectorAll('.user-card').forEach(card => {
      card.addEventListener('click', (event) => {
        const userId = event.currentTarget.getAttribute('data-user-id');
        this.selectedUserId = parseInt(userId, 10);
        this.saveSelectedUserId(); // Salva o usuário selecionado no localStorage
        this.renderUsers();
        this.renderTasks();
        updateTaskCount();
      });
    });
  }

  renderTasks() {
    const user = this.users.find(user => user.id === this.selectedUserId);
    const taskListContainer = document.querySelectorAll('.cards_list');
  
    if (user) {
      taskListContainer.forEach(container => container.innerHTML = ''); // Limpar todas as colunas
  
      user.tasks.forEach(task => {
        const formattedDate = moment(task.deadline).format('DD/MM/YYYY');
        const columnBody = document.querySelector(`[data-column="${task.column}"] .body .cards_list`);
        
        if (!columnBody) return;
  
        let cardClass = '';
        switch (task.column) {
          case 1:
            cardClass = 'todo';
            break;
          case 2:
            cardClass = 'in-progress';
            break;
          case 3:
            cardClass = 'completed';
            break;
        }
  
        const card = `
          <div
            id="${task.id}"
            class="card ${cardClass}"
            ondblclick="openModalToEdit(${task.id})"
            draggable="true"
            ondragstart="dragstart_handler(event)"
          >
            <div class="info">
              <b>Atividade:</b>
              <span>${task.description}</span>
            </div>
            <div class="info">
              <b>Setor:</b>
              <span>${task.tags}</span>
            </div>
            <div class="info">
              <b>Prazo:</b>
              <span>${formattedDate}</span>
            </div>
            <button class="material-symbols-outlined" onclick="deleteTask(${task.id})">delete</button>
          </div>
        `;
        columnBody.innerHTML += card;
      });

      this.saveTasksForUser(this.selectedUserId); // Salva as tarefas do usuário no localStorage
      updateTaskCount();
    }
  }

  addTask(taskTitle, taskTags, taskDeadline) {
    const user = this.users.find(user => user.id === this.selectedUserId);
    if (user) {
      const newTask = {
        id: Math.floor(Math.random() * 9999999),
        description: taskTitle,
        tags: taskTags,
        deadline: taskDeadline,
        column: 1
      };
      user.tasks.push(newTask);
      this.renderTasks();
      this.saveTasksForUser(this.selectedUserId); // Salva após adicionar a tarefa
      updateTaskCount();
    }
  }

  updateTask(taskId, taskTitle, taskTags, taskDeadline) {
    const user = this.users.find(user => user.id === this.selectedUserId);
    if (user) {
      const index = user.tasks.findIndex(task => task.id == taskId);
      if (index === -1) {
        console.error("Erro: Tarefa não encontrada para atualização.");
        return;
      }

      const existingTask = user.tasks[index];
      const updatedTask = {
        id: existingTask.id,
        description: taskTitle,
        tags: taskTags,
        deadline: taskDeadline,
        column: existingTask.column
      };

      user.tasks[index] = updatedTask;
      this.renderTasks();
      this.saveTasksForUser(this.selectedUserId); // Salva após atualização
      updateTaskCount();
    }
  }
}

// Funções de Manipulação de Modal
function openModal() {
  $modal.style.display = 'flex';

  $creationModeTitle.style.display = 'block';
  $creationModeBtn.style.display = 'block';

  $editingModeTitle.style.display = 'none';
  $editingModeBtn.style.display = 'none';
}

function closeModal() {
  $modal.style.display = 'none';

  $idInput.value = '';
  $descriptionInput.value = '';
  $tagsInput.value = '';
  $deadlineInput.value = '';
}

function openModalToEdit(id) {
  $modal.style.display = "flex";
  
  $creationModeTitle.style.display = "none";
  $creationModeBtn.style.display = "none";
  
  $editingModeTitle.style.display = "block";
  $editingModeBtn.style.display = "block";
  
  const user = app.users.find(user => user.id === app.selectedUserId);
  if (user) {
    const task = user.tasks.find(task => task.id == id);
    if (task) {
      $idInput.value = task.id;
      $descriptionInput.value = task.description;
      $tagsInput.value = task.tags;
      $deadlineInput.value = task.deadline;
    }
  }
}

function createTask() {
  const taskTitle = $descriptionInput.value;
  const taskTags = $tagsInput.value;
  const taskDeadline = $deadlineInput.value;

  app.addTask(taskTitle, taskTags, taskDeadline);
  updateTaskCount(); // Atualiza a contagem após adicionar
  closeModal(); // Fecha o modal
}

function deleteTask(taskId) {
  const user = app.users.find(user => user.id === app.selectedUserId);
  if (user) {
    user.tasks = user.tasks.filter(task => task.id !== taskId);
    app.renderTasks();
    app.saveUsers(); // Salva após deletar
    updateTaskCount();
  }
}

function updateTask() {
  const taskId = $idInput.value;
  const taskTitle = $descriptionInput.value;
  const taskTags = $tagsInput.value;
  const taskDeadline = $deadlineInput.value;

  app.updateTask(taskId, taskTitle, taskTags, taskDeadline);
  updateTaskCount(); // Atualiza a contagem após edição
  closeModal(); // Fecha o modal
}

let selectedTag = 'all';

function filterTasks(tag) {
  // Alterna a tag selecionada entre 'all' e a tag clicada
  if (selectedTag === tag) {
    selectedTag = 'all'; // Se clicar na mesma tag novamente, volta para 'Todos'
  } else {
    selectedTag = tag;
  }

  renderFilteredTasks();

  updateTagStyles();
}

function updateTagStyles() {
  const tags = document.querySelectorAll('.tag');
  tags.forEach(tag => {
    tag.classList.remove('selected');

    // Verifica a tag atual e aplica a cor correta
    if (tag.textContent.trim() === 'Todos' && selectedTag === 'all') {
      tag.classList.add('selected');
      tag.style.backgroundColor = '#DE8200';
      tag.style.color = '#FFF';
    } else if (tag.textContent.trim().toLowerCase() === selectedTag) {
      tag.classList.add('selected');
      tag.style.backgroundColor = '#de9f47';
      tag.style.color = '#FFF';
    } else {
      // Reseta o estilo para as tags não selecionadas
      tag.style.backgroundColor = '#F5F5F5';
      tag.style.color = '#757575';
    }
  });
}

function renderFilteredTasks() {
  const user = app.users.find(user => user.id === app.selectedUserId);
  const taskListContainers = document.querySelectorAll('.cards_list');

  if (user) {
    taskListContainers.forEach(container => container.innerHTML = '');

    // Percorre as tarefas do usuário
    user.tasks.forEach(task => {
      if (selectedTag === 'all' || task.tags.includes(selectedTag)) {
        const formattedDate = moment(task.deadline).format('DD/MM/YYYY');
        const columnBody = document.querySelector(`[data-column="${task.column}"] .body .cards_list`);

        if (!columnBody) return;

        const card = `
          <div
            id="${task.id}"
            class="card"
            ondblclick="openModalToEdit(${task.id})"
            draggable="true"
            ondragstart="dragstart_handler(event)"
          >
            <div class="info">
              <b>Descrição:</b>
              <span>${task.description}</span>
            </div>
            <div class="info">
              <b>Assunto:</b>
              <span>${task.tags}</span>
            </div>
            <div class="info">
              <b>Prazo:</b>
              <span>${formattedDate}</span>
            </div>
            <button class="material-symbols-outlined" onclick="deleteTask(${task.id})">delete</button>
          </div>
        `;

        columnBody.insertAdjacentHTML('beforeend', card);
      }
    });

    updateTaskCount();
  }
}

// Funções de Drag and Drop
function dragstart_handler(ev) {
  ev.dataTransfer.setData("task_id", ev.target.id); // Armazena o ID da tarefa que está sendo arrastada
  ev.dataTransfer.effectAllowed = "move";
}

function dragover_handler(ev) {
  ev.preventDefault(); // Necessário para permitir o drop
  ev.dataTransfer.dropEffect = "move"; // Visualização do efeito de "movimento"
}

function drop_handler(ev) {
  ev.preventDefault();
  const task_id = ev.dataTransfer.getData("task_id"); // Recupera o ID da tarefa arrastada
  const columnElement = ev.target.closest(".column"); // Encontra a coluna onde o drop ocorreu

  if (columnElement) {
    const column_id = columnElement.getAttribute('data-column'); // Obtém o ID da coluna (1, 2 ou 3)
    changeColumn(task_id, column_id); // Muda a tarefa de coluna
  }
}

function changeColumn(task_id, column_id) {
  const user = app.users.find(user => user.id === app.selectedUserId);
  if (user) {
    user.tasks = user.tasks.map((task) => {
      if (task.id != task_id) return task;
      
      const updatedTask = {
        ...task,
        column: parseInt(column_id),
      };

      const cardElement = document.getElementById(task.id);
      if (cardElement) {
        cardElement.classList.remove('todo', 'in-progress', 'completed');

        switch (column_id) {
          case '1':
            cardElement.classList.add('todo');
            break;
          case '2':
            cardElement.classList.add('in-progress');
            break;
          case '3':
            cardElement.classList.add('completed');
            break;
        }
      }

      return updatedTask;
    });

    app.renderTasks();
    app.saveUsers(); // Salva após mudança de coluna
    updateTaskCount();
  }
}

// Atualização de Contagem de Tarefas
function updateTaskCount() {
  const columns = [1, 2, 3]; // IDs das colunas "To Do", "In Progress", e "Completed"

  columns.forEach(columnId => {
    const user = app.users.find(user => user.id === app.selectedUserId);
    if (!user) return;
    
    const count = user.tasks.filter(task => parseInt(task.column) === columnId).length;
    const columnHeader = document.querySelector(`[data-column="${columnId}"] .head span`);
    
    if (columnHeader) {
      columnHeader.innerText = `${columnHeader.innerText.split('(')[0].trim()} (${count})`;
    }
  });
}

// Certifique-se de que a variável `app` seja global
const app = new App();