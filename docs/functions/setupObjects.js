function setupStudyInfo(study_name){
    study_info = {
        study_name: study_name,
        study_data: {},
        measurement_data: {},
        dataset_info: {},
    };
    return study_info
}

function setupDatasetInfo(dataset_id){
    dataset_info = {
        dataset_id: dataset_id,
        dataset_data: {},
        raw_data: {},
        within_data: {},
        task_data: {},
    };
    return dataset_info
}

function setupPublicationInfo(publication_name){
    publication_info = {
        publication_name: publication_name,
        study_info: {},
        publication_data: {},
    };
    return publication_info
}

function setupTaskInfo(task_name){
    task_info = {
        task_name: task_name,
        task_data: {},
    };
    return task_info
}