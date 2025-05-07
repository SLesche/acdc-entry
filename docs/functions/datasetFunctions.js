function addData(parentElement, control, publication_idx, study_idx) {
    // Create a new list item for the dataset
    const dataset_idx = getNewId(control.publication_info[publication_idx].study_info[study_idx].dataset_info);
    const dataset_name = "Dataset  " + (dataset_idx + 1);
    control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx] = setupDatasetInfo(dataset_idx);

    const listItem = document.createElement("li");
    listItem.className = "collapsible";
    listItem.dataset.index = "datainfo-" + publication_idx + "-" + study_idx + "-" + dataset_idx;
    listItem.id = "datainfo-" + publication_idx + "-" + study_idx + "-" + dataset_idx;


    // Create a span for the dataset name
    const span = document.createElement("span");
    span.textContent = dataset_name;

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
    nestedList.className = "nested";

    // Append the nested list to the study item
    listItem.appendChild(nestedList);

    // Append the new list item to the parent element
    parentElement.appendChild(listItem);

    // Add collapsible functionality
    listItem.addEventListener("click", function(event) {
        if (event.target === this) {
            this.classList.toggle("active");
        }
    });
    // Toggle the collapsible on by default
    listItem.classList.add("active");

    // Update content area
    span.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent the collapsible toggle
        initializeDataSurvey(control, publication_idx, study_idx, dataset_idx);
    });

    // Add raw data survey
    addWithinData(nestedList, control, publication_idx, study_idx, dataset_idx);

    // Add raw data survey
    addRawData(nestedList, control, publication_idx, study_idx, dataset_idx);
}


function initializeDataSurvey(control, publication_idx, study_idx, dataset_idx) {
    const dataset_data = control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].dataset_data;
    const study_name = control.publication_info[publication_idx].study_info[study_idx].study_name;

    document.getElementById("content").innerHTML = `
    <div class="display-text">
        <h1>${study_name}: Dataset ${dataset_idx + 1}</h1> 
            <p>Here, please provide information on the dataset. <b>This should be limited to one between group in one task!</b> Add data from other between conditions or other tasks by using a new dataset.</p>
            <form id="dataInfoSurvey" class="survey-form">
                <label for="task_name" class="survey-label">Select the task used:</label>
                <select id="task_name" name="task_name">
                    <option value="">Select a task</option>
                    <!-- Options will be populated dynamically -->
                </select><br>
                <p class="survey-label-additional-info">Navigate to "Task" in the side-panel and add a task if you do not see your task here.</p>

                <label for="group_description" class="survey-label">Please provide a brief description of the sample (e.g., “University students” or “Participants on MTurk”).</label>
                <input type="text" id="group_description" name="group_description" value="${dataset_data.group_description || ''}"><br>

                <label for="n_participants" class="survey-label">How many participants are in this dataset?</label>
                <input type="number" id="n_participants" name="n_participants" value="${dataset_data.n_participants || ''}"><br>

                <label for="mean_age" class="survey-label">What is the mean age of the participants?</label>
                <input type="number" id="mean_age" name="mean_age" value="${dataset_data.mean_age || ''}"><br>

                <label for="percentage_female" class="survey-label">What percentage of your participants was female?</label>
                <input type="number" step="0.01" id="percentage_female" name="percentage_female" value="${dataset_data.percentage_female || ''}"><br>
                <p class="survey-label-additional-info">If 50% of your participants was female, enter "0.50".</p>

                <label for="n_blocks" class="survey-label">How many blocks are in this dataset?</label>
                <input type="number" id="n_blocks" name="n_blocks" value="${dataset_data.n_blocks || ''}"><br>

                <label for="n_trials" class="survey-label">How many trials are in this dataset?</label>
                <input type="number" id="n_trials" name="n_trials" value="${dataset_data.n_trials || ''}"><br>

                <label for="neutral_trials" class="survey-label">Did you include neutral trials in this dataset?</label>
                <div class="radio-buttons" id = "neutral_trials">
                    <input type="radio" id="neutral_yes" name="neutral_trials" value="1" ${dataset_data.neutral_trials === '1' ? 'checked' : ''}>
                    <label for="neutral_yes">Yes</label>
                    <input type="radio" id="neutral_no" name="neutral_trials" value="0" ${dataset_data.neutral_trials === '0' ? 'checked' : ''}>
                    <label for="neutral_no">No</label><br>
                </div>

                <label for "fixation_cross" class="survey-label">Provide information about how/if you presented a fixation cross</label>
                <input type="text" id="fixation_cross" name="fixation_cross" value="${dataset_data.fixation_cross || ''}"><br>

                <label for "time_limit" class="survey-label">Provide information about the time limit?</label>
                <input type="text" id="time_limit" name="time_limit" value="${dataset_data.time_limit || ''}"><br>

                <label for "github" class="survey-label">If available, provide the link to the data on an open access resource sharing platform.</label>
                <input type="text" id="github" name="github" value="${dataset_data.github || ''}"><br>

                <label for "data_excl" class="survey-label">Describe whether and how you excluded any data here</label>
                <input type="text" id="data_excl" name="data_excl" value="${dataset_data.data_excl || ''}"><br>


                <button type="submit" class="survey-button">Submit</button>
            </form>
    </div>
    `;

    populateTaskOptions(control, publication_idx, study_idx);

    document.getElementById('dataInfoSurvey').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
        const collected_data = collectDatasetSurvey();
        if (validateDataInfo(collected_data) || control.testing){
            updateDataInfo(control, publication_idx, study_idx, dataset_idx);
        }
    });
}


