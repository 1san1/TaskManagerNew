// here dragged stores the dragged element when dragstart event is fired.
var dragged = null;
var listOfTask;

const dragS = document.getElementById("drag1");
const dropZ = document.querySelectorAll(".module_drag_ul");

const newTskInp = document.getElementById("newTskInp");

async function fetchData(URL) {
  const data = await fetch(URL).then((response) => response.json());
  listOfTask = data;
}

async function fetchedData() {
  await fetchData("http://localhost:3000");
  if (listOfTask) {
    listOfTask.forEach((item) =>
      insertListParent(taskListChooser(item.completed, item.isProcessing), item)
    );
  }
  // here the dom element functionality is reinitiated as the async is activated after
  reinitiate();
}

fetchedData();

// it choose where should the list of tasks be located based on each completed and isprocessing status
function taskListChooser(completed, isprocessing) {
  return completed ? dropZ[2] : isprocessing ? dropZ[1] : dropZ[0];
}

async function sendData(event) {
  const data = { message: event.target.value };

  try {
    const response = await fetch("http://localhost:3000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.log("Error: ", error);
  }
}

function reinitiate() {
  const dragSL = document.querySelectorAll(".draggable_list");

  // const dragSL = document.querySelector(".draggable_list");

  dragSL.forEach((item) => {
    item.ondragstart = (event) => {
      dragged = event.target;
    };
  });

  // dragover is used to sense the drag event with in the droppable zone

  dropZ.forEach(
    (item) =>
      (item.ondragover = (event) => {
        event.preventDefault();
      })
  );

  // we preventdefault the dragover to allow drop event to initiate the action

  //drop event is fired when the draggable event is dropped in the droppable zone.

  dropZ.forEach((item) => {
    item.ondrop = (event) => {
      event.preventDefault();
      if (event.target.className === "module_drag_ul") {
        dragged.parentNode.removeChild(dragged);
        event.target.appendChild(dragged);

        var draggedId = dragged.getAttribute("id");
        locateColumn(event, draggedId);
        dragged = null; //after dragged is initialized to null then if we perform drag operation on other list it will carry another element that is beign carried
      }
    };
  });
}

function locateColumn(event, draggedId) {
  switch (event.target.id) {
    case "drop1":
      updateData(draggedId, { isProcessing: true, isCompleted: false });
      break;
    case "drop2":
      updateData(draggedId, { isProcessing: false, isCompleted: true });
      break;
    default:
      updateData(draggedId, {
        isProcessing: false,
        isCompleted: false,
      });
  }
}

newTskInp.onchange = sendData;

function insertListParent(parentNode, data) {
  const listS = parentNode.appendChild(genList(data));
  return listS;
}

function genList({ id, task }) {
  const defaultListAttr = {
    id: id,
    class: "task_item draggable_list",
    draggable: "true",
  };

  const newList = document.createElement("li");
  Object.entries(defaultListAttr).forEach((item) =>
    newList.setAttribute(item[0], item[1])
  );

  newList.innerHTML = `<p id="taskDescp">${task}</p><span>
  <svg
    class="edit pntr"
    xmlns="http://www.w3.org/2000/svg"
    height="1em"
    viewBox="0 0 512 512"
    onclick="handleEdit(event)"
  >
    <path
      d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
    />
  </svg>
  <svg
    class="delete pntr"
    xmlns="http://www.w3.org/2000/svg"
    height="1em"
    viewBox="0 0 448 512"
    onclick="handleDelete(event)"
  >
    <path
      d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
    />
  </svg>
</span>`;

  return newList;
}

function handleEdit(event) {
  const parentNode = event.target.parentNode.parentNode.parentNode;
  const newChild = document.createElement("input");
  const oldChild = parentNode.children[0];
  newChild.setAttribute("value", oldChild.innerText);
  const listId = parentNode.getAttribute("id");
  console.log(oldChild.nodeName == "P");
  if (oldChild.nodeName == "P") {
    parentNode.replaceChild(newChild, oldChild);
  }
  newChild.onchange = (event) => {
    oldChild.innerHTML = event.target.value;
    updateData(listId, { task: event.target.value });
    newChild.parentNode.replaceChild(oldChild, newChild);
  };
}

function handleDelete(event) {
  const parentNode = event.target.parentNode.parentNode.parentNode;
  let taskId = parentNode.getAttribute("id");
  deleteData(taskId);
}
async function updateData(id, updatedData) {
  try {
    const response = await fetch(`http://localhost:3000/data/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.log("Error: ", error);
  }
}

async function deleteData(id) {
  try {
    const response = await fetch(`http://localhost:3000/data/delete/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.log("Error: ", error);
  }
}
