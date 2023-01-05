//Declaring Variables
const body = document.getElementById("body");
const ulListToDo = document.getElementById("todo");
const ulListDone = document.getElementById("done");
const form = document.getElementById("taskForm");
const formInput = document.getElementById("task");
const filter = document.getElementById("filter");
const lists = document.getElementById("lists");
const contextMenu = document.getElementById("context_menu");
const liElements = document.getElementsByTagName("li")
const deleteMenu = document.getElementById("context_menu_delete")
// console.log(liElements)

//Adding event listeners

form.addEventListener("submit", addTask);
document.addEventListener("DOMContentLoaded", restoreFromLS);
filter.addEventListener("keyup", filterTasks);
lists.addEventListener("click", changeList);
document.addEventListener("DOMContentLoaded", emptyList);
document.addEventListener("contextmenu", contextMenuFun)
document.addEventListener("click", contextMenuClose)

let currentDel = "";
//Custom Context Menu
function contextMenuFun(event) {
    event.preventDefault()
    if (event.target.className.slice(0, 15) === "list-group-item") {

        const {
            clientX,
            clientY
        } = event;

        const {
            normalizedX,
            normalizedY
        } = normalizePozition(clientX, clientY)
        contextMenu.style.top = `${normalizedY}px`
        contextMenu.style.left = `${normalizedX}px`
        contextMenu.classList.remove("visible")
        setTimeout(() => {
            contextMenu.classList.add("visible")
        })
    }
    currentDel = {
        li: event.target,
        list: event.target.parentElement.id
    }
}
deleteMenu.addEventListener("click", () => {
    deleteListItem()
})

function deleteListItem() {
    deleteFromLS(currentDel.li, currentDel.list)
    contextMenu.classList.remove("visible")
    displayMessage("List item Deleted...", 1000, "single")
    currentDel.li.remove();
    emptyList()
}


function contextMenuClose(e) {
    if (e.target.offsetParent != contextMenu) {
        contextMenu.classList.remove("visible")
    }
}
const normalizePozition = (mouseX, mouseY) => {
    // ? compute what is the mouse position relative to the container element (body)
    const {
        left: bodyOffsetX,
        top: bodyOffsetY,
    } = body.getBoundingClientRect();

    const bodyX = mouseX - bodyOffsetX;
    const bodyY = mouseY - bodyOffsetY;

    // ? check if the element will go out of bounds
    const outOfBoundsOnX =
        bodyX + contextMenu.clientWidth > body.clientWidth;

    const outOfBoundsOnY =
        bodyY + contextMenu.clientHeight > body.clientHeight;

    let normalizedX = mouseX;
    let normalizedY = mouseY;

    // ? normalzie on X
    if (outOfBoundsOnX) {
        normalizedX =
            bodyOffsetX + body.clientWidth - contextMenu.clientWidth;
    }

    // ? normalize on Y
    if (outOfBoundsOnY) {
        normalizedY =
            bodyOffsetY + body.clientHeight - contextMenu.clientHeight;
    }

    return {
        normalizedX,
        normalizedY
    };
};