function collectDatasetSurvey() {
    const task_name = document.getElementById('task_name').value;
    const n_participants = document.getElementById('n_participants').value;
    const group_description = document.getElementById('group_description').value;
    const mean_age = document.getElementById('mean_age').value;
    const percentage_female = document.getElementById('percentage_female').value;
    const n_blocks = document.getElementById('n_blocks').value;
    const n_trials = document.getElementById('n_trials').value;
    const neutral_trials = getRadioButtonSelection('neutral_trials');
    const fixation_cross = document.getElementById('fixation_cross').value;
    const time_limit = document.getElementById('time_limit').value;
    const github = document.getElementById('github').value;
    const data_excl = document.getElementById('data_excl').value;

    const dataset_data = {
        task_name: task_name,
        n_participants: n_participants,
        group_description: group_description,
        mean_age: mean_age,
        percentage_female: percentage_female,
        n_blocks: n_blocks,
        n_trials: n_trials,
        neutral_trials: neutral_trials,
        fixation_cross: fixation_cross,
        time_limit: time_limit,
        github: github,
        data_excl: data_excl,
    };

    return dataset_data;
}

function validateDataInfo(dataset_data) {
    var alert_message = '';
 
    var required_keys = ['task_name', 'n_participants', 'group_description', 'mean_age', 'percentage_female', 'n_blocks', 'n_trials', 'neutral_trials', 'fixation_cross', 'time_limit'];

    for (const key of required_keys) {
        if (!dataset_data[key]) {
            alert_message = 'This field is required.';
            displayValidationError(key, alert_message);
            return false;
        }
    }
    return true;
}

function updateDataInfo(control, publication_idx, study_idx, dataset_idx) {
    const dataset_data = collectDatasetSurvey();

    dataset_data.validated = true;
    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].dataset_data = dataset_data;

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');

    // Add a checkmark to the currently selected sidebar item
    const item_id =  "datainfo-" + publication_idx + "-" + study_idx + "-" + dataset_idx;
    addGreenCheckmarkById(item_id);
}

function populateTaskOptions(control, publication_idx, study_idx) {
    const taskSelect = document.getElementById('task_name');
    
    const study_data = control.publication_info[publication_idx].study_info[study_idx].study_data;

    // Clear existing options
    taskSelect.innerHTML = '';

    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a task';
    taskSelect.appendChild(defaultOption);

    // // Add the option that they do not have a statement set	
    // const noTaskOption = document.createElement('option');
    // noTaskOption.value = 'no information';
    // noTaskOption.textContent = 'No available information on the statements.';
    // taskSelect.appendChild(noTaskOption);

    // Populate the drop-down with statement sets
    for (const key in control.task_info) {
        const option = document.createElement('option');
        option.value = control.task_info[key].task_name;
        option.textContent = control.task_info[key].task_name;
        taskSelect.appendChild(option);
    }

    // Set the default value
    if (study_data.task_name) {
        taskSelect.value = study_data.task_name;
    } else {
        taskSelect.value = ''; // Default to "Select a task" option
    }
}