function addMeasurement(parentElement, control, publication_idx, study_idx) {
    const measurement_name = "Measurements";

    // Create a new list item for the dataset
    const listItem = document.createElement("li");
    listItem.className = "collapsible collapsible-nocontent";
    listItem.dataset.index = "measures-" + publication_idx + "-" + study_idx;
    listItem.id = "measures-" + publication_idx + "-" + study_idx;


    // Create a span for the dataset name
    const span = document.createElement("span");
    span.textContent = measurement_name;

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
        initializeMeasurementSurvey(control, publication_idx, study_idx);
    });
}

function initializeMeasurementSurvey(control, publication_idx, study_idx){
    const measurement_data = control.publication_info[publication_idx].study_info[study_idx].measurement_data;
    const study_name = control.publication_info[publication_idx].study_info[study_idx].study_name;

    // Example constructs array
    const constructs = ["intelligence", "extraversion", "anxiety", "memory", "creativity"];

    document.getElementById("content").innerHTML = `
        <div class="display-text">
            <div class="mb-3">
                <h1 class="mb3">${study_name}: Additional Measurements</h1>
                <div class="alert alert-info" role="alert">
                    <h5 class="alert-heading"><i class="bi bi-info-circle me-2"></i>Before You Begin</h5>
                    <p>In this section, we want to know if you collected any additional measurements beyond the primary variables of your study. This information is valuable for helping others identify datasets that include external variables they may be interested in.</p>
                    <p>To make the data more searchable and easier to navigate, we encourage you to use broad construct terms, such as "extraversion," "intelligence," or "anxiety," rather than specific test batteries or questionnaires.</p>
                    <p>By providing this information, you contribute to a more comprehensive and accessible dataset, enabling others to explore connections between truth ratings and various other factors.</p>
                </div>
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold" for="additional_measures">Did you collect any additional measures?</label>
                <div id="additional_measures">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="additional_measures" id="additional_measures_yes" value="1" ${measurement_data.additional_measures == 1 ? 'checked' : ''}>
                        <label class="form-check-label" for="additional_measures_yes">Yes</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="additional_measures" id="additional_measures_no" value="0" ${measurement_data.additional_measures == 0 ? 'checked' : ''}>
                        <label class="form-check-label" for="additional_measures_no">No</label>
                    </div>
                </div>
            </div>

            <form id="measures_form" class="survey-form p-3 border rounded shadow-sm bg-light" style="display: none;">
                <div class="mb-3">
                    <label for="measure_select_construct" class="form-label fw-bold">Add the name of the construct:</label>
                    <input type="text" class="form-control" id="measure_select_construct" name="measure_select_construct">
                    <small class="form-text text-muted fst-italic ms-1">Use broad terms like "intelligence" or "extraversion".</small>
                </div>    
            
                <div class="mb-3">
                    <label for="measure_input_details" class="form-label fw-bold">Add any additional variables you measured in the study:</label>
                    <input type="text" class="form-control" id="measure_input_details" name="measure_input_details">
                    <small class="form-text text-muted fst-italic ms-1">Be detailed! This can include the scale used: "APM Performance" or "BFI-2-XS".</small>
                </div>

                <div class="mb-3">
                    <button type="button" onclick="addMeasureToList()" class="btn btn-warning text-secondary">Add Measure</button>
                </div>

                <div class="mb-3" id="measures_list" style="display: none;">
                    <label class="form-label fw-bold">List of Measures:</label>
                    <ul id="measuresList" class="list-group ps-3"></ul>
                </div>
            </form>

            <button type="submit" class="btn btn-success" id="submit-button">Submit</button>
        </div>
    `;

    // Toggle visibility of measures form
    document.querySelectorAll('input[name="additional_measures"]').forEach((elem) => {
        elem.addEventListener('change', function() {
            const measuresForm = document.getElementById('measures_form');
            measuresForm.style.display = (this.value == 1) ? 'block' : 'none';
        });
    });

    // Prepopulate form if data exists
    if (measurement_data.additional_measures == 0) {
        document.getElementById("measures_list").style.display = "none";
    } else if (measurement_data.validated == 1 && measurement_data.measures.length > 0) {
        document.getElementById("measures_form").style.display = "block";
        document.getElementById("measures_list").style.display = "block";

        var measuresList = document.getElementById("measuresList");
        measurement_data.measures.forEach(function(measure) {
            var li = document.createElement("li");
            li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
            li.textContent = `Construct: ${measure.construct}, Details: ${measure.details}`;

            add_delete_button_to_list_item(li);
            measuresList.appendChild(li);
        });
    }

    // Submit handler
    document.getElementById('submit-button').addEventListener('click', function(event) {
        event.preventDefault();
        if (validateMeasurementData(collectMeasurementData()) || control.testing) {
            updateMeasurementSurvey(control, publication_idx, study_idx);
        }
    });

}

