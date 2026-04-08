function addWithinData(parentElement, control, publication_idx, study_idx, dataset_idx) {
    // Create a new list item for the dataset
    const listItem = document.createElement("li");
    listItem.className = "collapsible collapsible-nocontent";
    listItem.dataset.index = "conditions-" + publication_idx + "-" + study_idx + "-" + dataset_idx;
    listItem.id = "conditions-" + publication_idx + "-" + study_idx + "-" + dataset_idx;


    // Create a span for the dataset name
    const span = document.createElement("span");
    span.textContent = "Within Conditions";

    // // Create action buttons
    // const actions = document.createElement("div");
    // actions.className = "actions";

    // const removeButton = document.createElement("button");
    // removeButton.innerHTML = '&times;'; // Red X
    // removeButton.classList.add('delete-button');
    // removeButton.onclick = function(event) {
    //     event.stopPropagation();
    //     removeItem(listItem, control);
    // };
    // actions.appendChild(removeButton);

    // Append the span and actions to the list item
    listItem.appendChild(span);
    // listItem.appendChild(actions);

    // Create a nested list for raw data
    const nestedList = document.createElement("ul");

    // Append the nested list to the dataset item
    listItem.appendChild(nestedList);

    // Append the new list item to the parent element
    parentElement.appendChild(listItem);

    // Update content area
    listItem.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent any default action
        initializeConditionSurvey(control, publication_idx, study_idx, dataset_idx);
    });
}

function initializeConditionSurvey(control, publication_idx, study_idx, dataset_idx) {
    const condition_data = control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].within_data;
    const study_name = control.publication_info[publication_idx].study_info[study_idx].study_name;

    document.getElementById("content").innerHTML = `
    <div class="display-text">      
    <h1 class = "mb-3">${study_name}: Dataset ${dataset_idx + 1} - Within Conditions</h1>
    <div class="alert alert-info" role="alert">
        <h5 class="alert-heading"><i class="bi bi-info-circle me-2"></i>Before You Begin</h5>
        <p>This section is designed to collect detailed information about the experimental conditions of your study. Importantly, this should only pertain to manipulations not already encoded through other parts of the questionnaire. For example, the within condition "congruent vs. incongruent" should be encoded in its own column in the raw data and not here. Similarly, between manipulations should be endoced through different datasets in the questionnaire "Dataset". Only those within-manipulations that cannot be adequately captured by those parts of the questionnaire should be added here. For example, a within-manipulation condition of the contrast of stimuli should be coded here.</p>
    </div>

        <h3 class="mb-3">Within Condition Details</h3>

        <form id="conditionSurvey" class="survey-form">
            ${generateYesNoField('has_within_conditions', 'Does this data contain any additional within conditions?', condition_data.has_within_conditions)}
            
            <fieldset id="withinConditionsFieldset" ${condition_data.has_within_conditions == 1 ? '' : 'disabled'} class="border p-3 rounded mb-4">
                <div class="mb-3">
                    <label for="within_condition_name" class="form-label">Add a description of the condition:</label>
                    <input type="text" class="form-control" id="within_condition_name" name="within_condition_name" />
                </div>
                <div class="mb-3">
                    <label for="within_condition_identifier" class="form-label">How is that condition identified in the raw data?</label>
                    <input type="text" class="form-control" id="within_condition_identifier" name="within_condition_identifier" />
                    <div class="form-text">This identifier must match the one provided in the raw data in the column "within_identifier" exactly.</div>
                </div>
                <button type="button" onclick="addWithinCondition()" class="btn btn-warning mb-3">Add Condition</button>

                <div class="mb-3" id="within_conditions_list" style="display: none;">
                    <label class="form-label fw-bold">List of within conditions:</label>
                    <ul id="withinConditionsList" class="list-group ps-3"></ul>
                </div>
            </fieldset>
            <button type="submit" class="btn btn-success">Submit</button>
        </form>
    </div>
    `;

    // Display previous submission if available
    if (condition_data && condition_data.has_within_conditions == 1) {
        document.getElementById("within_conditions_list").style.display = "block";
        var withinConditionsList = document.getElementById("withinConditionsList");
        condition_data.within_condition_details.forEach(function(condition) {
            var li = document.createElement("li");
            li.textContent = `Condition: ${condition.name}, Identifier: ${condition.identifier}`;

            add_delete_button_to_list_item(li);
            withinConditionsList.appendChild(li);
        });
    }

    document.querySelectorAll('input[name="has_within_conditions"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('withinConditionsFieldset').disabled = this.value == '0';
        });
    });

    document.getElementById('conditionSurvey').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
        if (validateConditionData(collectConditionData()) || control.testing){
            updateConditionSurvey(control, publication_idx, study_idx, dataset_idx);
        }
    });
}

