CREATE TABLE package_versions (
    package_full_name TEXT NOT NULL REFERENCES packages (full_name) ON DELETE CASCADE,
    version_number    TEXT NOT NULL,
    version_major     INTEGER NOT NULL,
    version_minor     INTEGER NOT NULL,
    version_patch     INTEGER NOT NULL,
    description       TEXT NOT NULL DEFAULT '',
    icon              TEXT,
    downloads         INTEGER NOT NULL DEFAULT 0,
    download_url      TEXT NOT NULL,
    website_url       TEXT,
    file_size         INTEGER NOT NULL DEFAULT 0,
    is_active         INTEGER NOT NULL DEFAULT 1,
    uuid4             TEXT,
    date_created      INTEGER NOT NULL,
    PRIMARY KEY (package_full_name, version_number)
);

CREATE INDEX idx_versions_semver
    ON package_versions (package_full_name, version_major DESC, version_minor DESC, version_patch DESC);

CREATE INDEX idx_versions_downloads
    ON package_versions (package_full_name, downloads);
