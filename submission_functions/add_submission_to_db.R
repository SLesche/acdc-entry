add_submission_to_db <- function(conn, submission_obj){
  db_overview = generate_db_overview_table(conn)
  
  pub_code = submission_obj$publication_data$publication_code
  if (does_publication_code_exist(conn, pub_code) == TRUE){
    stop("This publication code already exists. Please use the append_db function to add to a specific publication.")
  }
  
  # Find and add pub id
  pub_id = find_next_free_id(conn, "publication_table")
  
  pub_info = submission_obj$publication_data
  
  # Then add that to db
  add_data_to_table(conn, pub_info, "publication_table", db_overview)
  
  n_tasks = length(submission_obj$task_info)
  
  if (n_tasks > 0){
    task_keys_list = vector(mode = "list", length = n_tasks)
    
    task_keys = data.frame(
      task_index = 1:n_tasks
    )
    
    for (itask in 1:n_tasks){      
      task_id = find_next_free_id(conn, "task_table")
      
      task_info = data.frame(submission_obj$task_info[[itask]]$task_data)
      
      task_info$task_id = task_id
      
      task_keys[itask, "task_id"] = task_id
      
      add_data_to_table(conn, task_info, "task_table", db_overview)
    }
  }
  
  n_studies = length(submission_obj$study_info)
  
  for (istudy in 1:n_studies){
    # For study
    study_id = find_next_free_id(conn, "study_table")
    study_info = submission_obj$study_info[[istudy]]$study_data
    study_info$publication_id = pub_id
    study_info$study_id = study_id
   
    add_data_to_table(conn, study_info, "study_table", db_overview)
    
    has_within_conditions = 0
    
    # Iterate through the datasets
    
    n_datasets = length(submission_obj$study_info[[istudy]]$dataset_info)

    for (idataset in 1:n_datasets){
      
      # Also compute mean response time and accuracy

      within_id = find_next_free_id(conn, "within_table")
      if ("within_data" %in% names(submission_obj$study_info[[istudy]])){
        has_within_conditions = 1
        # Within
        within_info = submission_obj$study_info[[istudy]]$within_data
        within_info$within_id = within_id:(within_id + nrow(within_info) -1)
        within_info$study_id = study_id
        
        within_info$within_identifier = as.character(within_info$identifier)
        within_info$within_description = within_info$name
        
        within_keys = within_info[, c("within_id", "within_identifier")]
        
        add_data_to_table(conn, within_info, "within_table", db_overview)
      } else {
        within_info = data.frame(
          within_id,
          study_id,
          within_description = "no manipulation"
        )
        add_data_to_table(conn, within_info, "within_table", db_overview)
        
      }
      
      # procedure
      procedure_id = find_next_free_id(conn, "procedure_table")
      procedure_info = submission_obj$study_info[[istudy]]$procedure_data
      
      procedure_info$procedure_id = procedure_id:(procedure_id + nrow(procedure_info) - 1)
      
      procedure_info$study_id = study_id
      
      procedure_keys = procedure_info[, c("procedure_id", "procedure_identifier")]
      
      add_data_to_table(conn, procedure_info, "procedure_table", db_overview)
      
      
      # Observation
      # Find next free subject number
      sql_query = paste0(
        "SELECT max(subject) FROM observation_table"
      )
      
      max_subject = DBI::dbGetQuery(conn, sql_query)[1, 1]
      if (is.na(max_subject)){
        max_subject = 0
      }
      
      observation_table = submission_obj$study_info[[istudy]]$raw_data
      
      observation_table$subject = dplyr::dense_rank(observation_table$subject) + max_subject
      
      observation_table = replace_id_keys_in_data(observation_table, procedure_keys, "procedure", "_identifier")
      if (n_statementsets > 0 & study_info$statementset_idx != 0){
        observation_table = replace_id_keys_in_data(observation_table, statement_keys_list[[study_info$statementset_idx]], "statement", "_identifier")
      } else {
        observation_table$statement_id = NA
      }
      
      if (has_within_conditions){
        observation_table = replace_id_keys_in_data(observation_table, within_keys, "within", "_identifier")
      } else {
        observation_table$within_id = within_id
      }
      if (has_between_conditions){
        observation_table = replace_id_keys_in_data(observation_table, between_keys, "between", "_identifier")
      } else {
        observation_table$between_id = between_id
      }
      
      add_data_to_table(conn, as.data.frame(observation_table), "observation_table", db_overview)

    }

    # For measure
    if ("measurement_data" %in% names(submission_obj$study_info[[istudy]])){
      measure_id = find_next_free_id(conn, "measure_table")
      measure_info = submission_obj$study_info[[istudy]]$measurement_data
      measure_info$study_id = study_id
      measure_info$measure_id = measure_id:(measure_id + nrow(measure_info) - 1)
      
      add_data_to_table(conn, measure_info, "measure_table", db_overview) 
    }
  }
}
