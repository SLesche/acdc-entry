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
  
  n_statementsets = length(submission_obj$statementset_info)
  
  if (n_statementsets > 0){
    statement_keys_list = vector(mode = "list", length = n_statementsets)
    
    statementset_keys = data.frame(
      statementset_index = 1:n_statementsets
    )
    
    for (istatementset in 1:n_statementsets){
      statementset_publication = submission_obj$statementset_info[[istatementset]]$publication
      # For statementset
      if (does_statement_publication_exist(conn, statementset_publication) == TRUE){
        sql_query = paste0(
          "SELECT statementset_id FROM statementset_table WHERE statementset_table.statementset_publication = '",
          statementset_publication, 
          "'"
        )
        statementset_id = DBI::dbGetQuery(conn, sql_query)[1, 1]
      } else {
        statementset_id = find_next_free_id(conn, "statementset_table")
      }
      
      statementset_info = data.frame(statementset_publication = statementset_publication)
      
      statementset_info$statementset_id = statementset_id
      
      statementset_keys[istatementset, "statementset_id"] = statementset_id
      
      # only submit if entry does not already exist
      if (does_statement_publication_exist(conn, statementset_publication) == FALSE){
        add_data_to_table(conn, statementset_info, "statementset_table", db_overview)
      }
      
      # For statements
      statement_id = find_next_free_id(conn, "statement_table")
      statement_info = submission_obj$statementset_info[[istatementset]]$statementset_data
      
      statement_info$statementset_id = statementset_id
      statement_info$statement_id = statement_id:(statement_id + nrow(statement_info) - 1)
      
      statement_keys_list[[istatementset]] = statement_info[, c("statement_id", "statement_identifier")]
      add_data_to_table(conn, statement_info, "statement_table", db_overview)
    }
  }
  
  n_studies = length(submission_obj$study_info)
  
  for (istudy in 1:n_studies){
    # For study
    study_id = find_next_free_id(conn, "study_table")
    study_info = submission_obj$study_info[[istudy]]$study_data
    study_info$publication_id = pub_id
    study_info$study_id = study_id
    
    if (n_statementsets == 0 | study_info$statementset_idx == 0){
      study_info$statementset_id = NA
    } else {
      study_info$statementset_id = statementset_keys[statementset_keys$statementset_index == study_info$statementset_idx, "statementset_id"]
    }
    
    add_data_to_table(conn, study_info, "study_table", db_overview)
    
    has_between_conditions = 0
    has_within_conditions = 0
    
    between_id = find_next_free_id(conn, "between_table")
    if ("between_data" %in% names(submission_obj$study_info[[istudy]])){
      has_between_conditions = 1
      
      # Between
      between_info = submission_obj$study_info[[istudy]]$between_data
      
      between_info$between_identifier = as.character(between_info$identifier)
      between_info$between_description = between_info$name
      
      between_info$between_id = between_id:(between_id + nrow(between_info) -1)
      
      between_info$study_id = study_id
      
      between_keys = between_info[, c("between_id", "between_identifier")]
      
      add_data_to_table(conn, between_info, "between_table", db_overview)
    } else {
      between_info = data.frame(
        between_id,
        study_id,
        between_description = "no manipulation"
      )
      add_data_to_table(conn, between_info, "between_table", db_overview)
      
    }
    
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
