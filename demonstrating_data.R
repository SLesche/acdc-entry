library(acdcquery)
library(dplyr)

conn <- acdcquery::connect_to_db("acdc.db")

arguments <- list() %>% 
  acdcquery::add_argument(
    conn,
    "n_participants",
    "greater",
    30
  )

results <- query_db(conn, arguments, c("default"))
