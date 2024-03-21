import { ToDo } from './ToDo.type';
//we import todo in the files where we want to get data back, change current data, replace data entry completely, or create new data
// in the JSON which provides all the information in the interface format
//in the todo type file**
//we dont do this in delete though right**
export const createToDo = async (freshToDo: Omit<ToDo, 'id'>) => {
  const request = new Request('http://localhost:3000/todos', {
    method: 'POST',
    //when do we usually use stringify for restful API's and why do we not parse to work with the data
    //because its a string when we get the JSON right and we have to turn it back to a string to give back to the JSON right
    //so how do we edit the data within the JSON if we never parse**
    body: JSON.stringify(freshToDo),
  });

  const response = await fetch(request);

  if (!response.ok) {
    console.log('something went wrong creating ToDo');
    return;
  }

  await response.json();

  // while response.json() does contain the newly created ToDo
  // I thought response.JSON would have had the updated value why does it not**
  // we're deliberately not returning any data here
  // because we've made the design choice to always reload all ToDos
  // it's enough to await the response, and then continue

  //so basically we dont return the data because we call loadtodos in main to 
  //refresh the whole JSON data in the browser after we read the updated data in create event listener**
};
