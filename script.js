const $modal = document.getElementById('modal');
const $descriptionInput = document.getElementById('description');
const $priorityInput = document.getElementById('priority');
const $deadlineInput = document.getElementById('deadline');

function openModal() {
  $modal.style.display = 'flex';
}

function closeModal() {
  $modal.style.display = 'none';
}

function createTask() {
  const description = $descriptionInput.value;
  const priority = $priorityInput.value;
  const deadline = $deadlineInput.value;

  if (description && priority && deadline) {
    const task = {
      description,
      priority,
      deadline,
    };

    // Aqui você pode adicionar a lógica para salvar a tarefa no banco de dados ou em algum lugar.
    // Por enquanto, vamos apenas exibir a tarefa na tela.
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.innerHTML = `
      <span>${task.description}</span>
      <span>${task.priority}</span>
      <span>${task.deadline}</span>
    `;

    const column = document.querySelector('.column.in-progress');
    column.appendChild(taskElement);

    // Limpar os campos após criar a tarefa
    $descriptionInput.value = '';
    $priorityInput.value = 'Baixa';
    $deadlineInput.value = '';
  }
}
