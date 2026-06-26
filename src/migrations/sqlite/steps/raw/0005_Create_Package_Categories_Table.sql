CREATE TABLE package_categories (
    package_full_name TEXT NOT NULL REFERENCES packages (full_name) ON DELETE CASCADE,
    category_id       INTEGER NOT NULL REFERENCES categories (id) ON DELETE CASCADE,
    PRIMARY KEY (package_full_name, category_id)
);

CREATE INDEX idx_package_categories_category ON package_categories (category_id);
