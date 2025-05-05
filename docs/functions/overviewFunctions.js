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
            <h1>Welcome to the Attentional Control Data Collection (ACDC) Data Submission Page</h1>
            <p>Thank you for contributing to our growing database of attentional control research. By entering your data here, you help make research more accessible and reusable for everyone.</p>
            <p>You can download the dataset under this link: <a href="https://github.com/jstbcs/acdc-database" target="_blank">Dataset Link</a> and explore the dataset in this <a href="https://mfhcgn.shinyapps.io/acdc-database/" target="_blank">Shiny App</a></p>
            <p>On the side, you find a navigation page to enter your data. We recommend you start with "Publication" to provide general information about the publication, then move on to "Tasks" in order register the tasks you used in your publication. You may add as may studies and datasets in your publication as you wish.</p>
            <p>In order to properly integrate your data into our database, we ask you to follow our instructions precisely. Importantly, this includes our restrictions placed on the uploaded data. Make sure that your column names match ours exactly and that the identifiers in the raw data match those you enter in the respective overview surveys.</p>
            <p>When you are finished with your data entry, please click on the "Submit Data" button. To save and restore your unsaved work, use the "Save Progress" button.</p>
            <p>After submission, the website will attempt to download 2 files onto your downloads folder. One contains the final submission and the other is a backup of your submission progress. We ask you to send both of them to us via email to <a href="mailto:julia.haaf@uni-potsdam.de">julia.haaf@uni-potsdam.de</a> with the subject "ACDC Submission"</p>

            ${printProgressReport(getNumberOfSubmissions(control))}

            <h2>Save / Load progess</h2>
            <button onclick="saveProgress(control)">Save Progress</button>
            <button id="uploadProgressButton">Upload Progress</button>
            <input type="file" id="progressFileInput" accept=".json" style="display: none;">

            <h2>Submission</h2>
            <button onclick="submitData(control)" id ="final-submit-button">Submit Data</button>
            
            <h2>Contact Information</h2>
            <p>If you have any questions or need assistance, feel free to contact us at: <br>
                <a href="mailto:sven.lesche@psychologie.uni-heidelberg.de">sven.lesche@psychologie.uni-heidelberg.de</a><br>
                <a href="mailto:julia.haaf@uni-potsdam.de">julia.haaf@uni-potsdam.de</a>
            </p>
        </div>
    `;

    document.getElementById('uploadProgressButton').addEventListener('click', function() {
        document.getElementById('progressFileInput').click();
    });

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
                    alert("Invalid progress file. Please upload a valid progress file.");
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

    let num_statement_sets_validated = 0;
    let num_publications_validated = 0;
    let num_studies_validated = 0;

    // Iterate over task sets
    for (let task_idx = 0; task_idx < num_tasks; task_idx++) {
        if (control.task_info[task_idx].task_data.validated) {
            num_statement_sets_validated += 1;
        }
    }

    // Iterate over publications
    for (let publication_idx in control.publication_info) {
        const current_num_studies = Object.keys(control.publication_info[publication_idx].study_info).length;
        num_total_studies += current_num_studies;

        // Iterate over studies within the publication
        for (let study_idx in control.publication_info[publication_idx].study_info) {
            // Check if the study is validated
            if (control.publication_info[publication_idx].study_info[study_idx].study_data.validated) {
                num_studies_validated += 1;
            }        
        }

        // Check if the publication is validated
        if (control.publication_info[publication_idx].publication_data.validated) {
            num_publications_validated += 1;
        }
    }

    // Compute percentages
    const percent_statement_sets_validated = (num_statement_sets_validated / num_tasks) * 100;
    const percent_publication_validated = (num_publications_validated / num_total_publications) * 100;
    const percent_studies_validated = (num_studies_validated / num_total_studies) * 100;

    return {
        num_total_publications,
        num_tasks,
        num_total_studies,
        num_statement_sets_validated,
        num_publications_validated,
        num_studies_validated,
        percent_statement_sets_validated,
        percent_publication_validated,
        percent_studies_validated,
    };
}

function printProgressReport(progress_report){
    html = `
        <div class="progress-report">
            <h2>Progress Report</h2>
            <p>Total Publications: ${progress_report.num_total_publications}</p>
            <p>Total Statement Sets: ${progress_report.num_statement_sets}</p>
            <p>Total Studies: ${progress_report.num_total_studies}</p>
            <p>Publications Validated: ${progress_report.num_publications_validated}</p>
            <p>Studies Validated: ${progress_report.num_studies_validated}</p>
            <p>Statement Sets Validated: ${progress_report.num_statement_sets_validated}</p>
            <p>Percentage of Statement Sets Validated: ${progress_report.percent_statement_sets_validated}%</p>
            <p>Percentage of Publications Validated: ${progress_report.percent_publication_validated}%</p>
            <p>Percentage of Studies Validated: ${progress_report.percent_studies_validated}%</p>
        </div>
    `;

    return html;
}
