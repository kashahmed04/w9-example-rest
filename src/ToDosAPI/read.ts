import { ToDo } from './ToDo.type';

//we make a request and we do local host 3000 because thats where our json file is is it usually going to be there
//always for the typicode or in general for restful API's**
export const readToDos = async () => {
  //we get the current JSON file from the browser because we used typicode which is a JSON server that uses the JSON file
  //as the database so we can directly access the JSON information from the server instead of a specific file like db.JSON**
  //could we have also used db.JSON here for a request for all files where we use requests** (does this apply to all files that
  //have the request)**
  const request = new Request('http://localhost:3000/todos', { //if we want to get a specific entry we add the id here
    method: 'GET',
  });

  //await for the JSON data to get returned back (we need it to get the data)
  const response = await fetch(request);

  if (!response.ok) {
    console.log('something went wrong loading ToDos');
    // return an empty array when an error happens
    //when we get an empty array back here in terms of the loadtodos in main would there be no erros and nothing would display
    //on the browser then**
    return [];
  }

  //we turn an array of type todo which is an interface (why did we need an interface here)**
  //how does it put each entry into a seperate array in the JSON if we only decalre one array for everything that the response returns** 
  //how does the todo interface know what to make the ID and how long the ID is for a todo and change the completed to true or false**
  //can we edit description and title for a todo or once we make it then it stays that way (once we make it then it stays that way)**
  //why does ToDo show up in green here and not blue like when we imported it above**
  const data: ToDo[] = await response.json();
  //the response we get back is an array of todo items and its basically the todos JSON file and its an array of each todo object
  //this is promises so the response returns a promise so we need the response to get actual the JSON and not a promise

  // we actually return the data this time!
  // because the app will actually use it
  //does it matter if we call it app or browser or is it an app with restful API's**
  // (how will it use it)(do we use it when we go through everything in the array of todo in main
  // then repopulate the list of todos according
  //to our updates or changes we made to the todo list)**
  //how do we know when to return or not return data**
  return data;
};
