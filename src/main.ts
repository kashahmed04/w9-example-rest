import './reset.css';
import './styles.css';

import { ToDo } from './ToDosAPI/ToDo.type';
import { ToDosAPI } from './ToDosAPI'; // when no filename is specified, import from "index.ts"

// select references to DOM elements
const addButton = document.querySelector('#add') as HTMLButtonElement;
const createDialog = document.querySelector(
  '#createDialog',
) as HTMLDialogElement;
const createButton = document.querySelector('#create') as HTMLButtonElement;
const deleteButton = document.querySelector('#delete') as HTMLButtonElement;
const titleInput = document.querySelector('#title') as HTMLInputElement;
const descriptionInput = document.querySelector(
  '#description',
) as HTMLInputElement;
const todoList = document.querySelector('#todoList') as HTMLUListElement;

addButton.addEventListener('click', () => {
  // clear out any previous entry
  titleInput.value = '';
  descriptionInput.value = '';
  // and show the dialog
  createDialog.showModal();
});

// loadToDos : reads all ToDos and displays them in the DOM
const loadToDos = async () => {
  // fetch the data
  const data = await ToDosAPI.read();

  // clear the list**
  todoList.replaceChildren();

  let hasSomeCompleted = false; //what does this do**

  // repopulate the list
  data.forEach((todo) => {
    // create <li> parent
    const li = document.createElement('li');

    // create <input> checkbox
    //we create the input element for each time we add a new todo**
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.dataset['id'] = todo.id; // write the todo.id as data-id="" on the <input>
    check.checked = todo.complete;
    check.onclick = async () => {
      // when clicking the checbox, toggle its status
      await ToDosAPI.update.toggle(todo.id, todo.complete);
      // and reload all ToDos
      loadToDos();
    };

    // remaining children
    li.innerHTML = `
    <div>
    <h2>${todo.title}</h2>
    <p>${todo.description}</p>
    </div>
    `;

    // put the checkbox first/before the <h2>/<p> children
    li.prepend(check);

    // add the <li> to the parent <ul>
    todoList.appendChild(li);

    if (todo.complete) {
      hasSomeCompleted = true;
    }
  });

  if (hasSomeCompleted) {
    deleteButton.classList.remove('hide');
  } else {
    deleteButton.classList.add('hide');
  }
};

createButton.addEventListener('click', async () => {
  // create a ToDo object with info from the DOM
  // (we use Omit<ToDo, 'id'> here because we want to be type-safe, but we don't know what the id is)
  //  https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys
  let freshToDo: Omit<ToDo, 'id'> = {
    title: titleInput.value || 'ToDo Title',
    description: descriptionInput.value || 'ToDo Description',
    complete: false,
  };

  // send that freshToDo to the API for creation
  await ToDosAPI.create(freshToDo);

  // then reload all ToDos
  loadToDos();
});

deleteButton.addEventListener('click', async () => {
  // get ALL the checkboxes
  // (we're making the assumption that the only input in the <li> is a checkbox <input>)
  const checks = document.querySelectorAll<HTMLInputElement>('li input');

  // we need to track all calls to ToDosAPI.delete (so we know when they're all done)
  const deleteCalls: Promise<void>[] = [];

  checks.forEach((check) => {
    if (check.checked) {
      // if the ToDo is completed (flagged for delete)
      // delete it! and keep track of the request in the deleteCalls array
      deleteCalls.push(ToDosAPI.delete(check.dataset['id'] || ''));
    }
  });

  // Promise.all waits until all deleteCalls have resolved/rejected, and then calls its .then() callback
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
  Promise.all(deleteCalls).then(() => {
    // all the deletes are done, reload all ToDos.
    loadToDos();
  });
});

// in the beginning, load all ToDos!
loadToDos();


