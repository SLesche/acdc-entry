function addStudy(parentElement, control, publication_idx) {
    const study_idx = getNewId(control.publication_info[publication_idx].study_info);
    const studyName = "Study " + (study_idx + 1);
    control.publication_info[publication_idx].study_info[study_idx] = setupStudyInfo(studyName);

    // Create a new list item for the study
    const listItem = document.createElement("li");
    listItem.className = "collapsible";
    listItem.dataset.index = "study-" + publication_idx + "-" + study_idx;
    listItem.id = "study-" + publication_idx + "-" + study_idx;


    // Create a span for the study name
    const span = document.createElement("span");
    span.textContent = studyName;

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

    // Create a nested list for datasets
    const nestedList = document.createElement("ul");
    nestedList.className = "nested";

    // Create a list item for the "Add Dataset" button
    const addDatasetListItem = document.createElement("li");
    const addDatasetButton = document.createElement("button");
    addDatasetButton.className = "menu-button";
    addDatasetButton.id = "addDatasetButton-" + publication_idx + "-" + study_idx;
    addDatasetButton.textContent = "+ Add Dataset";
    addDatasetButton.onclick = function() {
        addData(nestedList, control, publication_idx, study_idx);
    };
    addDatasetListItem.appendChild(addDatasetButton);
    
    nestedList.appendChild(addDatasetListItem);

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
        initializeStudySurvey(control, publication_idx, study_idx);
    });

    // Add measurement survey
    addMeasurement(nestedList, control, publication_idx, study_idx);

    // Add task survey

    // Add raw data survey
    addData(nestedList, control, publication_idx, study_idx);
    
}

function initializeStudySurvey(control, publication_idx, study_idx) {
    const study_data = control.publication_info[publication_idx].study_info[study_idx].study_data;
    const study_name = control.publication_info[publication_idx].study_info[study_idx].study_name;

    document.getElementById("content").innerHTML = `
    <div class="display-text">
        <h1 class = "mb-3">${study_name}</h1>
        <div class="alert alert-info" role="alert">
            <h5 class="alert-heading"><i class="bi bi-info-circle me-2"></i>Before You Begin</h5>
            <p>This section is designed to collect key details about the study you conducted. The information you provide here will help us better understand the scope and methodology of your research. You'll be asked about how you measured truth ratings, what other measures were included in your study, the types of analysis you performed, and the specific statements or stimuli used in your research.</p>
            <p>If your study is available on an open-source platform, you’ll also have the option to share a link, ensuring that others can access the full study for further exploration.</p>
            <p>This information is crucial for ensuring that your study is well-documented and can be effectively integrated into our database. Thank you for taking the time to provide these details.</p>
            <p>You will be asked to enter information from different between-subject conditions in different "dataset" surveys. Make sure that the number of between-subject conditions in the dataset survey matches the number of between-subject conditions you enter here.</p>
        </div>

        <h3 class="mb-3">Study Survey</h2>
        <form id="studySurvey" class="survey-form p-3 border rounded shadow-sm bg-light">
            <div class="mb-3">
            <label for="n_groups" class = "form-label">How many between-subject groups are present in this study?</label>
            <input type="number" class="form-control" id="n_groups" name="n_groups" value="${study_data.n_groups || ''}">
            </div>
            
            <div class="mb-3">
            <label for="n_tasks" class = "form-label">How many tasks did you use in this study?</label>
            <input type="number" class="form-control" id="n_tasks" name="n_tasks" value="${study_data.n_tasks || ''}">
            </div>

            <div class="mb-3">
            <label for="study_comment" class = "form-label">Please provide a short description of the study (1-2 sentences): What was investigated? How was it studied?</label>
            <input type="text" class="form-control" id="study_comment" name="study_comment" value="${study_data.study_comment || ''}">
            </div>

            <button type="submit" class="btn btn-success">Submit</button>
        </form>
    </div>
    `;

    // Add event listener to the form's submit button
    document.getElementById('studySurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        if (validateStudyData(collectStudyData()) || control.testing){
            updateStudySurvey(control, publication_idx, study_idx);
        }
    });
}

function collectStudyData() {
    const n_groups = document.getElementById('n_groups').value;
    const n_tasks = document.getElementById('n_tasks').value;
    const study_comment = document.getElementById('study_comment').value;

    const study_data = {
        n_groups: n_groups,
        n_tasks: n_tasks,
        study_comment: study_comment,
    }
    
    return study_data;
}

function validateStudyData(study_data) {
    clearValidationMessages();

    var alert_message = 'This field does not match validation criteria.';
    // Check if any of the fields are empty

    var required_keys = ['n_groups', 'n_tasks', 'study_comment'];

    for (const key of required_keys) {
        if (!study_data[key]) {
            alert_message = 'This field is required.';
            displayValidationError(key, alert_message);
            return false;
        }
    }

    return true;
}

function updateStudySurvey(control, publication_idx, study_idx) {
    const study_data = collectStudyData();
    study_data.validated = true;
    control.publication_info[publication_idx].study_info[study_idx].study_data = study_data;

    // Optionally, display a confirmation message
    showAlert('Survey submitted successfully!', 'success');

    // Add a checkmark to the currently selected sidebar item
    const item_id =  "study-" + publication_idx + "-" + study_idx;
    addGreenCheckmarkById(item_id);
}