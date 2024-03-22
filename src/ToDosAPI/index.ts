import { createToDo } from './create';
import { readToDos } from './read';
import { toggleToDo } from './update';
import { deleteToDo } from './delete';
//we import these files with names and use those names within this file to access the other files**
//when we import does it usually import the whole file or can we import specific things from files**

//what does this do**
export const ToDosAPI = {
  create: createToDo,
  read: readToDos,
  //what does this mean**
  update: {
    toggle: toggleToDo,
  },
  delete: deleteToDo,
};

//why do we need this could we have called each file directly****