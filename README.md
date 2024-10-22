# Kanban Board - Trabalho Final

Este é o trabalho final da disciplina Front-End Dinâmico (JS DOM), ministrada pela **Ada Tech** e orientada pelo professor [Palmer Oliveira](https://github.com/expalmer) como parte do programa **Santander Coders 2024.1**. Desenvolvemos um **Kanban Board** utilizando HTML, CSS e JavaScript. O projeto implementa funcionalidades de organização de tarefas através de um quadro com colunas de "A fazer", "Em progresso" e "Concluído", com suporte a múltiplos usuários, tags para categorização, movimentação de cards e filtros.

## Funcionalidades

### Colunas
- **A fazer, Em progresso, Concluído:** O Kanban contém 3 colunas, representando o status das tarefas:
  - **A fazer:** Tarefas que precisam ser iniciadas.
  - **Em progresso:** Tarefas em andamento.
  - **Concluído:** Tarefas concluídas.
- Cada coluna mostra o título, o total de cards (tarefas) e os cards associados a ela.

### Usuários
- Exibe **4 usuários** alimentados por uma API externa (API JSON Placeholder).
- Cada usuário possui **id, nome** e uma **imagem de perfil**.
- Um usuário é sempre **selecionado por padrão** ao carregar o Kanban.
- É possível **alternar entre os usuários**, e ao fazer isso, o quadro mostrará os cards atribuídos ao usuário selecionado.

### Tags
- O projeto permite categorizar os cards usando **3 tags**:
  - `Frontend`
  - `Backend`
  - `UX`
- As tags são usadas para **criação e filtragem** dos cards.

### Cards
- Cada card tem os seguintes atributos:
  - **Descrição:** O que a tarefa requer.
  - **Tag:** A categoria (Frontend, Backend, UX).
  - **Prazo:** Data final para finalização da atividade.
- Funcionalidades dos cards:
  - **Criar cards**: Cards são criados sempre na coluna "A fazer" e associados a um usuário e uma tag.
  - **Editar cards**: É possível alterar a descrição (duplo clique) e a tag de um card.
  - **Mover cards**: Arraste e solte os cards para movê-los entre as colunas.
  - **Remover cards**: Cards podem ser excluídos individualmente.

### Filtros
- **Filtro por Usuário:** É possível selecionar um usuário e ver os cards que pertencem a ele.
- **Filtro por Tag:** Filtre os cards por tag (Frontend, Backend, UX).
- **Comportamento do filtro:**
  - Ao selecionar um **usuário** e/ou uma **tag**, o quadro mostra apenas os cards que atendem aos critérios de filtro.
  - **Toggle:** A seleção das tags funciona como um toggle (ativar/desativar).
  
### Salvamento
- O estado do quadro é **persistido no LocalStorage**, garantindo que as informações sejam mantidas ao atualizar ou fechar a página.
  - **Cards são salvos no LocalStorage.**
  - **Usuário selecionado é salvo no LocalStorage.**
  - **Filtros selecionados também são salvos no LocalStorage.**

## Tecnologias Utilizadas
- **HTML5**: Estruturação da página.
- **CSS3**: Estilização do Kanban, dos cards e dos filtros.
- **JavaScript**: Lógica do projeto, manipulação dos cards, filtros, movimentação dos cards e interação com o LocalStorage.
- **API JSON Placeholder**: Para obtenção de usuários fictícios.

## Como Rodar o Projeto

1. **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/kanban-board.git
    ```

2. **Abra o arquivo `index.html` no seu navegador:** 
   Você pode simplesmente clicar duas vezes no arquivo ou usar uma extensão de servidor local, como **Live Server** no Visual Studio Code, para uma experiência mais completa.

## Membros da Equipe
- [Julianna Alencar](https://github.com/juliannalencar)
- [Isabela Ivanoff](https://github.com/isaivanoff)
- [Carol Malveira](https://github.com/carolmalveiraa)
