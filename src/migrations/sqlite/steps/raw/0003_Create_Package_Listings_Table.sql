CREATE TABLE package_listings (
    package_full_name TEXT NOT NULL REFERENCES packages (full_name) ON DELETE CASCADE,
    community         TEXT NOT NULL,
    date_fetched      INTEGER NOT NULL,
    is_pinned         INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (package_full_name, community)
);

CREATE INDEX idx_listings_community ON package_listings (community, date_fetched);
