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

// Corrigido: Variável removida pois não é usada
// var taskList = [];

//usuários
class App {
  constructor() {
    this.$users = document.querySelector('#users');
    this.selectedUserId = null; // Armazena o ID do usuário selecionado
    this.users = []; // Inicializa a lista de usuários
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
            tasks: []
        }));

        // Define um usuário padrão como selecionado
        this.selectedUserId = this.users[0].id; 
        this.renderUsers();
        this.renderTasks();
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
    }
  }

  renderUsers() {
    const userListContainer = document.getElementById('user-list'); // Certifique-se de ter um elemento com este ID no seu HTML

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
            this.renderUsers();
            this.renderTasks();
        });
    });
  }

  renderTasks() {
    const user = this.users.find(user => user.id === this.selectedUserId);
    const taskListContainer = document.querySelector('.cards_list'); // Certifique-se de ter um elemento com esta classe no seu HTML

    if (user) {
      const tasksHtml = user.tasks
        .filter(task => selectedTag === 'all' || task.tags === selectedTag)
        .map(task => {
          const formattedDate = moment(task.deadline).format('DD/MM/YYYY');
          return `
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
        })
        .join('');
      taskListContainer.innerHTML = tasksHtml; // Removido a tag ul desnecessária
    }
  }

  addTask(taskTitle, taskTags, taskDeadline) {
    const user = this.users.find(user => user.id === this.selectedUserId);
    if (user) {
      const newTask = {
        id: Math.floor(Math.random() * 9999999), // Gera um ID único aleatório para a tarefa
        description: taskTitle,
        tags: taskTags,
        deadline: taskDeadline,
        column: 1 // Define sempre a coluna como "To Do" (coluna 1)
      };
      user.tasks.push(newTask);
      this.renderTasks();
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
        column: existingTask.column // Mantém a coluna atual da tarefa
      };

      user.tasks[index] = updatedTask;
      this.renderTasks();
    }
  }
}

function openModal() {
  $modal.style.display = 'flex';

  // Mostra os elementos do modo de criação
  $creationModeTitle.style.display = 'block';
  $creationModeBtn.style.display = 'block';

  // Oculta os elementos do modo de edição
  $editingModeTitle.style.display = 'none';
  $editingModeBtn.style.display = 'none';
}

function closeModal() {
  $modal.style.display = 'none';

  // Limpa todos os campos do modal
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

  closeModal(); // Fecha o modal
}

function deleteTask(taskId) {
  const user = app.users.find(user => user.id === app.selectedUserId);
  if (user) {
    user.tasks = user.tasks.filter(task => task.id !== taskId);
    app.renderTasks();
  }
}

function updateTask() {
  const taskId = $idInput.value;
  const taskTitle = $descriptionInput.value;
  const taskTags = $tagsInput.value;
  const taskDeadline = $deadlineInput.value;

  app.updateTask(taskId, taskTitle, taskTags, taskDeadline);

  closeModal(); // Fecha o modal
}

function changeColumn(task_id, column_id) {
  const user = app.users.find(user => user.id === app.selectedUserId);
  if (user) {
    user.tasks = user.tasks.map((task) => {
      if (task_id != task.id) return task;
  
      return {
        ...task,
        column: column_id,
      };
    });
    app.renderTasks();
  }
}

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
      
      // Muda a coluna da tarefa
      return {
        ...task,
        column: column_id,
      };
    });
    app.renderTasks(); // Re-renderiza as tarefas para atualizar a interface
  }
}


function updateTaskCount() {
  const columns = [1, 2, 3]; // IDs das colunas "To Do", "In Progress", e "Completed"

  columns.forEach(columnId => {
    const count = app.users
      .find(user => user.id === app.selectedUserId)
      .tasks.filter(task => task.column == columnId).length;
    const columnHeader = document.querySelector(`[data-column="${columnId}"] .head span`);
    
    if (columnHeader) {
      columnHeader.innerText = `${columnHeader.innerText.split('(')[0].trim()} (${count})`;
    }
  });
}

let selectedTag = 'all';

function filterTasks(tag) {
  selectedTag = tag;

  // Adiciona/remove a classe 'selected' para as tags
  document.querySelectorAll('.tag').forEach((element) => {
    element.classList.remove('selected');
    if (element.textContent.toLowerCase() === tag) {
      element.classList.add('selected');
    }
  });

  app.renderTasks();
}

// Certifique-se de que a variável `app` seja global
const app = new App();
