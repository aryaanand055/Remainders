document.addEventListener("DOMContentLoaded", function () {

    // Get all the checkboxes on the page
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Loop through the checkboxes and add an event listener
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', event => {
            // Get the title of the item associated with the checkbox
            const title = event.target.nextElementSibling.textContent.trim();
            const done = event.target.checked;

            // Make an HTTP request to update the database
            let requests = {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    done: done
                })
            }
            fetch('/update-item', requests)
        });
    });


    const taskForm = document.getElementById('taskForm');

    taskForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        let val = document.querySelector("#task_input").value

        let newTask = document.createElement("div")
        newTask.classList = "item"
        let checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.checked = false
        let p = document.createElement("p")
        p.classList = "list-item w-75"
        p.textContent = val
        newTask.appendChild(checkbox)
        newTask.appendChild(p)
        document.querySelector("#lists").insertBefore(newTask, document.querySelector(".item:last-child"))

        // Clear the form
        document.querySelector("#task_input").value = ""

        const request = {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: val,
                list: "tasks"
            })
        };

        fetch("/", request) // Make the asynchronous request to the server

    });
});