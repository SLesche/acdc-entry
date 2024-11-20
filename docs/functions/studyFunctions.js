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
    addDatasetButton.textContent = "+ Add Dataset";
    addDatasetButton.onclick = function() {
        addRawData(nestedList, control, publication_idx, study_idx);
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
    addRawData(nestedList, control, publication_idx, study_idx);
    
}

function initializeStudySurvey(control, publication_idx, study_idx) {
    const study_data = control.publication_info[publication_idx].study_info[study_idx].study_data;
    const study_name = control.publication_info[publication_idx].study_info[study_idx].study_name;

    document.getElementById("content").innerHTML = `
    <div class="display-text">
        <h1>${study_name}</h1>
        <p>This section is designed to collect key details about the study you conducted. The information you provide here will help us better understand the scope and methodology of your research. You'll be asked about how you measured truth ratings, what other measures were included in your study, the types of analysis you performed, and the specific statements or stimuli used in your research.</p>
        <p>If your study is available on an open-source platform, you’ll also have the option to share a link, ensuring that others can access the full study for further exploration.</p>
        <p>This information is crucial for ensuring that your study is well-documented and can be effectively integrated into our database. Thank you for taking the time to provide these details.</p>

        <form id="studySurvey" class="survey-form">
            <label for="truth_rating_scale" class="survey-label">With what scale did you measure the truth rating of a statement?</label>
            <div class="radio-buttons" id = "truth_rating_scale">
                <input type="radio" id="dichotomous" name="truth_rating_scale" value="dichotomous" ${study_data.truth_rating_scale === 'dichotomous' ? 'checked' : ''}>
                <label for="dichotomous">Dichotomous</label>
                <input type="radio" id="likert" name="truth_rating_scale" value="likert" ${study_data.truth_rating_scale === 'likert' ? 'checked' : ''}>
                <label for="likert">Likert</label>
                <input type="radio" id="range" name="truth_rating_scale" value="range" ${study_data.truth_rating_scale === 'range' ? 'checked' : ''}>
                <label for="range">Range</label>
                <input type="radio" id="other" name="truth_rating_scale" value="other" ${study_data.truth_rating_scale === 'other' ? 'checked' : ''}>
                <label for="other">Other</label><br>
            </div>
            <fieldset id="other_rating_scale_fieldset" ${study_data.truth_rating_scale === 'other' ? '' : 'disabled'}>
                <div class="form-item">
                    <label for="truth_rating_scale_details" class="survey-label">Please provide further details:</label>
                    <input type="text" id="truth_rating_scale_details" name="truth_rating_scale_details" value="${study_data.truth_rating_scale_details || ''}"/>
                </div>
            </fieldset>

            <label for="truth_rating_steps" class="survey-label">How many steps did your rating scale have?</label>
            <input type="number" id="truth_rating_steps" name="truth_rating_steps" value="${study_data.truth_rating_steps || ''}"><br>
            <p class="survey-label-additional-info">For example, a 7-point Likert Scale would have 7 steps.</p>

            <label for="statementset_name" class="survey-label">Select the statement set used:</label>
            <select id="statementset_name" name="statementset_name">
                <option value="">Select a statement set</option>
                <!-- Options will be populated dynamically -->
            </select><br>
            <p class="survey-label-additional-info">Navigate to "Sets of Statements" in the side-panel and add a statement set if you do not see your statement set here.</p>


            <label for="subjective_certainty" class="survey-label">Was subjective certainty measured?</label>
            <div class="radio-buttons" id = "subjective_certainty">
                <label><input type="radio" name="subjective_certainty" value="1" ${study_data.subjective_certainty == 1 ? 'checked' : ''}/>Yes</label>
                <label><input type="radio" name="subjective_certainty" value="0" ${study_data.subjective_certainty == 0 ? 'checked' : ''}/>No</label>
            </div>

            <label for="rt_measured" class="survey-label">Did you measure response time?</label>
            <div class="radio-buttons" id = "rt_measured">
                <label><input type="radio" name="rt_measured" value="1" ${study_data.rt_measured == 1 ? 'checked' : ''}/>Yes</label>
                <label><input type="radio" name="rt_measured" value="0" ${study_data.rt_measured == 0 ? 'checked' : ''}/>No</label>
            </div>

            <fieldset id="rtMeasuredFieldset" ${study_data.rt_measured == 1 ? '' : 'disabled'}>
                <label for="rt_onset" class="survey-label">What event marked the onset of response time measurement?</label>
                <select id="rt_onset" name="rt_onset">
                    <option value="stimulus_onset" ${study_data.rt_onset === 'stimulus_onset' ? 'selected' : ''}>Stimulus Onset</option>
                    <option value="probe_onset" ${study_data.rt_onset === 'probe_onset' ? 'selected' : ''}>Probe Onset</option>
                    <option value="other" ${study_data.rt_onset === 'other' ? 'selected' : ''}>Other</option>
                </select><br>
            </fieldset>

            <label for="n_participants" class="survey-label">How many participants took part in your study?</label>
            <input type="number" step="1" id="n_participants" name="n_participants" value="${study_data.n_participants || ''}"><br>
            <p class="survey-label-additional-info">Enter the number of valid participants after exclusion of outliers and bad data.</p>

            <label for="participant_age" class="survey-label">Was was the average age of your participants?</label>
            <input type="number" step="0.01" id="participant_age" name="participant_age" value="${study_data.participant_age || ''}"><br>

            <label for="percentage_female" class="survey-label">What percentage of your participants was female?</label>
            <input type="number" step="0.01" id="percentage_female" name="percentage_female" value="${study_data.percentage_female || ''}"><br>
            <p class="survey-label-additional-info">If 50% of your participants was female, enter "50".</p>

            <label for "secondary_tasks" class="survey-label">Did your participants complete any secondary (distracting) tasks between exposure and test sessions?</label>
            <div class="radio-buttons" id = "secondary_tasks">
                <label><input type="radio" name="secondary_tasks" value="1" ${study_data.secondary_tasks == 1 ? 'checked' : ''}/>Yes</label>
                <label><input type="radio" name="secondary_tasks" value="0" ${study_data.secondary_tasks == 0 ? 'checked' : ''}/>No</label>
            </div>

            <fieldset id="secondaryTaskFieldset" ${study_data.secondary_tasks == 1 ? '' : 'disabled'}>
                <label for="secondary_task_type" class="survey-label">What type of secondary task did the participants complete (verbal/numeric/figural)?</label>
                 <div class="radio-buttons" id = "secondary_task_type">
                    <label><input type="radio" name="secondary_task_type" value="1" ${study_data.secondary_task_type == 1 ? 'checked' : ''}/>verbal</label>
                    <label><input type="radio" name="secondary_task_type" value="0" ${study_data.secondary_task_type == 0 ? 'checked' : ''}/>non-verbal</label>
                </div>
                <p class="survey-label-additional-info">If you employed multiple secondary tasks, select "verbal" if any of them were verbal.</p>
                
                <fieldset id="secondaryTaskTypeFieldset" ${study_data.secondary_task_type == 1 ? '' : 'disabled'}>
                    <label for="secondary_task_name" class="survey-label">What was the name of the secondary task employed?</label>
                    <input type="text" id="secondary_task_name" name="secondary_task_name" value="${study_data.secondary_task_name || ''}"><br>
                    <p class="survey-label-additional-info">If you employed multiple secondary tasks, list the names separated by commas, i.e. "Stroop Task, Simon Task"</p>
                </fieldset>
            </fieldset>

            <label for="physiological_measures" class="survey-label">Did you collect any physiological data?</label>
            <div class="radio-buttons" id = "physiological_measures">
                <label><input type="radio" name="physiological_measures" value="1" ${study_data.physiological_measures == 1 ? 'checked' : ''}/>Yes</label>
                <label><input type="radio" name="physiological_measures" value="0" ${study_data.physiological_measures == 0 ? 'checked' : ''}/>No</label>
            </div>

            <label for="cognitive_models" class="survey-label">Did you employ any cognitive models in your analysis?</label>
            <div class="radio-buttons" id = "cognitive_models">
                <label><input type="radio" name="cognitive_models" value="1" ${study_data.cognitive_models == 1 ? 'checked' : ''}/>Yes</label>
                <label><input type="radio" name="cognitive_models" value="0" ${study_data.cognitive_models == 0 ? 'checked' : ''}/>No</label>
            </div>

            <label for="open_data_link" class="survey-label">If available, provide the link to the data on an open access resource sharing platform.</label>
            <input type="text" id="open_data_link" name="open_data_link" value="${study_data.open_data_link || ''}"><br>

            <label for="study_comment" class="survey-label">Would you like to provide any additional information?</label>
            <textarea id="study_comment" name="study_comment" rows="4" cols="50">${study_data.study_comment || ''}</textarea><br>

            <button type="submit" class="survey-button">Submit</button>
        </form>
    </div>
    `;

    populateStatementSets(control, publication_idx, study_idx);

    // Add event listener to the within conditions radio buttons
    document.querySelectorAll('input[name="truth_rating_scale"]').forEach((elem) => {
        elem.addEventListener("change", function(event) {
            const fieldset = document.getElementById("other_rating_scale_fieldset");
            if (event.target.value == "other") {
                fieldset.disabled = false;
            } else {
                fieldset.disabled = true;
            }
        });
    });

    document.querySelectorAll('input[name="rt_measured"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('rtMeasuredFieldset').disabled = this.value == '0';
        });
    });

    document.querySelectorAll('input[name="secondary_tasks"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('secondaryTaskFieldset').disabled = this.value == '0';
        });
    });

    document.querySelectorAll('input[name="secondary_task_type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('secondaryTaskTypeFieldset').disabled = this.value == '0';
        });
    });

    // Add event listener to the form's submit button
    document.getElementById('studySurvey').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        if (validateStudyData(collectStudyData()) || control.testing){
            updateStudySurvey(control, publication_idx, study_idx);
        }
    });
}

