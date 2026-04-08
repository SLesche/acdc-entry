function addOverview(control) {
    // Create a new list item for the dataset
    const listItem = document.createElement("li");
    listItem.className = "collapsible collapsible-nocontent";

    // Create a span for the dataset name
    const span = document.createElement("span");
    span.textContent = "Overview";

    // Append the span and actions to the list item
    listItem.appendChild(span);

    // Create a nested list for raw data
    const nestedList = document.createElement("ul");

    // Append the nested list to the dataset item
    listItem.appendChild(nestedList);

    // Append the new list item to the sidebar
    document.getElementById("sidebarList").appendChild(listItem);

    // Update content area
    span.addEventListener("click", function(event) {
        event.stopPropagation(); // Prevent the collapsible toggle
        generateOverviewPage(control);
    });
}

function generateOverviewPage(control) {
    document.getElementById("content").innerHTML = `
        <div class = "display-text">
            <h1 class = "mb-3">Attentional Control Data Collection (ACDC) Data Submission Page</h1>
            <p>Thank you for contributing to our growing database of attentional control research. By entering your data here, you help make research more accessible and reusable for everyone.</p>
            <p>You can download and explore the dataset under this <a href="https://www.uni-potsdam.de/en/psych-methods/research/attentional-control-data-collection" target="_blank">link</a>.</p>
            <p>On the side, you find a navigation page to enter your data. We recommend you start with "Publication" to provide general information about the publication, then move on to "Tasks" in order register the tasks you used in your publication. You may add as many studies and datasets in your publication as you wish.</p>
            
            <div class="alert alert-info" role="alert">
                <h5 class="alert-heading"><i class="bi bi-info-circle me-2"></i>Before You Begin</h5>

                <p>In order to properly integrate your data into our database, we ask you to follow our instructions precisely. Importantly, this includes our restrictions placed on the uploaded data. Make sure that your column names match ours exactly and that the identifiers in the raw data match those you enter in the respective overview surveys.</p>
                <p>When you are finished with your data entry, please click on the "Submit Data" button. To save and restore your unsaved work, use the "Save Progress" and "Upload Progress" buttons.</p>
                <p>After submission, send the downloaded .json files to us via email with the subject "ACDC Submission". Our team will review your data and add it to the database as soon as possible.</p>
            </div>

            ${printProgressReport(getNumberOfSubmissions(control))}

             <div class="my-4">
                <h2>Save / Load / Submit</h2>
                <div class="d-flex gap-2 flex-wrap">
                    <button class="btn btn-info" onclick="saveProgress(control)">
                        <i class="bi bi-save"></i> Save Progress
                    </button>

                    <button class="btn btn-warning" id="uploadProgressButton">
                        <i class="bi bi-upload"></i> Upload Progress
                    </button>

                    <button class="btn btn-success" onclick="submitData(control)" id="final-submit-button">
                        <i class="bi bi-check-circle"></i> Submit Data
                    </button>

                    <input type="file" id="progressFileInput" accept=".json" style="display: none;">
                </div>
            </div>

            
            <h2>Contact Information</h2>
            <p>If you have any questions or need assistance, feel free to contact us at: <br>
                <a href="#" id="email1">[email protected]</a>
            </p>
        </div>
    `;

    document.getElementById('uploadProgressButton').addEventListener('click', function() {
        document.getElementById('progressFileInput').click();
    });

    const user = 'julia.haaf';
    const domain = 'uni-potsdam.de';
    const email = `${user}@${domain}`;
    const link = document.getElementById('email1');
    link.href = `mailto:${email}`;
    link.textContent = email;

    document.getElementById('progressFileInput').addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const progressData = JSON.parse(e.target.result);

                if (progressData.progress_file) {
                    // Simulate Clicks on Add Study and StatementSet
                    initializeNavbarFromProgress(progressData);
                    // Override the existing control object
                    Object.assign(control, progressData);
                    addCheckmarksFromProgress(control);
                    // initializePublicationSurvey(control); // Initialize the publication survey with the updated control object
                    // console.log(control);
                } else {
                    showAlert("Invalid progress file. Please upload a valid progress file.", 'danger');
                }
            };
            reader.readAsText(file);
        }
    });
}

