function addMeasurement(parentElement, control, publication_idx, study_idx) {
    const measurement_name = "Additional Measurements";

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
        createNoMeasuresButton(control, publication_idx, study_idx);
    });
}

function initializeMeasurementSurvey(control, publication_idx, study_idx){
    const measurement_data = control.publication_info[publication_idx].study_info[study_idx].measurement_data;
    const study_name = control.publication_info[publication_idx].study_info[study_idx].study_name;

    document.getElementById("content").innerHTML = `
    <div class="display-text">
        <h1>${study_name}: Additional Measurments</h1> 
        <p>In this section, we want to know if you collected any additional measurements beyond the primary variables of your study. This information is valuable for helping others identify datasets that include external variables they may be interested in.</p>
        <p>To make the data more searchable and easier to navigate, we encourage you to use broad construct terms, such as "extraversion," "intelligence," or "anxiety," rather than specific test batteries or questionnaires. This ensures that others can quickly find relevant data based on common constructs rather than being limited by specific measurement tools.</p>
        <p>By providing this information, you contribute to a more comprehensive and accessible dataset, enabling others to explore connections between truth ratings and various other factors.</p>

        <div id="noinfo-container"></div>

        <form id="measurementSurvey">                    
            <label for="measure_input_details" class="survey-label">Add any additional variables you measured in the study:</label>
            <input type="text" id="measure_input_details" name="measure_input_details"><br>
            <p class="survey-label-additional-info">This can be detailed and may include the scale used to measure the variable: "APM Performance" or "BFI-2-XS".</p>

            <label for="measure_input_construct" class="survey-label">Add the name of the construct:</label>
            <input type="text" id="measure_input_construct" name="measure_input_construct"><br>
            <p class="survey-label-additional-info">This should be the broad constructs: "intelligence" or "extraversion".</p>

            <button type="button" onclick="addMeasureToList()" class="add-button">Add Measure</button><br><br>

            <label class="survey-label" id = "measures_list" style = "display: none;">List of Measures:</label>
            <ul id="measuresList" class = "list-of-entries"></ul>
            <button type="submit" class="survey-button">Submit</button>
        </form>
    </div>
    `;

    // Display previous submission if available
    if (measurement_data && measurement_data.measures) {
        document.getElementById("measures_list").style.display = "block";

        var measuresList = document.getElementById("measuresList");
        measurement_data.measures.forEach(function(measure) {
            var li = document.createElement("li");
            li.textContent = `Construct: ${measure.construct}, Details: ${measure.details}`;

            var removeButton = document.createElement("button");
            removeButton.innerHTML = '&times;'; // Red X
            removeButton.classList.add('delete-button');
            removeButton.onclick = function() {
                this.parentElement.remove();
            };

            li.appendChild(removeButton);
            measuresList.appendChild(li);
        });
    }

    // Add event listener to the form's submit button
    document.getElementById('measurementSurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        if (validateMeasurementData(collectMeasurementData()) || control.testing) {
            updateMeasurementSurvey(control, publication_idx, study_idx);
        }
    });
}


function createNoMeasuresButton(control, publication_idx, study_idx) {
    const measurement_data = control.publication_info[publication_idx].study_info[study_idx].measurement_data;

    // Create button element
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'noinfo-button';
    button.textContent = 'We do not have access to statement-level information.';
    
    // Set initial state
    let isActive = false;

    // If the user selects that they do not have access to statement-level information, activate the button
    if (measurement_data.validated == 1 && measurement_data.measures == 0) {
        console.log("Set to active")
        isActive = true;
        button.classList.add('active');
    }

    // Set onclick handler
    button.onclick = function() {
        isActive = !isActive;
        button.classList.toggle('active', isActive);
        noMeasures(control, publication_idx, study_idx);
    };

    // Append button to the desired container
    const container = document.getElementById('noinfo-container'); // Replace with the actual container ID
    if (container) {
        container.appendChild(button);
    } else {
        console.error('Container element not found.');
    }
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
    };

    return measurement_data
}


function addMeasureToList() {
    // Get the measure input value
    var measureInputDetails = document.getElementById("measure_input_details").value;
    var measureInputConstruct = document.getElementById("measure_input_construct").value;

    if (measureInputDetails !== "" && measureInputConstruct !== "") {
        // Create a new list item
        var li = document.createElement("li");
        li.textContent = `Construct: ${measureInputConstruct}, Details: ${measureInputDetails}`;

        add_delete_button_to_list_item(li);

        // Append the list item to the measures list
        document.getElementById("measuresList").appendChild(li);

        // Clear the input field after adding the measure
        document.getElementById("measure_input_construct").value = "";
        document.getElementById("measure_input_details").value = "";

        document.getElementById("measures_list").style.display = "block";

    } else {
        alert("Please enter a measure.");
    }

}

function validateMeasurementData(measurement_data){
    clearValidationMessages();
    var alert_message = 'This field does not match validation criteria.';


    if (getRadioButtonSelection("no_additional_measures") == 1) {
        // Check if the list of measures is empty
        if (measurement_data.measures.length != 0) {
            alert_message = 'Remove all measures if you did not collect any additional measures.'
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
    alert('Survey submitted successfully!');

    // Add a checkmark to the currently selected sidebar item
    const item_id =  "measures-" + publication_idx + "-" + study_idx;
    addGreenCheckmarkById(item_id);
}

function noMeasures(control, publication_idx, study_idx){
    const measurement_data = {
        measures: '',
        validated: true,
    };

    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].measurement_data = measurement_data;

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');

    // Add a checkmark to the currently selected sidebar item
    const item_id =  "measures-" + publication_idx + "-" + study_idx;
    addGreenCheckmarkById(item_id);
}