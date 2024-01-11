-- SQL script to create tables for movie database

-- Table for movies
CREATE TABLE movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    year INTEGER,
    href TEXT,
    extract TEXT,
    thumbnail TEXT,
    thumbnail_width INTEGER,
    thumbnail_height INTEGER
);

-- Table for cast members
CREATE TABLE cast_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Linking table for movies and cast members
CREATE TABLE movie_cast (
    movie_id INTEGER,
    cast_id INTEGER,
    FOREIGN KEY (movie_id) REFERENCES movies(id),
    FOREIGN KEY (cast_id) REFERENCES cast_members(id),
    PRIMARY KEY (movie_id, cast_id)
);

-- Table for genres
CREATE TABLE genres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Linking table for movies and genres
CREATE TABLE movie_genres (
    movie_id INTEGER,
    genre_id INTEGER,
    FOREIGN KEY (movie_id) REFERENCES movies(id),
    FOREIGN KEY (genre_id) REFERENCES genres(id),
    PRIMARY KEY (movie_id, genre_id)
);
