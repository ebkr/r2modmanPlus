CREATE TABLE dependencies (
    package_full_name    TEXT NOT NULL,
    version_number       TEXT NOT NULL,
    dependency_full_name TEXT NOT NULL,
    dependency_version   TEXT NOT NULL,
    PRIMARY KEY (package_full_name, version_number, dependency_full_name),
    FOREIGN KEY (package_full_name, version_number)
        REFERENCES package_versions (package_full_name, version_number) ON DELETE CASCADE
);

CREATE INDEX idx_dependencies_target ON dependencies (dependency_full_name, dependency_version);
