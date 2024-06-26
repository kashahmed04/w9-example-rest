import { ToDo } from './ToDo.type';

//here we change an existing entry but dont replace the whole entry we just change some fields**
//this is only when a checkbox is clicked on a todo item**
export const toggleToDo = async (id: string, checked: boolean) => {
  //partial means we are still using the keys from ToDo but by saying partial we are saying we dont need all 4 of them
  //and we can edit specific fields and dont have to use all the fields
  const alteredToDo: Partial<ToDo> = {
    complete: !checked,
  };

  //how does it know to update, or create, or delete if we dont specifically deal with entries from the JSON (does the method:
  //handle it for us how)**
  //is this the same for replace at a certain location we use method: PUT**
  //for read (GET) we dont have to worry about working with specific entries because we just are getting data back**
  //the GET says that we are reading data in so it automatically knows right**

  const request = new Request(`http://localhost:3000/todos/${id}`, {
    //why do we put the id here is it because we are getting a specific
    //entry whereas in read and create we are just getting everything (read) or creating something new (create)**
    //if we had to replace would we get the id as well to replace at that specific location**
    method: 'PATCH', //what does the method: do if we already work the JSON like intended (we would be visiting todos
    // API and tell the server what we want to do with the data)
    //so if we stringify here to get JSON into a string to send back why dont we do a parse to make it a JS object
    //to update and edit values**
    //how would we update values we changed then**
    //what does this do here with body: and what is altered todo and why is that only getting used and not the whole JSON**
    //do we usually stringify when we update and create only and not in delete or read** (what about when we want to replace an item
    //with another item completely instead of editing some fields (update) or creating a whole new copy (create))**
    //when we create it creates the item at the very bottom of the JSON usually and the JSON does not sort in a specific way right**
    body: JSON.stringify(alteredToDo),
    //we need to send data as a string for the object and we encode our changed value as a string and it sends it to the body
    //as a JSON string
    //the body is the data being sent from us (when we want to replce or edit or modify and it requires a body)
    //anytime we read or delete then we dont need a body because we read everything or we delete something
  });

  const response = await fetch(request);

  if (!response.ok) {
    console.log('something went wrong patching ToDo ' + id);
    return;
  }

  await response.json();
  //gives us back the decoded object (takes JSON and turns it into JS object by default)
  //we get updated values here

  //better to call loadtodos a lot to make sure we get fresh data

  // while response.json() does contain the updated ToDo
  // we're deliberately not returning any data here
  // because we've made the design choice to always reload all ToDos
  // it's enough to await the response, and then continue
  //go over (how does response.JSON not contain the updated todo list why do we get the JSON data then (from the browser since
  //its a JSON server right could we have also used db.JSON))**

  //we have to implement the put ourselves in class tomorrow right to replace an existing entry with a new entry at that same
  //exact location in the JSON (Ex. if we replace the second entry the new replaced entry should also be at the second entry
  //in the JSON as well as the browser when we call loadtodos again in main)**
};
