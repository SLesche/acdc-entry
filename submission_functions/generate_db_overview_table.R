# Function to generate CSV overview of an SQLite database
generate_db_overview_table <- function(con) {
  # Get a list of all tables in the database
  tables <- DBI::dbListTables(con)
  tables <- tables[which(!grepl("sqlite", tables))]
  
  # Initialize a list to hold the data for each table
  all_data <- list()
  
  # Loop through each table and get column info
  for (table in tables) {
    # Get column info for the current table
    columns <- DBI::dbGetQuery(con, paste0("PRAGMA table_info(", table, ");"))
    
    # Get foreign key info for the current table
    foreign_keys <- DBI::dbGetQuery(con, paste0("PRAGMA foreign_key_list(", table, ");"))
    
    # Create a dataframe with table, column names, data types, and constraints
    table_data <- data.frame(
      table = table,
      column_name = columns$name,
      data_type = columns$type,
      constraints = ifelse(columns$notnull == 1, "NOT NULL", "") # Initial constraints (e.g., NOT NULL)
    )
    
    # Add primary key information
    table_data$constraints[columns$pk == 1] <- paste(table_data$constraints[columns$pk == 1], "PRIMARY KEY", sep = ", ")
    
    columns$dflt_value[which(is.na(columns$dflt_value))] = ""
    # Add any default values (if any)
    table_data$constraints[columns$dflt_value != ""] <- paste(table_data$constraints[columns$dflt_value != ""], 
                                                              "DEFAULT", columns$dflt_value, sep = ", ")
    # Add foreign key constraints if any
    if (nrow(foreign_keys) > 0) {
      for (i in 1:nrow(foreign_keys)) {
        fk_column <- foreign_keys$from[i]
        ref_table <- foreign_keys$table[i]
        ref_column <- foreign_keys$to[i]
        
        # Append foreign key constraint
        fk_constraint <- paste0("FOREIGN KEY (", fk_column, ") REFERENCES ", ref_table, "(", ref_column, ")")
        table_data$constraints[table_data$column_name == fk_column] <- 
          paste(table_data$constraints[table_data$column_name == fk_column], fk_constraint, sep = ", ")
      }
    }
    
    # Clean up constraint formatting
    table_data$constraints <- gsub("^, ", "", table_data$constraints) # Remove leading comma and space
    table_data$constraints <- gsub(", $", "", table_data$constraints) # Remove trailing comma and space
    
    # Append to the list
    all_data[[table]] <- table_data
  }
  
  # Combine all tables' data into a single dataframe
  combined_data <- do.call(rbind, all_data)
  
  return(combined_data)
}
