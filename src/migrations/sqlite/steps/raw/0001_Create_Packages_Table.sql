CREATE TABLE packages (
    full_name        TEXT NOT NULL PRIMARY KEY,
    owner            TEXT NOT NULL,
    name             TEXT NOT NULL,
    package_url      TEXT,
    donation_link    TEXT,
    uuid4            TEXT,
    date_created     INTEGER NOT NULL,
    date_updated     INTEGER NOT NULL,
    rating_score     INTEGER NOT NULL DEFAULT 0,
    is_deprecated    INTEGER NOT NULL DEFAULT 0,
    has_nsfw_content INTEGER NOT NULL DEFAULT 0
);
