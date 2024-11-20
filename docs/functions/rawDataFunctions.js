function addRawData(parentElement, control, publication_idx, study_idx) {
    // Create a new list item for the dataset
    const dataset_idx = getNewId(control.publication_info[publication_idx].study_info[study_idx].dataset_info);
    const dataset_name = "Raw Data " + (dataset_idx + 1);
    control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx] = setupDatasetInfo(dataset_idx);

    const listItem = document.createElement("li");
    listItem.className = "collapsible";
    listItem.dataset.index = "rawdata-" + publication_idx + "-" + study_idx + "-" + dataset_idx;
    listItem.id = "rawdata-" + publication_idx + "-" + study_idx + "-" + dataset_idx;


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
        initializeRawDataSurvey(control, publication_idx, study_idx, dataset_idx);
    });

    // Add raw data survey
    addWithinData(nestedList, control, publication_idx, study_idx, dataset_idx);
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
                <li><strong>presentation_identifier:</strong> A unique identifier for each presentation condition. This must be one of the identifiers encoded in "Statement Presentations".</li>
                <li><strong>trial:</strong> A unique identifier for each trial for a given subject.</li>
                <li><strong>within_identifier:</strong> A unique identifier for a within subject conditions. This must be one of the identifiers encoded in "Experimental Conditions".</li>
                <li><strong>between_identifier:</strong> A unique identifier for a between subject conditions. This must be one of the identifiers encoded in "Experimental Conditions".</li>
                <li><strong>statement_identifier:</strong> A unique identifier for each statement used. This must be one of the identifiers encoded in the "Statementset" data you uploaded.</li>
                <li><strong>response:</strong> The value of the truth rating. <b>Larger values must indicate higher truth ratings.</b></li>
                <li><strong>repeated:</strong> The value indicating whether a statement was repeated "1" or not "0".</li>
                <li><strong>certainty:</strong> (if measured) The value indicating the subjective certainty with which a participant gave their truth rating.</li>
                <li><strong>rt:</strong> (if measured) The value indicating the response time <b>in seconds</b>.</li>
            </ul>
            <div class = "table-container" id = "tableContainerExample">
                <table>
                    <tr>
                        <th>subject</th>
                        <th>presentation_identifier</th>
                        <th>trial</th>
                        <th>within_identifier</th>
                        <th>between_identifier</th>
                        <th>statement_identifier</th>
                        <th>rt</th>
                        <th>response</th>
                        <th>repeated</th>
                        <th>certainty</th>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>0.64</td>
                        <td><i>NA</i></td>
                        <td>0</td>
                        <td>2</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>1</td>
                        <td>2</td>
                        <td>2</td>
                        <td>1</td>
                        <td>2</td>
                        <td>0.75</td>
                        <td>7</td>
                        <td>1</td>
                        <td>7</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>2</td>
                        <td>1</td>
                        <td>0.75</td>
                        <td>1</td>
                        <td>1</td>
                        <td>3</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>1</td>
                        <td>2</td>
                        <td>2</td>
                        <td>2</td>
                        <td>2</td>
                        <td>0.76</td>
                        <td>5</td>
                        <td>1</td>
                        <td>6</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>2</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>1</td>
                        <td>0.64</td>
                        <td>3</td>
                        <td>0</td>
                        <td>2</td>
                    </tr>
                    <tr>
                        <td>1</td>
                        <td>2</td>
                        <td>2</td>
                        <td>2</td>
                        <td>1</td>
                        <td>2</td>
                        <td>0.75</td>
                        <td>7</td>
                        <td>1</td>
                        <td>7</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>2</td>
                        <td>1</td>
                        <td>1</td>
                        <td>2</td>
                        <td>1</td>
                        <td>0.75</td>
                        <td>1</td>
                        <td>1</td>
                        <td>3</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>2</td>
                        <td>2</td>
                        <td>2</td>
                        <td>2</td>
                        <td>2</td>
                        <td>0.76</td>
                        <td>5</td>
                        <td>1</td>
                        <td>6</td>
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
        const allow_submission = checkOtherSubmissions(control, publication_idx, study_idx);
        if (allow_submission) {
            const collected_data = await collectRawData();
            if (validateRawData(collected_data, control, publication_idx, study_idx) || control.testing){
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

function validateRawData(raw_data, control, publication_idx, study_idx) {
    var alert_message = '';

    if (!raw_data.raw_data_file) {
        alert_message = 'Please upload a file containing the raw data.';
        displayValidationError('raw_data_file', alert_message);
        return false;
    }
 
    var required_headers = ['subject', 'presentation_identifier', 'trial', 'response', 'repeated'];

    return true;
}

function checkOtherSubmissions(control, publication_idx, study_idx) {
    const study_info = control.publication_info[publication_idx].study_info[study_idx];
    const statementset_name = study_info.study_data.statementset_name;

    // Example usage:
    const statementset_index = getStatementSetIndex(statementset_name);

    // if index is null, return false
    if (statementset_index === null && statementset_name !== "no information") {
        var statementset_validated = false;
    } else if (statementset_name === "no information") {
        var statementset_validated = true;
    } else {
        var statementset_validated = control.statementset_info[statementset_index].statementset_data.validated;
    }
    
    if (!statementset_validated || !study_info.condition_data.validated || !study_info.repetition_data.validated || !study_info.study_data.validated) {
        // Display which sections are missing
        if (!study_info.study_data.validated) {
            alert('Please enter information about the overall study before submitting the raw data.')
            return false;
        }
        if (!study_info.condition_data.validated) {
            alert('Please enter information about the experimental conditions before submitting the raw data.');
            return false;
        }
        if (!study_info.repetition_data.validated) {
            alert('Please enter information about the statement presentations before submitting the raw data.')
            return false;
        }
        if (!statementset_validated) {
            alert('Please enter information about the statement set before submitting the raw data.');
            return false;
        }
    }

    return true;
}
async function updateRawDataSurvey(control, publication_idx, study_idx, dataset_idx) {
    raw_data = await collectRawData();

    raw_data.validated = true;

    // Store the values in the control object
    control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].raw_data = raw_data

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
