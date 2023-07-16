document.addEventListener("DOMContentLoaded", function () {

    //Checkbox
    // Get all the checkboxes on the page
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Loop through the checkboxes and add an event listener
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', event => {
            // Get the title of the item associated with the checkbox
            const title = event.target.parentNode.nextElementSibling.textContent.trim();
            const done = event.target.checked;
            const list = document.getElementById("heading-info").textContent

            event.target.parentNode.parentNode.classList.toggle("done")

            // Make an HTTP request to update the database
            let requests = {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    list: list,
                    title: title,
                    done: done,

                })
            }
            fetch('/modify-item', requests)
                .then(data => data.json())
                .then(response => {
                    console.log(response);
                });
        });
    });

    //Submit and insert tsk
    const taskForm = document.getElementById('taskForm');

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        let val = document.querySelector("#task_input").value
        let newTask = document.createElement("div")
        newTask.classList = "item"
        let label = document.createElement("label")
        let input = document.createElement("input")
        input.type = "checkbox"
        input.classList = "label__checkbox"
        input.checked = false
        let span = document.createElement("span")
        span.classList = "label__text"
        let span_check = document.createElement("span")
        span_check.classList = "label__check"
        let icon = document.createElement("i")
        icon.classList = "fa fa-check icon"
        span_check.appendChild(icon)
        span.appendChild(span_check)
        label.appendChild(input)
        label.appendChild(span)
        newTask.appendChild(label)
        let p = document.createElement("p")
        p.classList = "list-item w-75"
        p.textContent = val

        const list = document.getElementById("heading-info").textContent
        const request = {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: val,
                list: list
            })
        };
        id = ""
        fetch("/", request).then(data => {
            data.json().then(response => {
                p.id = response.id
                newTask.appendChild(p)
                document.querySelector("#lists").insertBefore(newTask, document.querySelector(".item:last-child"))
                document.querySelector("#task_input").value = ""
            })
        })

    });

    // Right click menu

    document.onclick = hideMenu;
    document.oncontextmenu = rightClick;

    function hideMenu() {
        contextMenu.style.display = "none";
    }

    contextMenu.addEventListener("click", abcd)
    let delItem = ""

    function rightClick(e) {
        e.preventDefault();
        if (document.getElementById("contextMenu").style.display == "block") {
            hideMenu();
        } else {
            if (e.target.classList.contains("item") | e.target.classList.contains("list-item")) {
                var menu = document.getElementById("contextMenu")
                menu.style.display = 'block';
                menu.style.left = e.pageX + "px";
                menu.style.top = e.pageY + "px";
                delItem = e.target.parentNode
            }
        }
    }

    function abcd(event) {
        if (event.target.id === "delete") {
            deleteClassItem(delItem);
            contextMenu.style.display = "none";
        }
    }

    function deleteClassItem(item) {
        const id = item.querySelector(".list-item").id
        const request = {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id
            })
        };

        fetch('/modify-item', request).then(data => {
            data.json().then(response => {
                console.log(response)
                if (response.success) {
                    item.remove();
                }
            })
        })

    }




    document.addEventListener("dblclick", (e) => {
        if (e.target.classList.contains("list-item")) {
            const currentText = e.target.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            input.classList = 'list-item-edit';

            input.addEventListener('blur', () => {
                const newText = input.value.trim();
                if (newText !== '') {
                    e.target.textContent = newText;
                    updateTaskInDatabase(e.target.parentNode, currentText);
                } else {
                    e.target.textContent = currentText;
                }
                e.target.style.display = "block"
                input.remove()
            });
            input.addEventListener('keypress', (e) => {
                if (e.key === "Enter") {
                    e.target.blur();
                }
            });

            e.target.textContent = '';
            e.target.style.display = "none"
            e.target.parentNode.appendChild(input);
            input.focus();
        }
    })

    function updateTaskInDatabase(item, newItemName) {
        const title = item.querySelector('.list-item').textContent.trim();
        const list = document.getElementById('heading-info').textContent.trim();
        const request = {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                list: list,
                newTitle: newItemName
            }),
        };

        fetch('/replace-item', request)
            .then(data => data.json())
            .then(response => {
                console.log(response);
            });

    }

    // For the navbar


    // Import the HTML2Canvas library
    const titleElement = document.querySelector(".header .title");

    function updateTitleColor() {
        // Convert the gradient background to an image
        html2canvas(document.documentElement).then(canvas => {
            const context = canvas.getContext("2d");

            // Get the pixel color at the position of the title
            const rect = titleElement.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = (rect.top + rect.height / 2) + 5;
            const pixel = context.getImageData(x, y, 1, 1).data;
            const backgroundColor = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
            const isMainColor = backgroundColor ===
                "rgb(237, 238, 203)"; // Change this to match your --main-color RGB value
            if (isMainColor) {
                titleElement.style.color = "var(--secondary-color)";
            } else {
                titleElement.style.color = "var(--main-color)";
            }
        });
    }

    // Update the title color on initial load and after the page has loaded
    updateTitleColor()
    // Update the title color on every scroll
    window.addEventListener("scroll", updateTitleColor);


});