function getNumberOfSubmissions(control) {
    const num_total_publications = Object.keys(control.publication_info).length;
    const num_tasks = Object.keys(control.task_info).length;
    let num_total_studies = 0;

    let num_tasks_validated = 0;
    let num_publications_validated = 0;
    let num_studies_validated = 0;
    let num_raw_data_validated = 0;
    let num_raw_data = 0;

    let total_checkpoints = 0;
    let validated_checkpoints = 0;

    // Iterate over task sets
    for (let task_idx = 0; task_idx < num_tasks; task_idx++) {
        total_checkpoints++; // For the task set itself
        if (control.task_info[task_idx].task_data.validated) {
            num_tasks_validated += 1;
            validated_checkpoints++;
        }
    }

    // Iterate over publications
    for (let publication_idx in control.publication_info) {
        const current_num_studies = Object.keys(control.publication_info[publication_idx].study_info).length;
        num_total_studies += current_num_studies;
        total_checkpoints++;

        // Iterate over studies within the publication
        for (let study_idx in control.publication_info[publication_idx].study_info) {
            // Check if the study is validated
            total_checkpoints++;

            if (control.publication_info[publication_idx].study_info[study_idx].study_data.validated) {
                num_studies_validated += 1;
                validated_checkpoints++;
            }        

            for (let dataset_idx in control.publication_info[publication_idx].study_info[study_idx].dataset_info) {
                num_raw_data += 1;
                total_checkpoints++;
                if (control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx].raw_data.validated) {
                    num_raw_data_validated += 1;
                    validated_checkpoints++;
                }
            }
        }

        // Check if the publication is validated
        if (control.publication_info[publication_idx].publication_data.validated) {
            num_publications_validated += 1;
            validated_checkpoints++;
        }
    }

    // Compute percentages
    const percent_tasks_validated = (num_tasks_validated / num_tasks) * 100;
    const percent_publication_validated = (num_publications_validated / num_total_publications) * 100;
    const percent_studies_validated = (num_studies_validated / num_total_studies) * 100;
    const percent_datasets_validated = (num_raw_data_validated / num_raw_data) * 100;
    const percent_overall_validated = (validated_checkpoints / total_checkpoints) * 100;

    return {
        num_total_publications,
        num_tasks,
        num_total_studies,
        num_tasks_validated,
        num_publications_validated,
        num_studies_validated,
        percent_tasks_validated,
        percent_publication_validated,
        percent_studies_validated,
        percent_overall_validated,
        validated_checkpoints,
        total_checkpoints,
        num_raw_data_validated,
        num_raw_data,
        percent_datasets_validated
    };
}
function printProgressReport(progress_report) {
    return `
        <div class="progress-report card my-4">
            <div class="card-body">
                <h2 class="card-title">Progress Report</h2>

                <div class="mb-3">
                    <label><strong>Publications Validated:</strong> ${progress_report.num_publications_validated} / ${progress_report.num_total_publications}</label>
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped bg-primary" role="progressbar"
                            style="width: ${progress_report.percent_publication_validated.toFixed(1)}%;"
                            aria-valuenow="${progress_report.percent_publication_validated.toFixed(1)}"
                            aria-valuemin="0" aria-valuemax="100">
                            ${progress_report.percent_publication_validated.toFixed(1)}%
                        </div>
                    </div>
                </div>

                <div class="mb-3">
                    <label><strong>Studies Validated:</strong> ${progress_report.num_studies_validated} / ${progress_report.num_total_studies}</label>
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped bg-info" role="progressbar"
                            style="width: ${progress_report.percent_studies_validated.toFixed(1)}%;"
                            aria-valuenow="${progress_report.percent_studies_validated.toFixed(1)}"
                            aria-valuemin="0" aria-valuemax="100">
                            ${progress_report.percent_studies_validated.toFixed(1)}%
                        </div>
                    </div>
                </div>

                <div class="mb-3">
                    <label><strong>Tasks Validated:</strong> ${progress_report.num_tasks_validated} / ${progress_report.num_tasks}</label>
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped bg-info" role="progressbar"
                            style="width: ${progress_report.percent_tasks_validated.toFixed(1)}%;"
                            aria-valuenow="${progress_report.percent_tasks_validated.toFixed(1)}"
                            aria-valuemin="0" aria-valuemax="100">
                            ${progress_report.percent_tasks_validated.toFixed(1)}%
                        </div>
                    </div>
                </div>

                <div class="mb-3">
                    <label><strong>Datasets Validated:</strong> ${progress_report.num_raw_data_validated} / ${progress_report.num_raw_data}</label>
                    <div class="progress">
                        <div class="progress-bar progress-bar-striped bg-warning" role="progressbar"
                            style="width: ${progress_report.percent_datasets_validated.toFixed(1)}%;"
                            aria-valuenow="${progress_report.percent_datasets_validated.toFixed(1)}"
                            aria-valuemin="0" aria-valuemax="100">
                            ${progress_report.percent_datasets_validated.toFixed(1)}%
                        </div>
                    </div>
                </div>

                <hr>

                <div class="mb-3">
                    <label><strong>Overall Progress:</strong> ${progress_report.validated_checkpoints || 0} / ${progress_report.total_checkpoints || 0}</label>
                    <div class="progress">
                        <div class="progress-bar bg-success" role="progressbar"
                            style="width: ${(progress_report.percent_overall_validated || 0).toFixed(1)}%;"
                            aria-valuenow="${(progress_report.percent_overall_validated || 0).toFixed(1)}"
                            aria-valuemin="0" aria-valuemax="100">
                            ${(progress_report.percent_overall_validated || 0).toFixed(1)}%
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;
}