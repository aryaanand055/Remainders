const body = document.getElementById("body");
const ulListTDo = document.getElementById("todo");
const ulListDone = document.getElementById("done");
const form = document.getElementById("taskForm");
const formInput = document.getElementById("task");
const clearAll = document.getElementById("clear-tasks");
const filter = document.getElementById("filter");
const lists = document.getElementById("lists");
const button1 = document.getElementById("butt1")
const button2 = document.getElementById("butt2")

loadEventListeners();


function loadEventListeners() {
    button1.addEventListener("click", clearTasksTodo)
    button2.addEventListener("click", clearTasksDone)
    form.addEventListener("submit", addTask);
    ulListTDo.addEventListener("click", removeTaskTodo);
    ulListDone.addEventListener("click", removeTaskDone);
    document.addEventListener("DOMContentLoaded", restoreFromLS);
    filter.addEventListener("keyup", filterTasks);
    lists.addEventListener("click", changeList);
    clearAll.addEventListener("mouseenter", displayElement);
    button1.addEventListener("mouseleave", displayElement2);
    button2.addEventListener("mouseleave", displayElement2);
}

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
        ulListTDo.appendChild(createdLi);
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
/* <li class="list-group-item d-flex justify-content-between align-items-center m-2 bg-light rounded">
        <div class="checkbox-rect0">
            <input type="checkbox" id="checkbox-rect10" name="check0">
            <label for="checkbox-rect10">
                <div class="list_item_info">
                     <div class="list_item_name fw-bold">Cras justo odio</div>
                     <div class="list_item_date fw-light fs-6">01/01/2023</div>
                </div>
            </label>
        </div>
        <span class="badge badge-primary badge-pill text-bg-warning text-light ms-auto">VIP</span>
    </li> */
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
        ulListTDo.appendChild(createdLi);
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
}

function removeTaskTodo(e) {
    if (e.target.classList.contains("fa-remove")) {
        e.target.parentElement.remove();
        displayMessage("Task Removed", 3000)
        deleteFromLS(e.target.parentElement, "todo")
    }
}

function removeTaskDone(e) {
    if (e.target.classList.contains("fa-remove")) {
        e.target.parentElement.remove();
        displayMessage("Task Removed", 3000)

        deleteFromLS(e.target.parentElement, "done")
    }
}

function storeToLS(taskToStore, place) {
    console.log("Storing to LS" + "..." + taskToStore + "..." + place)

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
    console.log("Deltering from LS" + "..." + itemToDel + "..." + place)
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

function clearTasksTodo() {
    if (confirm("Are you sure you want to delete all todo tasks?")) {
        const findList = ulListTDo.childNodes;
        let arrr2 = [];
        let ls;


        findList.forEach(function (nodoNow) {
            if (nodoNow.className === "list-content") {

                arrr2.push(nodoNow)
            }
        })

        arrr2.forEach(function (e) {
            e.remove()
        })
        displayMessage("Tasks Cleared", 3000)
        ls = localStorage.getItem("tasksToDo");
        ls = JSON.stringify([]);

        localStorage.setItem("tasksToDo", ls);
    }
}

function clearTasksDone() {
    if (confirm("Are you sure you want to delete all completed tasks?")) {
        const findList = ulListDone.childNodes;
        let arrr2 = [];
        let ls;


        findList.forEach(function (nodoNow) {
            if (nodoNow.className === "list-content") {

                arrr2.push(nodoNow)
            }
        })

        arrr2.forEach(function (e) {
            e.remove()
        })
        ls = localStorage.getItem("tasksDone");
        ls = JSON.stringify([]);
        localStorage.setItem("tasksDone", ls);
    }

}

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
        console.log("Moving to todo" + moveLS)
        deleteFromLS(moveLS, "done");
        storeToLS(moveLS, "todo");
        ulListTDo.appendChild(moveTask);
    }
}

filter.onblur = function () {
    document.getElementById("container_message").innerHTML = ""
    document.querySelectorAll(".list-group-item").forEach(task => {
        task.style.display = "flex"
    });
}

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
                // task.style.display = "none";
                task.style.setProperty("display", "none", "important")
            }
        }
        if (count === 0) {
            displayMessage("No tasks found", 3000, "all")
        } else {
            displayMessage(`${count} tasks found`, 3000, "all")
        }
    } else {
        // document.querySelectorAll(".list-group-item").forEach(task => {
        //     task.style.display = "flex"
        // });
        displayMessage("No input provided", 3000, "all")
    }


}


function displayElement() {
    clearAll.style.display = "none";
    button1.style.display = "inline-block";
    button2.style.display = "inline-block";
}

function displayElement2() {
    button1.style.display = "none";
    button2.style.display = "none";
    clearAll.style.display = "inline-block";
}

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
        // console.log(123)
        // }
    }, time)
}