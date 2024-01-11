CREATE VIRTUAL TABLE fts_movies USING fts5(title, extract);

INSERT INTO fts_movies(rowid, title, extract) SELECT id, title, extract FROM movies;