function collectStudyData() {
    // Get values from the input fields
    const truth_rating_scale = getRadioButtonSelection('truth_rating_scale');
    const truth_rating_scale_details = truth_rating_scale == "other" ? document.getElementById('truth_rating_scale_details').value : '';
    const truth_rating_steps = document.getElementById('truth_rating_steps').value;
    const subjective_certainty = getRadioButtonSelection('subjective_certainty');
    const rt_measured = getRadioButtonSelection('rt_measured');
    const rt_onset = rt_measured == 1 ? document.getElementById('rt_onset').value : '';
    const n_participants = document.getElementById('n_participants').value;
    const participant_age = document.getElementById('participant_age').value;
    const percentage_female = document.getElementById('percentage_female').value;
    const physiological_measures = getRadioButtonSelection('physiological_measures');
    const cognitive_models = getRadioButtonSelection('cognitive_models');
    const open_data_link = document.getElementById('open_data_link').value;
    const study_comment = document.getElementById('study_comment').value;
    const statementset_name = document.getElementById('statementset_name').value;

    const secondary_tasks = getRadioButtonSelection('secondary_tasks');
    const secondary_task_type = secondary_tasks == 1 ? getRadioButtonSelection('secondary_task_type') : '';
    const secondary_task_name = secondary_tasks == 1 ? document.getElementById('secondary_task_name').value : '';

    // Store the values in the control object
    const study_data = {
        truth_rating_scale: truth_rating_scale,
        truth_rating_scale_details: truth_rating_scale_details,
        truth_rating_steps: truth_rating_steps,
        subjective_certainty: subjective_certainty,
        rt_measured: rt_measured,
        rt_onset: rt_onset,
        n_participants: n_participants,
        participant_age: participant_age,
        percentage_female: percentage_female,
        physiological_measures: physiological_measures,
        cognitive_models: cognitive_models,
        open_data_link: open_data_link,
        study_comment: study_comment,
        statementset_name: statementset_name,
        secondary_tasks: secondary_tasks,
        secondary_task_type: secondary_task_type,
        secondary_task_name: secondary_task_name,
    }

    return study_data;
}

