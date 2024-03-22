import './reset.css';
import './styles.css';

//what exactly are we importing here for both statements and what do they do**
import { ToDo } from './ToDosAPI/ToDo.type'; //can do comma seperated list of things we want to import (but the thing in the file
//has to have an export to have an import)
import { ToDosAPI } from './ToDosAPI'; // when no filename is specified, import from "index.ts" 
//name exports in the {} have to be the exact name of the export

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
  //cant press ourside the popup box and have to press escape to exit or fill in an entry**
  //when we do just .show() why does it not show a popup I thought it would show a popup still and we can click outside of it
  //to add multiple entries at once for example or exit the popup when we clicked outside of it**
  createDialog.showModal();
});

//how does everything remain on the page still when we refresh and how does it not reset everything (all the changes we had made)
//when we call the loadtodos initially then it loads everything so no information is lost

// loadToDos : reads all ToDos and displays them in the DOM
//are all the todos items 
//in the db.JSON and we access that information from our todosAPI files we made ourselves 
//in the src (create, delete, index, read, todotype, update) to access the data directly in the db.JSON which is our own created API**
//the main.ts calls all these files mentioned above to use the API we made based on user input like clicking or entering information
//(main calls these methods mentioned above so those methods can directly interact with the API when we call them from main
//to update the API we made)**

//how does the async work again**
//await means to wait until all the data is read from the index.ts which has to ToDosAPI and we specifically wait for the 
//read file which reads all the data currently in the API**

//the async keyword is a decorator for function and we say this returns a promise and we have to decalre an async to use the
//await inside of it
const loadToDos = async () => {
  // fetch the data
  const data = await ToDosAPI.read(); //returns a promise (pause execution of program until read comes back then do the rest of the code)
  //when it returns a promise it means to pause the program and do this first then run rest of program****

  // clear the list (what does replace children do could we just have changed the innertext to nothing or innerHTML to nothing)(yes)
  todoList.replaceChildren();

  let hasSomeCompleted = false; //initially set the checked as false

  // repopulate the list
  data.forEach((todo) => {
    // create <li> parent
    //this is for each inidividual item in the ToDo array (each todo item in the todo list is 1 entry in the array) we made in read right**
    const li = document.createElement('li');

    // create <input> checkbox
    //we create the input element which is a checkbox for each element in the todo array (each toto item)**
    const check = document.createElement('input');
    //is there no checkbox element so first we have to create an input element then make it of type checkbox (same in HTML if we
    //had to do it in HTML)**
    check.type = 'checkbox';
    //so here for each todo item we are creating an ID on that input element which is the ID from the specific todo item**
    //is this how we create ID's on elements in JS usually by doing element name (or element variable)['id'] = some id as a string**
    //ID's have to be a string always right**
    check.dataset['id'] = todo.id; // write the todo.id as data-id="" on the <input>
    //so when we say dataset it gives us a data-id = "some id we put as a string" right**
    //in JS**

    //when we read from API the db.json creates the id and todo.id gives us that id and we save the id as an attribute on the element itself
    //and it makes it availible us to read it in the delete function (dataset gives us an attrituve for an element with the
    //data- and we could say ['class'] to make a class within an element)

    //so if the complete is true for the specific todo item in the array check the checkbox for that specific todo item**
    //if its not complete then dont check it and leave it as is**
    check.checked = todo.complete;
    //what does async do here**
    check.onclick = async () => {
      // when clicking the checbox, toggle its status
      //go to index.ts then the update method then the toggle does**
      //and we pass in these two elements into the todosAPI which then passes it to the update file**
      //could we have done this without an index.ts and pass it straight to update**
      //go over****
      await ToDosAPI.update.toggle(todo.id, todo.complete);
      // and reload all ToDos
      //we reload after a click event because we changed something right so the list needs to refresh to view the changes (if we 
      //checked something)**
      //if the response.JSON in the update does not contain the updated todo then how does it know to check and not check
      //things once we click a todo box and refresh**
      loadToDos();
    };

    // remaining children
    //for the current todo item we are on in the array of todos returned from the read file,
    //we put the title and description of the item in the list**
    li.innerHTML = `
    <div>
    <h2>${todo.title}</h2>
    <p>${todo.description}</p>
    </div>
    `;

    // put the checkbox first/before the <h2>/<p> children
    //could we have just put this before the statement that puts the things in the list innerHTML then it would show up
    //in the beggining of the list item**
    //if we do append above the innerHTML then when we do the innerHTML it basically erases that data
    li.prepend(check);

    // add the <li> to the parent <ul>
    //append the current list item that is all updated into the todo list to show on the browser**
    todoList.appendChild(li);

    //if the specific item in the array of todo from read is checked (the complete variable is true) then
    //make the variable set to true since its checked**
    if (todo.complete) {
      hasSomeCompleted = true;
    }
  });

  //what exactly puts the data on the page when we add or remove something like we see it was it the CSS****

  //if at least one item is checked make the delete button show in the brwoser otherwise hide it**
  //the .remove('hide') shows the delete button because it was initially hidden in the HTML if at least 1 item is checked**
  //the .add('hide') puts the hide back on for the delete button and does not make it show if nothing is checked off in the todo list**
  if (hasSomeCompleted) {
    deleteButton.classList.remove('hide'); //add the class list hide or remove it (removes the hide class name to make it show up
    // or add it back to hide it)
  } else {
    deleteButton.classList.add('hide');
  }
};

