function addRawData(parentElement, control, publication_idx, study_idx, dataset_idx) {
    // Create a new list item for the raw data
    const listItem = document.createElement("li");
    listItem.className = "collapsible-nocontent";
    listItem.dataset.index = "rawdata-" + publication_idx + "-" + study_idx + "-" + dataset_idx;
    listItem.id = "rawdata-" + publication_idx + "-" + study_idx + "-" + dataset_idx;

    // Create a span for the raw data name
    const span = document.createElement("span");
    span.textContent = "Raw Data";

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
        initializeRawDataSurvey(control, publication_idx, study_idx, dataset_idx);
    });
}

function initializeRawDataSurvey(control, publication_idx, study_idx, dataset_idx) {
    const raw_data = control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].raw_data;
    const study_name = control.publication_info[publication_idx].study_info[study_idx].study_name;

    document.getElementById("content").innerHTML = `
    <div class="display-text">
        <h1>${study_name}: Raw Data ${dataset_idx + 1}</h1> 
            <p>Here, please provide information about your raw data by uploading it through the interface below. Your data should adhere to the following guidelines:</p>
            <ul class = "list-of-entries">
                <li>Ensure that your dataset includes all columns as specified in the guidelines. If certain measurements (e.g., reaction times) were not collected, you may leave those columns out.</li>
                <li>It is crucial that the columns you do include have the exact names we specified. This consistency is essential for accurate integration and analysis.</li>
                <li>Make sure that your experimental conditions and statements used are using exactly the same identifiers as indicated in the "Experimental Conditions" and "Statementset" surveys. This ensures that your data can be correctly interpreted in the context of the study.</li>
                <li>For any missing values, please encode them as <i>NA</i>. For example, accuracy can only take the values "0", "1" or "<i>NA</i>". If you chose any other encodings to mark missing or incomplete values, please recode these to <i>NA</i>.</li>
            </ul>
            
            <p>Below, you can find an example of how your data should be formatted. Please follow this format to ensure compatibility and ease of use:</p>
            <ul class = "list-of-entries">
                <li><strong>subject:</strong> A unique identifier for each subject.</li>
                <li><strong>block:</strong> A unique identifier for each block for a given subject.</li>
                <li><strong>trial:</strong> A unique identifier for each trial for a given subject.</li>
                <li><strong>within_identifier:</strong> A unique identifier for a within subject conditions. This must be one of the identifiers encoded in "Within Conditions".</li>
                <li><strong>congruency:</strong> The value indicating the congruency condition. Must be "congruent", "incongruent", or "neutral".</li>
                <li><strong>accuracy:</strong> The value indicating the accuracy of the response "1" for correct and "0" for incorrect.</li>
                <li><strong>rt:</strong> The value indicating the response time <b>in seconds</b>.</li>
            </ul>
            <div class = "table-container" id = "tableContainerExample">
                <table>
                    <tr>
                        <th>subject</th>
                        <th>block</th>
                        <th>trial</th>
                        <th>within_identifier</th>
                        <th>congruency</th>
                        <th>accuracy</th>
                        <th>rt</th>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>congruent</td>
                        <td>0</td>
                        <td>0.64</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>2</td>
                        <td>1</td>
                        <td>incongruent</td>
                        <td>1</td>
                        <td>0.75</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>congruent</td>
                        <td>1</td>
                        <td>0.75</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>1</td>
                        <td>2</td>
                        <td>1</td>
                        <td>congruent</td>
                        <td>0</td>
                        <td>0.81</td>
                    </tr>
                </table>
            </div>         
            <p>Once you’ve prepared your data according to these specifications, you can upload it using the form provided below. Thank you for your cooperation!</p>
            <form id="rawDataSurvey" class="survey-form">
                <label for="raw_data_file" class="survey-label">Please upload a .csv file with the raw data in the correct format.</label>
                <input type="file" id="raw_data_file" name="raw_data_file" accept=".csv" required><br>
                <span id="file-name-display">${raw_data.raw_data_file ? `File: ${raw_data.raw_data_file.name}` : ''}</span><br>
                <p id = "textUploadPreview" style = "display: none;">Uploaded file preview:</p>
                <div id="tableContainerUploaded" class = "table-container" style = "display: none;">
                </div>
                <button type="submit" class="survey-button">Submit</button>
            </form>

        </form>
    </div>
    `;

    if (raw_data.validated) {
        const rows_to_display = 6;
        const html_table = createTableFromCSV(raw_data.data, rows_to_display);
    
        // Inject table into the table container
        document.getElementById('tableContainerUploaded').innerHTML = html_table;
        document.getElementById('tableContainerUploaded').style.display = 'block';
        document.getElementById('textUploadPreview').style.display = 'block';
    }

    // Add event listener to the file input to display the selected file name
    document.getElementById('raw_data_file').addEventListener('change', async function(event) {
        const fileNameDisplay = document.getElementById('file-name-display');
        if (event.target.files.length > 0) {
            fileNameDisplay.textContent = `File: ${event.target.files[0].name}`;
        } else {
            fileNameDisplay.textContent = '';
        }

        const raw_data = await collectRawData();
        const rows_to_display = 6;
        const html_table = createTableFromCSV(raw_data.data, rows_to_display);
        
        // Inject table into the table container
        document.getElementById('tableContainerUploaded').innerHTML = html_table;
        document.getElementById('tableContainerUploaded').style.display = 'block';
        document.getElementById('textUploadPreview').style.display = 'block';
    });

    document.getElementById('rawDataSurvey').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
        const allow_submission = checkOtherSubmissions(control, publication_idx, study_idx, dataset_idx);
        if (allow_submission) {
            const collected_data = await collectRawData();
            if (validateRawDataFile(collected_data, control, publication_idx, study_idx, dataset_idx) || control.testing){
                updateRawDataSurvey(control, publication_idx, study_idx, dataset_idx);
            }
        }
    });
}

