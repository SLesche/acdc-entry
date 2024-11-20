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


    </div>
    `;

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
    
}

function validateTaskData(task_data){
    clearValidationMessages();
    
    var alert_message = 'This field does not match validation criteria.';

    
    return true;
}

async function updateTaskSurvey(control, task_idx) {
    const task_data = collectTaskData();

    task_data.validated = true;
    control.task_info[task_idx].task_data = task_data;

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');

    // Add a checkmark to the currently selected sidebar item
    const item_id =  "task-" + task_idx;
    addGreenCheckmarkById(item_id);
}