/**
 * NEW NOTES:
 * 
 * CRUD is common to a bunch of web applications we use everyday (does this refer to social media and us doing this with posts or renting something for example)**
 * we can create and update our posts and read it and delete it (all of these things in posts for social media can happen)**
 * 
 * we can create an enititiy and read the informaton for the specific or all entries and update or delete the specific data within our posts or the API
 * are these usually arrays that we use the CRUD for (or is it the restful API we use CRUD for only)**
 * 
 * REST
 * 
 * RES is the state of our application and what entities exist and their details (the sever maintaing the data within it)(does this also mean
 * when it maintains the data within the server it then it also updates or adjusts based on we put/delete/edit/get or is that 
 * more of the transfer aspect)** (slide 5)**
 * (when it says the server will respond
 * with a representation of the state of an enitity is this when we also ask for the data (all or specific)** or is it more of the transfer aspect)(slide 6)**
 * does this also refer to when we want to put/delete/edit/get the server will respond
 * with a representation of the state of an enitity**
 * 
 * for the RES part is the data in the server usually going to be a JSON file or an array only or an array within the JSON for each entry (each entry
 * would be an array of data in the JSON)**
 * 
 * why is it when I type the screen moves up a bit in visual studio**
 * 
 * the transfer aspect is it sends us information from API when we request it so we can get the information and change it and work with data 
 * returned if needed (like using get, post, put, delete, and patch)**
 * 
 * Roy came up with REST API and everyone adopted it as framework**
 * putting it together REST is arhcitectural pattern** (with get,post,put,delete,and patch) (what about update
 * or is that CRUD??))** for performing CRUD operations** (read,create,update,delete) (slide 7)**
 * 
 * so restful API's are API's that follow the rest patterns like shown on slide 9-11 (common way to access data when working with all restful API's)**
 * (we know how to access the data already since restful API's have the same way to work with data like slide 9-11)**
 * 
 * REST API:
 * we can use get,post,put,patch,delete,etc.
 * when we get things we read them (single item or the whole array??)**
 * when we post we send a single entry of** information (to the last index in array within JSON or last area??)** (is this arrays within a JSON
 *  for the data usually for RESTFUL APIS??)**
 * when we patch we modify or update a single entry in the JSON usually or whole JSON** (how does it know what to specifically update or modify in book 1)**
 * and for put we replace a single entry (or whole JSON)** (how does it know what to replace book 1 with if we just say book at id 1 for put)**
 * does put replace the whole array within the JSON (if we change only the fields and not the whole book entry then its patch)??**
 * and delete is to delete things
 * (all above slide 9)**
 * 
 * when we say get /books give us list (or all the array entries for books within JSON??)** of all books in applciation (slide 9)**
 * when we post books we create a book and we create a new entry for the book and the * represents sending data to API rather than reading 
 * (is that what it means by "these send a request body with data")(slide 9)**
 * get books 1 means we get the book at location 1 (the entry is an array within the JSON?)** (slide 9)**
 * by putting we are replacing the book at id 1 and we put a new book in its place (how would we do that if we only do put /books/1 
 * and not put in another entry to replace it)(slide 9)**
 * patch is modifying a little bit whats already there and not putting a complete new book there (how would we do that if we only do put /books/1 
 * and not put in things to edit the book 1)(slide 9)**
 * delete says to go to books 1 and delete that book (and eveyrthing else (the arrays of each book)** moves up 1 place for the empty spot in the JSON
 * usually when we delete??)**(slide 9)**
 * can we use delete to delete the arrays of books within the JSON (everything inside of it)** or is it only 1 entry for delete** (slide 9)**
 * 
 * can we use post, put, and patch to apply to the whole JSON instead of the specific book entry to modify the whole JSON** (slide 9)**
 * 
 * if we have todos list its the same approach or with customers and so much of what we do on the web is CRUD and RESTFUL APIS so there is 
 * a common starrting point and knowing how to access data**
 * 
 * when we have /customers/1/orders and it says we have a list (1 array in JSON for each customer??)**
 * of customers and we get the first customer and their list of orders and we can
 * go farther and say /customers/1/orders/1 to get the first item the first customer ordered for get** (nesting on slide 12)**
 * how do we know when the put the "/" before something for restful API's like we do before customer because we are using 1 JSON file so why so
 * many "/" for folders** (slide 9-12)**
 * 
 * typicode uses a JSON file as a database locally and lets us have RESTFUL purposes and its a develeopment tool for prototyping 
 * and not in everyday use because** (slide 13)** (this creates the JSON server to run locally for us in our browser??)**
 * since JSON server     we use vite to    ** (slide 13)** so
 * concurrenly lets us use vite server and JSON server at the same time in the same vite command terminal window and we can close all at once with control c
 * instead of multiple commands to close the two processes at once since its only 1 command to turn on the vite server and JSON server at the same time**
 * 
 * CODE:
 * 
 * we have a todo application to add something and we can create a todo list and check it off as well as have defaults and check off
 * some items and delete them and we can also reload the application and the state remains the same**
 * 
 * db.json is where everything and all of our changes get written to (when we add something or remove something it reads and writes
 * from the db.json file)
 * we made a get request to todos which is the reference to db.json and when we post something to create an item a GET is made
 * to update the json automatically??**
 * when we check off something the complete field is true otherwise its false in db.json 
 * when we delete things is shows each item we deleted seperately then makes a GET request again to update db.json**
 * 
 * does GET always run after action to update db.json**
 * 
 * HTML:
 * 
 * <dialoge> gives us some sort of box (like a popup box that floats and we can put things in that box)
 * and it has a .showmodal() and close() method and by default we cant click anything else when
 * we are in the popup box and press escape to exit the box (for free with <dialoge>)
 * 
 * main.TS:
 * 
 * the todos API we import the whole folder and by default it references the index.ts if we dont specify the folder**
 * we do await.todos.read() to**
 * 
 * we refernce things in the HTML
 * the omit class in TS does    and we dont put an ID so a random one gets created for us when we add something to the list**
 * we assume the input in the list are all checkboxes for the queryselector for the li input and if not we would**
 * 
 * we push our deleted data into our deleted array because**
 * we use promise.all to say wait until all the delete calls have finished then do something and once all delete calls are finished
 * then we do our todos and the todos call on the bottom is the intial call to start the method the first time**
 * 
 * main.ts is a manager to hook up buttons with API 
 * 
 * read.ts:
 * we make a request and we do local host 3000 because thats where our json file is**
 * our rrad operation happens when we load todos  (const data = await ToDosAPI.read();)
 * 
 * create.ts:
 * json.stringify turns a JSON object into a string and we use it to send to the server and the json.parse is used to 
 * use that string we get from server in code**
 * we dont return any data because we reload all the todos and we have awaite todoasapi.create(freshtodos) then we 
 * load the totods()
 * 
 * update.ts:
 * we give it an id and if it was checked and partial is like a todo but it only has some fields and**
 * we have the link be the todos with the id so we know which id to patch and we stringify the altered todo then
 * make it as a string to show up in the server
 * 
 * delete.ts we give it the id we are deleting and we delete it 
 * 
 * we have todos in db.json and if we add customers array and it will make the endpoint for us and we can just use it from there**
 * and when we type it in the browser it gives us an empty array**
 * 
 * 
 * representiational maintains the server and the transfer is us when we want to access or edit values from within the server 
 * 
 */