async function collectRawData() {
    // Get values from the input fields
    const raw_data_file = document.getElementById('raw_data_file').files[0];

    if (raw_data_file) {
        try {
            const csv_data = await csvFileToObject(raw_data_file);

            raw_data = {
                raw_data_file: raw_data_file,
                data: csv_data,
            };

            // Display the updated file name in the submission box
            const fileNameDisplay = document.getElementById('file-name-display');
            if (raw_data_file) {
                fileNameDisplay.textContent = `File: ${raw_data_file.name}`;
            } else {
                fileNameDisplay.textContent = '';
            }

            return raw_data;
        } catch (error) {
            console.error('Error parsing CSV file:', error);
            // Handle error appropriately, e.g., show an error message to the user
        }
    }
}

function validateRawDataFile(raw_data, control, publication_idx, study_idx, dataset_idx) {
    var alert_message = '';

    if (!raw_data.raw_data_file) {
        alert_message = 'Please upload a file containing the raw data.';
        displayValidationError('raw_data_file', alert_message);
        return false;
    }
    
    const study_info = control.publication_info[publication_idx].study_info[study_idx];
    var required_headers = ['subject', 'block', 'trial', 'congruency', 'accuracy', 'rt'];

    if (!study_info.dataset_info[dataset_idx].within_data.has_within_conditions == 1){
        required_headers.push('within_identifier')
    }

    // Check if all required headers are present
    const data_columns = Object.keys(raw_data.data[0]);

    const missing_headers = required_headers.filter(header => !data_columns.includes(header));
    if (missing_headers.length > 0) {
        alert_message = `The following columns are missing from the uploaded file: ${missing_headers.join(', ')}.`;
        displayValidationError('raw_data_file', alert_message);
        return false;
    }

    // check for unknown columns
    const unknown_columns = data_columns.filter(header => !required_headers.includes(header));
    if (unknown_columns.length > 0) {
        alert_message = `The uploaded file contains unknown columns: ${unknown_columns.join(', ')}`;
        displayWarningMessage('raw_data_file', alert_message);
    }

    // if there were experimental conditions, check that all identifiers are present in the experimental conditions
    if (study_info.dataset_info[dataset_idx].within_data.has_within_conditions == 1) {
        const within_identifiers = [...new Set(raw_data.data.map(row => row.within_identifier).filter(identifier => identifier !== 'NA'))].map(String);

        // Check for missing within-subject condition identifiers
        const reported_within_identifiers = study_info.dataset_info[dataset_idx].within_data.within_condition_details.map(detail => detail.identifier);
        const missing_within_identifiers = reported_within_identifiers.filter(identifier => !within_identifiers.includes(identifier));
        
        // Check for extra within-subject condition identifiers
        const extra_within_identifiers = within_identifiers.filter(identifier => !reported_within_identifiers.includes(identifier));

        let alert_messages = [];

        if (missing_within_identifiers.length > 0) {
            alert_messages.push(`The following within-subject condition identifiers are missing from the uploaded file: ${missing_within_identifiers.join(', ')}.`);
        }

        if (extra_within_identifiers.length > 0) {
            alert_messages.push(`The following within-subject condition identifiers in the uploaded file were not previously added to the experimental conditions: ${extra_within_identifiers.join(', ')}.`);
        }

        if (alert_messages.length > 0) {
            displayValidationError('raw_data_file', alert_messages.join(' '));
            return false;
        }
    }

    const rts = raw_data.data.map(row => row.rt).filter(rt => rt !== 'NA');
    const average_rt = rts.reduce((a, b) => a + b) / rts.length;

    if (average_rt > 100) {
        alert_message = 'The average response time in the uploaded file is above 100. Please check if the data is in seconds.';
        displayWarningMessage('raw_data_file', alert_message);
    }

    // Check that accuracy is only 0, 1 or NA
    const accuracy_vals = raw_data.data.map(row => row.accuracy);
    const invalid_accuracy_vals = accuracy_vals.filter(val => val != '0' && val != '1' && val !== 'NA');
    if (invalid_accuracy_vals.length > 0) {
        alert_message = `The "accuracy" column contains invalid values: ${invalid_accuracy_vals.slice(0, 5).join(', ')}. It should only contain "0", "1", or "NA".`;
        displayValidationError('raw_data_file', alert_message);
        return false;
    }

    // Check that congruency is only congruent, incongruent, neutral, or NA
    const congruency_vals = raw_data.data.map(row => row.congruency);
    const invalid_congruency_vals = congruency_vals.filter(val => val != 'congruent' && val != 'incongruent' && val!= 'neutral' && val !== 'NA');
    if (invalid_congruency_vals.length > 0) {
        alert_message = `The "congruency" column contains invalid values: ${invalid_congruency_vals.slice(0, 5).join(', ')}. It should only contain "0", "1", or "NA".`;
        displayValidationError('raw_data_file', alert_message);
        return false;
    }

    return true;
}

