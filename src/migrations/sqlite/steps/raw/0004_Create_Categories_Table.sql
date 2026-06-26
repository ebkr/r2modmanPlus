CREATE TABLE categories (
    id        INTEGER PRIMARY KEY,
    community TEXT NOT NULL,
    name      TEXT NOT NULL,
    UNIQUE (community, name)
);