//Restores from local storage after load
function restoreFromLS() {
    let ls;
    if (localStorage.getItem("tasksToDo") === null) {
        ls = [];
    } else {
        ls = JSON.parse(localStorage.getItem("tasksToDo"));
    }
    ls.forEach(task => {
        const createdLi = document.createElement("li");
        createdLi.classList = "list-group-item d-flex justify-content-between align-items-center m-2 bg-light rounded";
        createdLi.id = task.id
        createdLi.innerHTML = ` <div class="checkbox-rect0">
            <input type="checkbox" id="${task.name}" name="check0">
            <label for="${task.name}">
                <div class="list_item_info">
                     <div class="list_item_name fw-bold" id="task_name">${task.name}</div>
                     <div class="list_item_date fw-light fs-6" id="task_date">${task.date}</div>
                </div>
            </label>
        </div>
        <span class="badge badge-primary badge-pill text-bg-warning text-light ms-auto" id="task_tag">${task.tag}</span>`
        ulListToDo.appendChild(createdLi);
    })

    let lsd;
    if (localStorage.getItem("tasksDone") === null) {
        lsd = [];
    } else {
        lsd = JSON.parse(localStorage.getItem("tasksDone"));
    }
    lsd.forEach(function (task) {
        const createdLi = document.createElement("li");
        createdLi.classList = "list-group-item d-flex justify-content-between align-items-center m-2 bg-light rounded";
        createdLi.id = task.id
        createdLi.innerHTML = ` <div class="checkbox-rect0">
            <input type="checkbox" id="${task.name}" name="check0" checked="true">
            <label for="${task.name}">
                <div class="list_item_info">
                     <div class="list_item_name fw-bold">${task.name}</div>
                     <div class="list_item_date fw-light fs-6">${task.date}</div>
                </div>
            </label>
        </div>
        <span class="badge badge-primary badge-pill text-bg-warning text-light ms-auto">${task.tag}</span>`
        ulListDone.appendChild(createdLi);
    })
    displayMessage("Page Loaded", 1000)
}

//Function to add task to the list
function addTask(e) {
    if (formInput.value === "") {
        alert("The input is blank");
        e.preventDefault();
    } else {
        const createdLi = document.createElement("li");
        const dateForLi = new Date().getFullYear()
        const tags = "VIP"
        createdLi.classList = "list-group-item d-flex justify-content-between align-items-center m-2 bg-light rounded";
        createdLi.id = formInput.value + dateForLi
        createdLi.innerHTML = ` <div class="checkbox-rect0">
            <input type="checkbox" id="${formInput.value}" name="check0">
            <label for="${formInput.value}">
                <div class="list_item_info">
                     <div class="list_item_name fw-bold" id="task_name">${formInput.value}</div>
                     <div class="list_item_date fw-light fs-6" id="task_date">${dateForLi}</div>
                </div>
            </label>
        </div>
        <span class="badge badge-primary badge-pill text-bg-warning text-light ms-auto" id ="task_tag">${tags}</span>`
        displayMessage("Task added", 3000)
        ulListToDo.appendChild(createdLi);
        const dataToStore = {
            name: formInput.value,
            date: dateForLi,
            tag: tags,
            id: formInput.value + dateForLi
        }
        storeToLS(dataToStore, "todo");
        formInput.value = "";
        e.preventDefault();
    }
    emptyList()
}

//Storing and deleting from Local storage
function storeToLS(taskToStore, place) {
    if (place === "todo") {
        let ls;
        if (localStorage.getItem("tasksToDo") === null) {
            ls = [];
        } else {
            ls = JSON.parse(localStorage.getItem("tasksToDo"));
        }
        ls.push(taskToStore);
        localStorage.setItem("tasksToDo", JSON.stringify(ls))
    } else if (place === "done") {
        let ls;
        if (localStorage.getItem("tasksDone") === null) {
            ls = [];
        } else {
            ls = JSON.parse(localStorage.getItem("tasksDone"));
        }
        ls.push(taskToStore);
        localStorage.setItem("tasksDone", JSON.stringify(ls))
    }
}

function deleteFromLS(itemToDel, place) {
    if (place === "todo") {
        let ls;
        if (localStorage.getItem("tasksToDo") === null) {
            ls = [];
        } else {
            ls = JSON.parse(localStorage.getItem("tasksToDo"));
        }
        ls.forEach((item) => {
            if (itemToDel.id === item.id) {
                ls.splice(ls.indexOf(item), 1)
            }
        })
        localStorage.setItem("tasksToDo", JSON.stringify(ls));
    } else if (place === "done") {
        let ls;
        if (localStorage.getItem("tasksDone") === null) {
            ls = [];
        } else {
            ls = JSON.parse(localStorage.getItem("tasksDone"));
        }
        ls.forEach((item) => {
            if (itemToDel.id === item.id) {
                ls.splice(ls.indexOf(item), 1)
            }
        })
        localStorage.setItem("tasksDone", JSON.stringify(ls));
    }
}