//we never say .close() so how does it close the modal**

// how do we know when to use async and why do we use it in the create button and delete button**
createButton.addEventListener('click', async () => {
  // create a ToDo object with info from the DOM
  // (we use Omit<ToDo, 'id'> here because we want to be type-safe, but we don't know what the id is)
  //what does this mean**
  //  https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys
  let freshToDo: Omit<ToDo, 'id'> = {
    title: titleInput.value || 'ToDo Title',
    description: descriptionInput.value || 'ToDo Description',
    complete: false,
  };
  //above we create a new entry in the JSON (or the todo array not in the JSON)** and make the checked false
  //because its not checked**

  // send that freshToDo to the API for creation

  //we first send this to the index.ts which has to todosAPI then it sends the information to the create file****
  await ToDosAPI.create(freshToDo);

  // then reload all ToDos
  loadToDos();
});

deleteButton.addEventListener('click', async () => {
  // get ALL the checkboxes
  // (we're making the assumption that the only input in the <li> is a checkbox <input>)
  //if the input was checkboxes and something else what would we do**
  //this gives us an array of all the checked list items**
  //here we are saying from the list give us the input (checkbox) specifically since we appended it to the list in loadtodos**
  const checks = document.querySelectorAll<HTMLInputElement>('li input');

  // we need to track all calls to ToDosAPI.delete (so we know when they're all done)
  //go over**
  const deleteCalls: Promise<void>[] = [];

  //why do we have an array for the delete calls**
  checks.forEach((check) => {
    if (check.checked) {
      // if the ToDo is completed (flagged for delete)
      // delete it! and keep track of the request in the deleteCalls array
      //go over (why would we put an empty string because wouldnt it have an ID if its checked and in the list of todos**
      deleteCalls.push(ToDosAPI.delete(check.dataset['id'] || ''));
    }
  });

  // Promise.all waits until all deleteCalls have resolved/rejected, and then calls its .then() callback
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all
  //this makes sure everything in the array is taken care of then reloads the todo list in the brwoser (not JSON because its done
  //in the delte method right)**
  //does it delete the entries from the array as the problems get resolved and does the promise.all() have to take an array usually**
  //it only accepts an array of promises though right and it always has a .then after right**
  Promise.all(deleteCalls).then(() => {
    // all the deletes are done, reload all ToDos.
    loadToDos();
  });
});

// in the beginning, load all ToDos!
//call this initially to load everything in**
loadToDos();


/**
 * NEW NOTES:
 * 
 * we have todos in db.json and if we add customers array and it will make the endpoint for us and we can just use it from there**
 * and when we type it in the browser it gives us an empty array**
 * 
 * CRUD is common to a bunch of web applications we use everyday (does this refer to social media and us doing this with posts or renting something for example)**
 * we can create and update our posts and read it and delete it (all of these things in posts for social media can happen)**
 * 
 * we can create an enititiy and read the informaton for the specific or all entries and update or delete the specific data within our posts or the API
 * are these usually arrays that we use the CRUD for (or is it the restful API we use CRUD for only)**
 * 
 * for the read part is there a situation where we would want to read only one piece of data because in our code
 * we usually read the whole JSON in loadtodos to reload all the JSON information in the browser**
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
 * typicode uses a JSON file as a database (restful server)** locally and lets us have RESTFUL purposes and its a 
 * develeopment tool for prototyping and not in everyday use because** (slide 13)** 
 * (this creates the JSON server to run locally for us in our browser??)**
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
 * we make a request and we do local host 3000 because thats where our json file is is it usually going to be there
 * always for the typicode or in general for restful API's**
 * our read operation happens when we load todos  (const data = await ToDosAPI.read();)
 * 
 * create.ts:
 * json.stringify turns a JSON object into a string and we use it to send to the server and the json.parse is used to 
 * use that string we get from server in code as a JS object**
 * we dont return any data because we reload all the todos and we have awaite todoasapi.create(freshtodos) then we 
 * load the totods()
 * we usually do JSON.stringify() to put data into the server as a string and we do JSON.parse() when we get data to work with it as 
 * a JS object**
 * 
 * update.ts:
 * we give it an id and if it was checked and partial is like a todo but it only has some fields and**
 * we have the link be the todos with the id so we know which id to patch and we stringify the altered todo then
 * make it as a string to show up in the server
 * 
 * delete.ts we give it the id we are deleting and we delete it 
 * 
 * 
 * 
 * representiational maintains the server and the transfer is us when we want to access or edit values from within the server 
 * 
 */