function validateStudyData(study_data) {
    clearValidationMessages();

    var alert_message = 'This field does not match validation criteria.';
    // Check if any of the fields are empty

    var required_keys = [
        'truth_rating_scale', 'truth_rating_steps', 'subjective_certainty', 'rt_measured', 'participant_age', 'n_participants',
        'percentage_female', 'physiological_measures', 'cognitive_models', 'statementset_name', 'secondary_tasks',
    ];

    if (study_data.secondary_tasks == 1) {
        required_keys.push('secondary_task_type');
        if (study_data.secondary_task_type == 1) {
            required_keys.push('secondary_task_name');
        }
    }
    if (study_data.truth_rating_scale === 'other') {
        required_keys.push('truth_rating_scale_details');
    }
    if (study_data.rt_measured == 1) {
        required_keys.push('rt_onset');
    }

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
    alert('Survey submitted successfully!');

    // Add a checkmark to the currently selected sidebar item
    const item_id =  "study-" + publication_idx + "-" + study_idx;
    addGreenCheckmarkById(item_id);
}

function populateStatementSets(control, publication_idx, study_idx) {
    const statementSetSelect = document.getElementById('statementset_name');
    
    const study_data = control.publication_info[publication_idx].study_info[study_idx].study_data;

    // Clear existing options
    statementSetSelect.innerHTML = '';

    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a statement set';
    statementSetSelect.appendChild(defaultOption);

    // Add the option that they do not have a statement set	
    const noStatementSetOption = document.createElement('option');
    noStatementSetOption.value = 'no information';
    noStatementSetOption.textContent = 'No available information on the statements.';
    statementSetSelect.appendChild(noStatementSetOption);

    // Populate the drop-down with statement sets
    for (const key in control.statementset_info) {
        const option = document.createElement('option');
        option.value = control.statementset_info[key].statementset_name;
        option.textContent = control.statementset_info[key].statementset_name;
        statementSetSelect.appendChild(option);
    }

    // Set the default value
    if (study_data.statementset_name) {
        statementSetSelect.value = study_data.statementset_name;
    } else {
        statementSetSelect.value = ''; // Default to "Select a statement set" option
    }
}