//Function to move list elements from todo to done and vice verca
function changeList(e) {
    if (e.target.checked === true) {
        const moveTask = e.target.parentElement.parentElement;
        const lsdata = JSON.parse(localStorage.getItem("tasksToDo"))
        let moveLS = {}
        lsdata.forEach((dataItem) => {
            if (dataItem.id === e.target.parentElement.parentElement.id) {
                moveLS = dataItem
            }
        })
        deleteFromLS(moveLS, "todo");
        storeToLS(moveLS, "done");
        ulListDone.appendChild(moveTask);
    } else if (e.target.checked === false) {
        const moveTask = e.target.parentElement.parentElement;
        const lsdata = JSON.parse(localStorage.getItem("tasksDone"))
        let moveLS;
        lsdata.forEach((dataItem) => {
            if (dataItem.id === e.target.parentElement.parentElement.id) {
                moveLS = dataItem
            }
        })
        deleteFromLS(moveLS, "done");
        storeToLS(moveLS, "todo");
        ulListToDo.appendChild(moveTask);
    }
    emptyList()
}

//Filter Functions
filter.onblur = function () {
    document.getElementById("container_message").innerHTML = ""
    document.querySelectorAll(".list-group-item").forEach(task => {
        task.style.display = "flex"
    });
}

//Filters the list items with regard to the input
function filterTasks() {
    let count = 0;
    const filterValue = filter.value.toLowerCase();
    if (filterValue !== "") {
        document.querySelectorAll(".list-group-item").forEach(filterTask);

        function filterTask(task) {
            console.log(task)
            const item = task.childNodes[1].childNodes[3].childNodes[1].childNodes[1].textContent
            if (item.toLowerCase().indexOf(filterValue) != -1) {
                task.style.display = "flex";
                count++;
            } else {
                task.style.setProperty("display", "none", "important")
            }
        }
        if (count === 0) {
            displayMessage("No tasks found", 3000, "all")
        } else {
            displayMessage(`${count} tasks found`, 3000, "all")
        }
    } else {
        displayMessage("No input provided", 3000, "all")
    }


}

//Custom Altert
function displayMessage(message, time, clear = "single") {
    let messageCon = document.getElementById("container_message")
    if (clear === "all") {
        messageCon.innerHTML = ""
    }
    alert = document.createElement("div")
    alert.innerHTML = `<div class="alert alert-primary fade show p-2 ps-3 w-25 m-auto my-3 text-center" role="alert" id="messageCon"><div id="message"><strong>${message}</strong></div></div>`;
    messageCon.appendChild(alert)
    setTimeout(() => {
        if (clear === "single") {
            document.querySelectorAll("#messageCon")[document.querySelectorAll("#messageCon").length - 1].parentElement.remove()
        }
    }, time)
}

//Alert if list is empty
function emptyList() {
    let emptyToDo = ulListToDo.lastElementChild.getAttribute("id") === "headingtodo" || ulListToDo.lastElementChild.getAttribute("id") === "todoAlert"
    let emptyDone = ulListDone.lastElementChild.getAttribute("id") === "headingdone" || ulListDone.lastElementChild.getAttribute("id") === "doneAlert";
    let newElem = document.createElement("div")
    newElem.classList = ""
    if (emptyDone === true) {
        if (document.getElementById("doneAlert") === null) {
            let elem = document.createElement("div")
            elem.classList = "bg-transparent opacity-50 text-center"
            elem.textContent = "None of the tasks are completed"
            elem.id = "doneAlert"
            ulListDone.append(elem)
        }
    } else {
        if (document.getElementById("doneAlert") !== null) {
            document.getElementById("doneAlert").remove()
        }
    }
    if (emptyToDo === true) {
        if (document.getElementById("todoAlert") === null) {
            let elem = document.createElement("div")
            elem.classList = "bg-transparent opacity-50 text-center"
            elem.textContent = "All tasks completed"
            elem.id = "todoAlert"
            ulListToDo.append(elem)
        }
    } else {
        if (document.getElementById("todoAlert") !== null) {
            document.getElementById("todoAlert").remove()
        }
    }
}