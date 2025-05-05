function addTask(parentElement, control) {
    // Determine the number of entries in dataset_info
    const task_idx = getNewId(control.task_info);
    const task_name = "Task " + (task_idx + 1);

    control.task_info[task_idx] = setupTaskInfo(task_name);

    // Create a new list item for the dataset
    const listItem = document.createElement("li");
    listItem.className = "collapsible collapsible-nocontent";
    listItem.dataset.index = "task-" + task_idx;
    listItem.id = "task-" + task_idx;


    // Create a span for the dataset name
    const span = document.createElement("span");
    span.textContent = task_name;

    // Create action buttons
    const actions = document.createElement("div");
    actions.className = "actions";

    const removeButton = document.createElement("button");
    removeButton.innerHTML = '&times;'; // Red X
    removeButton.classList.add('delete-button');
    removeButton.onclick = function(event) {
        event.stopPropagation();
        removeItem(listItem, control);
    };
    actions.appendChild(removeButton);

    // Append the span and actions to the list item
    listItem.appendChild(span);
    listItem.appendChild(actions);

    // Create a nested list for raw data
    const nestedList = document.createElement("ul");

    // Append the nested list to the dataset item
    listItem.appendChild(nestedList);

    // Append the new list item to the parent element
    parentElement.appendChild(listItem);

    // Update content area
    span.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent the collapsible toggle
        initializeTaskSurvey(control, task_idx);
    });
}

function addTaskOverview(control) {
    // Create a new list item for the publication
    const listItem = document.createElement("li");
    listItem.className = "collapsible";
    listItem.dataset.index = "task-overview";
    listItem.id = "task-overview";

    // Create a span for the publication name
    const span = document.createElement("span");
    span.textContent = "Tasks";

    // Append the span and actions to the list item
    listItem.appendChild(span);

    // Create a nested list for studies
    const nestedList = document.createElement("ul");
    nestedList.className = "nested";

    // Create a list item for the "Add Task" button
    const addTaskListItem = document.createElement("li");
    const addTaskButton = document.createElement("button");
    addTaskButton.className = "menu-button";
    addTaskButton.id = "addTaskButton";
    addTaskButton.textContent = "+ Add Task";
    addTaskButton.onclick = function() {
        addTask(nestedList, control);
    };
    addTaskListItem.appendChild(addTaskButton);
    nestedList.appendChild(addTaskListItem);

    // Append the nested list to the publication item
    listItem.appendChild(nestedList);

    // Append the new list item to the sidebar list
    document.getElementById("sidebarList").appendChild(listItem);

    // Add collapsible functionality
    listItem.addEventListener("click", function(event) {
        if (event.target === this) {
            this.classList.toggle("active");
        }
    });

    // Toggle the collapsible on by default
    listItem.classList.add("active");

    // Open one new Task
    addTask(nestedList, control);
}

function initializeTaskSurvey(control, task_idx) {
    const task_data = control.task_info[task_idx].task_data;
    const task_name = control.task_info[task_idx].task_name;

    document.getElementById("content").innerHTML = `
    <div class="display-text">
        <h1>${task_name}</h1>
        <p>In this section, please provide information about tasks <strong>${task_name}</strong>.</p>
        <form id="taskSurvey" class = "survey-form">
            <label for="task_name" class="survey-label">What was the name of the task you employed?</label>
            <div class="radio-buttons" id = "task_name">
                <input type="radio" id="flanker" name="task_name" value="flanker" ${task_data.task_name === 'flanker' ? 'checked' : ''}>
                <label for="flanker">Flanker Task</label>
                <input type="radio" id="stroop" name="task_name" value="stroop" ${task_data.task_name === 'stroop' ? 'checked' : ''}>
                <label for="stroop">Stroop Task</label>
                <input type="radio" id="simon" name="task_name" value="simon" ${task_data.task_name === 'simon' ? 'checked' : ''}>
                <label for="simon">Simon Task</label>
                <input type="radio" id="other" name="task_name" value="other" ${task_data.task_name === 'other' ? 'checked' : ''}>
                <label for="other">Other</label><br>
            </div>

            <fieldset id="other_task_name_fieldset" ${task_data.task_name === 'other' ? '' : 'disabled'}>
                <div class="form-item">
                    <label for="task_name_details" class="survey-label">Provide a short name of the task you used:</label>
                    <input type="text" id="task_name_details" name="task_name_details" value="${task_data.task_name_details || ''}"/>
                </div>
            </fieldset>

            <label for="task_description" class = "survey-label">Task Description:</label>
            <input type="text" id="task_description" name="task_description" value="${task_data.task_description || ''}"><br>
            
            <button type="submit" class="survey-button">Submit</button>
        </form>
    </div>
    `;

    document.querySelectorAll('input[name="task_name"]').forEach((elem) => {
        elem.addEventListener("change", function(event) {
            const fieldset = document.getElementById("other_task_name_fieldset");
            if (event.target.value == "other") {
                fieldset.disabled = false;
            } else {
                fieldset.disabled = true;
            }
        });
    });

    // Add event listener to the form's submit button
    document.getElementById('taskSurvey').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
        // Await statement set data
        const task_data = collectTaskData();
        if (validateTaskData(task_data) || control.testing) {
            updateTaskSurvey(control, task_idx);
        }
    });
}

function collectTaskData() {
    const task_name = getRadioButtonSelection('task_name');
    const task_description = document.getElementById('task_description').value;
    const task_name_details = task_name == "other" ? document.getElementById('task_name_details').value : '';

    const task_data = {
        task_name,
        task_description,
        task_name_details
    };
    return task_data;
}

function validateTaskData(task_data) {
    clearValidationMessages();

    var alert_message = 'This field does not match validation criteria.';
    // Check if any of the fields are empty

    var required_keys = [
        'task_name', 'task_description',
    ];

    if (task_data.task_name === 'other') {
        required_keys.push('task_name_details');
    }

    for (const key of required_keys) {
        if (!task_data[key]) {
            alert_message = 'This field is required.';
            displayValidationError(key, alert_message);
            return false;
        }
    }

    return true;
}

function updateTaskSurvey(control, task_idx) {
    const task_data = collectTaskData();

    task_data.validated = true;
    control.task_info[task_idx].task_data = task_data;

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');

    // Add a checkmark to the currently selected sidebar item
    const item_id =  "task-" + task_idx;
    addGreenCheckmarkById(item_id);
}