function checkOtherSubmissions(control, publication_idx, study_idx, dataset_idx) {
    const study_info = control.publication_info[publication_idx].study_info[study_idx];
    const dataset_info = control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx];
    const task_name = dataset_info.dataset_data.task_name;
    const task_index = getStatementSetIndex(task_name);

    // if index is null, return false
    if (task_index === null && task_name !== "no information") {
        var task_validated = false;
    } else if (task_name === "no information") {
        var task_validated = true;
    } else {
        var task_validated = control.task_info[task_index].task_data.validated;
    }
    
    if (!task_validated || !dataset_info.within_data.validated || !study_info.study_data.validated || !dataset_info.dataset_data) {
        // Display which sections are missing
        if (!study_info.study_data.validated) {
            alert('Please enter information about the overall study before submitting the raw data.')
            return false;
        }
        if (!dataset_info.within_data.validated) {
            alert('Please enter information about the within conditions before submitting the raw data.');
            return false;
        }
        if (!dataset_info.dataset_data.validated) {
            alert('Please enter information about the dataset before submitting the raw data.')
            return false;
        }
        if (!task_validated) {
            alert('Please enter information about the task before submitting the raw data.');
            return false;
        }
    }

    return true;
}
async function updateRawDataSurvey(control, publication_idx, study_idx, dataset_idx) {
    raw_data = await collectRawData();

    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].raw_data.data = raw_data.data;
    control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].raw_data.raw_data_file = raw_data.raw_data_file;
    control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].raw_data.validated = true;

    // Optionally, display a confirmation message
    alert('Survey submitted successfully!');

    // Add a checkmark to the currently selected sidebar item
    const item_id =  "rawdata-" + publication_idx + "-" + study_idx + "-" + dataset_idx;
    addGreenCheckmarkById(item_id);

    const rows_to_display = 6;
    const html_table = createTableFromCSV(raw_data.data, rows_to_display);
    
    // Inject table into the table container
    document.getElementById('tableContainerUploaded').innerHTML = html_table;
    document.getElementById('tableContainerUploaded').style.display = 'block';
    document.getElementById('textUploadPreview').style.display = 'block';
}