
//why does this not take an import of todo like the rest of the files**
export const deleteToDo = async (id: string) => {
  const request = new Request(`http://localhost:3000/todos/${id}`, { //we need the specific entry so we put the id here**
    method: 'DELETE',
  });

  const response = await fetch(request);

  if (!response.ok) {
    console.log('something went wrong deleting ToDo ' + id);
    return;
  }

  await response.json();

  // while response.json() does contain the newly deleted ToDo
  // we're deliberately not returning any data here
  // because we've made the design choice to always reload all ToDos
  // it's enough to await the response, and then continue
    // I thought response.JSON would remove the value then return the new JSON why does it not**
};
