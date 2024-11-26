function cleanDataForSubmission(control) {
    var cleaned_control = {
        publication_data: {},
        study_info: {},
        task_info: {},
    };

    // Copy publication data, exclude the validated field 
    const { validated, ...publication_data } = control.publication_info[0].publication_data;
    cleaned_control.publication_data = publication_data;
    
    // Iterate over statementsets
    for (let task_idx in control.task_info) {
        const task_info = control.task_info[task_idx]
        cleaned_control.task_info[task_idx] = { 
            task_info
        };
    }

    // Iterate over studies
    for (let study_idx in control.publication_info[0].study_info) {
        const study_info = control.publication_info[0].study_info[study_idx];

        const { validated: study_validated, ...study_data } = study_info.study_data;
        const { validated: measurement_validated, ...measurement_data } = study_info.measurement_data;

        cleaned_control.study_info[study_idx] = {
            study_data,
            measurement_data,
            dataset_info: {},
        };

        for (let dataset_idx in control.publication_info[0].study_info[study_idx].dataset_info) {
            const dataset_info = control.publication_info[0].study_info[study_idx].dataset_info[dataset_idx];
            const { validated: dataset_validated, ...dataset_data } = dataset_info.dataset_data;
            const { validated: within_validated, ...within_data } = dataset_info.within_data;
            const raw_data = dataset_info.raw_data.data;

            cleaned_control.study_info[study_idx].dataset_info[dataset_idx] = {
                dataset_data,
                within_data,
                raw_data
            }
        }
    }
    
    return cleaned_control
}

function submitData(control) {
    console.log(control);

    // clean the control data
    const cleaned_control = cleanDataForSubmission(control);

    console.log(cleaned_control);
    // Write the data into a json file
    const submission_data = JSON.stringify(cleaned_control);

    // Download the data locally
    const blob = new Blob([submission_data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "submission.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    alert("Data submitted successfully!");
}

function saveProgress(control){
    control.progress_file = true;
    // Write the data into a json file
    const submission_data = JSON.stringify(control);

    // Download the data locally
    const blob = new Blob([submission_data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "submission_progress.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    alert("Progress file downloaded successfully!");
}

function addCheckmarksFromProgress(control) {
    const num_total_publications = Object.keys(control.publication_info).length;
    const num_tasks = Object.keys(control.task_info).length;

    for (let publication_idx in control.publication_info) {
        let publication = control.publication_info[publication_idx];
        if (publication.publication_data.validated) {
            // Add a checkmark to the currently selected sidebar item
            const item_id =  "publication-" + publication_idx;
            addGreenCheckmarkById(item_id);
        }

        for (let study_idx in control.publication_info[publication_idx].study_info) {
            let study = control.publication_info[publication_idx].study_info[study_idx];
            
            // Add checkmark for the study
            if (study.study_data.validated) {
                // Add a checkmark to the currently selected sidebar item
                const item_id =  "study-" + publication_idx + "-" + study_idx;
                addGreenCheckmarkById(item_id);
            }

            if (study.measurement_data.validated) {
                addGreenCheckmarkById(`measures-${publication_idx}-${study_idx}`);
            }

            for (let dataset_idx in control.publication_info[publication_idx].study_info[study_idx].dataset_info){
                let dataset = control.publication_info[publication_idx].study_info[study_idx].dataset_info[dataset_idx];

                if (dataset.dataset_data.validated){
                    const item_id = "datainfo-" + publication_idx + "-" + study_idx + "-" + dataset_idx;
                    addGreenCheckmarkById(item_id);
                }

                if (dataset.within_data.validated){
                    const item_id = "conditions-" + publication_idx + "-" + study_idx + "-" + dataset_idx;
                    addGreenCheckmarkById(item_id);
                }

                if (dataset.raw_data.validated){
                    const item_id = "rawdata-" + publication_idx + "-" + study_idx + "-" + dataset_idx;
                    addGreenCheckmarkById(item_id);
                }
            }
        }
    }

    // Iterate over statement sets
    for (let task_idx = 0; task_idx < num_tasks; task_idx++) {
        if (control.task_info[task_idx].task_data.validated) {
            addGreenCheckmarkById(`task-${task_idx}`);
        }
    }
}
