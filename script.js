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

var taskList = [];

// Função para abrir o modal no modo de criação de tarefa
function openModal() {
  $modal.style.display = 'flex';

  // Mostra os elementos do modo de criação
  $creationModeTitle.style.display = 'block';
  $creationModeBtn.style.display = 'block';

  // Oculta os elementos do modo de edição
  $editingModeTitle.style.display = 'none';
  $editingModeBtn.style.display = 'none';
}

// Função para abrir o modal no modo de edição de uma tarefa existente
function openModalToEdit(id) {
  $modal.style.display = "flex";
  
  $creationModeTitle.style.display = "none";
  $creationModeBtn.style.display = "none";
  
  $editingModeTitle.style.display = "block";
  $editingModeBtn.style.display = "block";
  
  const index = taskList.findIndex(function(task) {
    return task.id == id;
  });
  
  const task = taskList[index];

  $idInput.value = task.id;
  $descriptionInput.value = task.description;
  $tagsInput.value = task.tags;
  $deadlineInput.value = task.deadline;
}

// Função para fechar o modal e limpar os inputs
function closeModal() {
  $modal.style.display = 'none';

  // Limpa todos os campos do modal
  $idInput.value = '';
  $descriptionInput.value = '';
  $tagsInput.value = '';
  $deadlineInput.value = '';
}

// Função para resetar todas as colunas, removendo todos os cartões
function resetColumns() {
  document.querySelectorAll('.cards_list').forEach(column => {
    column.innerHTML = '';
  });
}

// Função para gerar os cartões de tarefa dinamicamente
function generateCards() {
  resetColumns(); // Limpa todas as colunas antes de adicionar novos cartões
  console.log("Gerando cartões para tarefas:", taskList); // Log para verificar a lista de tarefas

  taskList.forEach(function(task) {
      if (selectedTag !== 'all' && task.tags !== selectedTag) {
          return;
      }

      const formattedDate = moment(task.deadline).format('DD/MM/YYYY');

      // Seleciona o corpo da coluna correta com base na coluna da tarefa
      const columnBody = document.querySelector(`[data-column="${task.column}"] .body .cards_list`);
      
      if (!columnBody) {
          console.error("Erro: coluna não encontrada.");
          return;
      }

    // Cria o HTML do cartão da tarefa
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

    console.log("Adicionando cartão:", card); // Verifica o HTML do cartão que está sendo adicionado
    columnBody.innerHTML += card; // Adiciona o cartão à coluna correspondente
  });

  // Atualiza a contagem de tarefas em cada coluna após gerar os cartões
  updateTaskCount();
}

// Função para criar uma nova tarefa
function createTask() {
  const newTask = {
    id: Math.floor(Math.random() * 9999999), // Gera um ID único aleatório para a tarefa
    description: $descriptionInput.value,
    tags: $tagsInput.value,
    deadline: $deadlineInput.value,
    column: 1, // Define sempre a coluna como "To Do" (coluna 1)
  }

  console.log("Nova tarefa criada:", newTask); // Log para verificação

  taskList.push(newTask); // Adiciona a nova tarefa à lista de tarefas

  closeModal(); // Fecha o modal
  generateCards(); // Atualiza os cartões exibidos nas colunas
}

// Função para deletar uma tarefa
function deleteTask(taskId) {
  // Remove a tarefa da lista pelo ID
  taskList = taskList.filter(task => task.id !== taskId);
  // Atualiza a interface para remover o card
  generateCards();
}

// Função para atualizar uma tarefa existente
function updateTask() {
  // Encontra a tarefa original para obter a coluna atual
  const index = taskList.findIndex(function(task) {
    return task.id == $idInput.value;
  });

  if (index === -1) {
    console.error("Erro: Tarefa não encontrada para atualização.");
    return;
  }

  // Mantém a coluna existente da tarefa
  const existingTask = taskList[index];
  const updatedTask = {
    id: existingTask.id,
    description: $descriptionInput.value,
    tags: $tagsInput.value,
    deadline: $deadlineInput.value,
    column: existingTask.column, // Mantém a coluna atual da tarefa
  };

  // Atualiza a tarefa na lista
  taskList[index] = updatedTask;

  closeModal(); // Fecha o modal
  generateCards(); // Atualiza os cartões exibidos nas colunas
}

// Função para mover uma tarefa para outra coluna após arrastar e soltar
function changeColumn(task_id, column_id) {
  if (task_id && column_id) {
    taskList = taskList.map((task) => {
      if (task_id != task.id) return task;
  
      return {
        ...task,
        column: column_id,
      };
    });
  }
  generateCards();
}

// Função para lidar com o evento de início de arrastar
function dragstart_handler(ev) {
  console.log(ev);
  // Add the target element's id to the data transfer object
  ev.dataTransfer.setData("my_custom_data", ev.target.id);
  ev.dataTransfer.effectAllowed = "move";
}

// Função para permitir que um elemento seja arrastado para uma área de soltura
function dragover_handler(ev) {
  ev.preventDefault();
  ev.dataTransfer.dropEffect = "move";
}

// Função para lidar com o evento de soltar o cartão em uma nova coluna
function drop_handler(ev) {
  ev.preventDefault();
  const task_id = ev.dataTransfer.getData("my_custom_data");
  const columnElement = ev.target.closest(".column"); // Encontra a coluna mais próxima
  const column_id = columnElement ? columnElement.dataset.column : null;
  
  if (column_id) {
    console.log("Tarefa movida:", task_id, "para coluna:", column_id); // Log para verificação
    changeColumn(task_id, column_id);
  } else {
    console.error("Erro: Coluna de destino não encontrada.");
  }
}

// Função para atualizar a contagem de tarefas em cada coluna
function updateTaskCount() {
  const columns = [1, 2, 3]; // IDs das colunas "To Do", "In Progress", e "Completed"

  columns.forEach(columnId => {
    const count = taskList.filter(task => task.column == columnId).length;
    const columnHeader = document.querySelector(`[data-column="${columnId}"] .head span`);
    
    if (columnHeader) {
      columnHeader.innerText = `${columnHeader.innerText.split('(')[0].trim()} (${count})`;
    }
  });
}

let selectedTag = 'all';

// Função para filtrar as tarefas com base na tag selecionada
function filterTasks(tag) {
    selectedTag = tag;

    // Adiciona/remove a classe 'selected' para as tags
    document.querySelectorAll('.tag').forEach((element) => {
        element.classList.remove('selected');
        if (element.textContent.toLowerCase() === tag) {
            element.classList.add('selected');
        }
    });

    generateCards();
}