function collectMeasurementData(){
    var measures = [];
    // Get the measure list items
    var listItems = document.getElementById("measuresList").getElementsByTagName("li");
    var measures = [];
    for (var i = 0; i < listItems.length; i++) {
        var measureText = listItems[i].childNodes[0].nodeValue;
        var measureParts = measureText.split(", Details: ");
        var measureConstruct = measureParts[0].replace("Construct: ", "").trim();
        var measureDetails = measureParts[1].trim();
        measures.push({ construct: measureConstruct, details: measureDetails });
    }

    const measurement_data = {
        measures: measures,
        additional_measures: getRadioButtonSelection("additional_measures")
    };

    return measurement_data
}

function validateMeasurementData(measurement_data){
    clearValidationMessages();
    var alert_message = 'This field does not match validation criteria.';

    // Check if the user selected whether they collected additional measures
    if (measurement_data.additional_measures === null) {
        alert_message = 'Please select whether you collected any additional measures.';
        displayValidationError("additional_measures", alert_message);
        return false;
    }

    if (measurement_data.additional_measures == 0) {
        // Check if the list of measures is empty
        if (measurement_data.measures.length != 0) {
            alert_message = 'Remove all measures if you did not collect any additional measures.'

            document.getElementById("measures_form").style.display = "block";
            document.getElementById("measures_list").style.display = "block";
            displayValidationError("measuresList", alert_message);
            return false;
        }
        return true
    }

    // Check if the list of measures is empty
    if (measurement_data.measures.length === 0) {
        alert_message = 'Please add at least one measure.'
        displayValidationError("measure_input_details", alert_message);
        displayValidationError("measure_input_construct", alert_message);
        return false;
    }

    return true;
}

function updateMeasurementSurvey(control, publication_idx, study_idx){
    const measurement_data = collectMeasurementData();
    measurement_data.validated = true;

    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].measurement_data = measurement_data;

    // Optionally, display a confirmation message
    showAlert('Survey submitted successfully!', 'success');

    // Add a checkmark to the currently selected sidebar item
    const item_id =  "measures-" + publication_idx + "-" + study_idx;
    addGreenCheckmarkById(item_id);
}

function addMeasureToList() {
    const constructSelect = document.getElementById('measure_select_construct');
    const detailsInput = document.getElementById('measure_input_details');

    let construct = constructSelect.value;
    if (construct === 'other') {
        construct = constructInput.value.trim();
    }

    if (construct === "" || detailsInput.value.trim() === "") {
        showAlert("Please fill in both the construct and details.", 'warning');
        return;
    }

    const li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    li.textContent = `Construct: ${construct}, Details: ${detailsInput.value}`;

    add_delete_button_to_list_item(li);

    const listContainer = document.getElementById("measuresList");
    listContainer.appendChild(li);

    // ✅ Make the list visible if hidden
    document.getElementById("measures_list").style.display = "block";

    // Clear the input fields
    constructSelect.value = "";
    detailsInput.value = "";
}