function addWithinCondition() {
    const condition_name = document.getElementById('within_condition_name').value;
    const condition_identifier = document.getElementById('within_condition_identifier').value;

    if (condition_name && condition_identifier) {
        const conditionsList = document.getElementById('withinConditionsList');

        // Create a new list item for the condition
        const listItem = document.createElement('li');
        listItem.textContent = `Condition: ${condition_name}, Identifier: ${condition_identifier}`;

        add_delete_button_to_list_item(listItem);

        // Append the new list item to the conditions list
        conditionsList.appendChild(listItem);

        // Clear the input fields
        document.getElementById('within_condition_name').value = '';
        document.getElementById('within_condition_identifier').value = '';
        document.getElementById("within_conditions_list").style.display = "block";

    } else {
        if (!condition_name) {
            var alert_message = 'Please enter a condition name.';
            displayValidationError("within_condition_name", alert_message);
        } else {
            var alert_message = 'Please enter an identifier for the condition.';
            displayValidationError("within_condition_identifier", alert_message);
        }   
    }
}

// Function to collect within conditions
function collectWithinConditions() {
    var withinConditions = [];
    var listItems = document.getElementById("withinConditionsList").getElementsByTagName("li");
    for (var i = 0; i < listItems.length; i++) {
        var conditionText = listItems[i].childNodes[0].nodeValue;
        var conditionParts = conditionText.split(", Identifier: ");
        var conditionName = conditionParts[0].replace("Condition: ", "").trim();
        var conditionIdentifier = conditionParts[1].trim();
        withinConditions.push({ name: conditionName, identifier: conditionIdentifier });
    }
    return withinConditions;
}


function collectConditionData() {
    // Get values from the input fields
    const has_within_conditions = getRadioButtonSelection("has_within_conditions");
    const within_condition_details = has_within_conditions == 1 ? collectWithinConditions() : '';
    
    // Store the values in the control object
    condition_data = {
        has_within_conditions: has_within_conditions,
        within_condition_details: within_condition_details,
    };

    return condition_data
}

function validateConditionData(condition_data){
    clearValidationMessages();
    
    var alert_message = 'This field does not match validation criteria.';

    if (condition_data.has_within_conditions == null) {
        alert_message = 'Please select whether the data contains within conditions.';
        displayValidationError("has_within_conditions", alert_message);
        return false;
    }
    // if has_within_conditions is true, check if there are any conditions
    if (condition_data.has_within_conditions == 1 && condition_data.within_condition_details.length < 2) {
        alert_message = 'Please add at least one two within conditions.';
        displayValidationError("withinConditionsList", alert_message);
        return false;
    }
    

    // Check if identifiers are unique
    if (condition_data.has_within_conditions == 1) {
        const identifiers = condition_data.within_condition_details.map(condition => condition.identifier);
        if (new Set(identifiers).size !== identifiers.length) {
            alert_message = 'Identifiers for within conditions must be unique.';
            displayValidationError("withinConditionsList", alert_message);
            return false;
        }
    }

    return true
}

function updateConditionSurvey(control, publication_idx, study_idx, dataset_idx) {
    condition_data = collectConditionData();

    condition_data.validated = validateConditionData(condition_data);

    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].within_data = condition_data

    // Optionally, display a confirmation message
    showAlert('Survey submitted successfully!', 'success');

    // Add a checkmark to the currently selected sidebar item
    const item_id =  "conditions-" + publication_idx + "-" + study_idx + "-" + dataset_idx;
    addGreenCheckmarkById(item_id);
}