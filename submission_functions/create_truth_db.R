create_truth_db <- function(file_path){
  conn = DBI::dbConnect(RSQLite::SQLite(), file_path)
  
  # Publication table
  DBI::dbExecute(
    conn,
    "CREATE TABLE publication_table (
    publication_id INTEGER PRIMARY KEY AUTOINCREMENT,
    authors VARCHAR(10000),
    conducted DATE,
    added DATE,
    country VARCHAR(255),
    contact VARCHAR(10000),
    apa_reference VARCHAR(2047),
    keywords VARCHAR(1023),
    publication_code VARCHAR(255) UNIQUE
    );"
  )
  
  DBI::dbExecute(
    conn,
    "CREATE TABLE study_table (
    study_id INTEGER PRIMARY KEY AUTOINCREMENT,
    statementset_id INTEGER,
    publication_id INTEGER,
    study_comment VARCHAR(10000),
    raw_data_link VARCHAR(255),
    n_participants INTEGER,
    participant_age FLOAT,
    percentage_female FLOAT,
    rt_measured INTEGER,
    rt_onset VARCHAR(255),
    subjective_certainty BOOLEAN,
    physiological_measures BOOLEAN,
    cognitive_models BOOLEAN,
    filler_task_yesno BOOLEAN,
    filler_task_type VARCHAR(63),
    filler_task_name VARCHAR(255),
    truth_rating_scale VARCHAR(255),
    truth_rating_steps INTEGER,
    FOREIGN KEY (statementset_id) REFERENCES statementset_table(statementset_id),
    FOREIGN KEY (publication_id) REFERENCES publication_table(publication_id)
    );"
  )
  
  DBI::dbExecute(
    conn,
    "CREATE TABLE measure_table (
    measure_id INTEGER PRIMARY KEY AUTOINCREMENT,
    study_id INTEGER,
    construct VARCHAR(255),
    measure_details VARCHAR(1023),  
    FOREIGN KEY (study_id) REFERENCES study_table(study_id)
    );"
  )
  
  DBI::dbExecute(
    conn,
    "CREATE TABLE statementset_table (
    statementset_id INTEGER PRIMARY KEY AUTOINCREMENT,
    statementset_publication VARCHAR(2047)
    );"
  )
  DBI::dbExecute(
    conn,
    "CREATE TABLE statement_table (
    statement_id INTEGER PRIMARY KEY AUTOINCREMENT,
    statementset_id INTEGER,
    statement_text VARCHAR(2047),
    statement_accuracy INTEGER,
    statement_category VARCHAR(255),
    proportion_true FLOAT,
    FOREIGN KEY (statementset_id) REFERENCES statementset_table(statementset_id)
    );"
  )
  
  DBI::dbExecute(
    conn,
    "CREATE TABLE between_table (
    between_id INTEGER PRIMARY KEY AUTOINCREMENT,
    study_id INTEGER,
    between_description VARCHAR(10000),
    FOREIGN KEY (study_id) REFERENCES study_table(study_id)
    );"
  )
  
  DBI::dbExecute(
    conn,
    "CREATE TABLE within_table (
    within_id INTEGER PRIMARY KEY AUTOINCREMENT,
    study_id INTEGER,
    within_description VARCHAR(10000),
    FOREIGN KEY (study_id) REFERENCES study_table(study_id)
    );"
  )
  
  DBI::dbExecute(
    conn,
    "CREATE TABLE procedure_table (
    procedure_id INTEGER PRIMARY KEY AUTOINCREMENT,
    study_id INTEGER,
    repetition_time FLOAT,
    repetition_location VARCHAR(255),
    repetition_type VARCHAR(255),
    max_n_repetitions INTEGER,
    n_statements INTEGER,
    truth_instructions INTEGER,
    truth_instruction_timing VARCHAR(255),
    presented_until_response BOOLEAN,
    presentation_time_s FLOAT,
    response_deadline BOOLEAN,
    response_deadline_s FLOAT,
    percent_repeated FLOAT,
    presentation_type VARCHAR(255),
    phase VARCHAR(255),
    repetition_instructions INTEGER,
    repetition_instruction_timing VARCHAR(255),
    FOREIGN KEY (study_id) REFERENCES study_table(study_id)
    );"
  )
  
  DBI::dbExecute(
    conn,
    "CREATE TABLE observation_table (
    observation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    between_id INTEGER,
    within_id INTEGER,
    procedure_id INTEGER,
    subject INTEGER,
    trial INTEGER,
    statement_id INTEGER,
    rt FLOAT,
    response FLOAT,
    repeated INTEGER,
    certainty FLOAT,
    FOREIGN KEY (between_id) REFERENCES between_table(between_id),
    FOREIGN KEY (within_id) REFERENCES within_table(within_id),
    FOREIGN KEY (procedure_id) REFERENCES procedure_table(procedure_id),
    FOREIGN KEY (statement_id) REFERENCES statement_table(statement_id),
    UNIQUE (subject, trial, within_id, between_id, procedure_id, statement_id)
    );"
  )
}

