import './reset.css';
import { ToDo } from './types';

const createButton = document.querySelector('#create') as HTMLButtonElement;
const deleteButton = document.querySelector('#delete') as HTMLButtonElement;
const titleInput = document.querySelector('#title') as HTMLInputElement;
const descriptionInput = document.querySelector(
  '#description',
) as HTMLInputElement;
const items = document.querySelector('#items') as HTMLUListElement;

createButton.addEventListener('click', async () => {
  let toDo: Partial<ToDo> = {
    title: titleInput.value || 'ToDo Title',
    description: descriptionInput.value || 'ToDo Description',
    complete: false,
  };

  const request = new Request('http://localhost:3000/todos', {
    method: 'POST',
    body: JSON.stringify(toDo),
  });

  const response = await fetch(request);
  if (!response.ok) {
    console.log('something went wrong creating todo');
    return;
  }

  const data = await response.json();
  console.log(data);

  loadToDos();
});

const toggleTodo = async (id: string, checked: boolean) => {
  const request = new Request(`http://localhost:3000/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ complete: !checked }),
  });

  const response = await fetch(request);

  if (!response.ok) {
    console.log('something went wrong patching todo ' + id);
    return;
  }

  const data: ToDo[] = await response.json();
  loadToDos();
};

const deleteTodo = async (id: string) => {
  const request = new Request(`http://localhost:3000/todos/${id}`, {
    method: 'DELETE',
  });

  const response = await fetch(request);

  if (!response.ok) {
    console.log('something went wrong deleting todo ' + id);
    return;
  }

  const data: ToDo[] = await response.json();
};

const loadToDos = async () => {
  const request = new Request('http://localhost:3000/todos', {
    method: 'GET',
  });

  items.replaceChildren();

  const response = await fetch(request);
  if (!response.ok) {
    console.log('something went wrong loading todos');
    return;
  }

  const data: ToDo[] = await response.json();

  data.forEach((todo) => {
    const li = document.createElement('li');
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.dataset['id'] = todo.id;
    check.checked = todo.complete;
    check.onclick = () => {
      toggleTodo(todo.id, todo.complete);
    };
    li.innerHTML = `
    <h2>${todo.title}</h2>
    <p>${todo.description}</p>
    `;
    li.prepend(check);
    items.appendChild(li);
  });
};

deleteButton.addEventListener('click', async () => {
  const checks = document.querySelectorAll<HTMLInputElement>('li input');
  const promises: Promise<void>[] = [];
  checks.forEach((check) => {
    if (check.checked) {
      promises.push(deleteTodo(check.dataset['id'] || ''));
    }
  });

  Promise.all(promises).then(() => {
    loadToDos();
  });
});

loadToDos();
