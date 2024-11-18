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

function setupStatementSetInfo(statementset_name){
    statementset_info = {
        statementset_name: statementset_name,
        statementset_data: {},
    };
    return statementset_info
}