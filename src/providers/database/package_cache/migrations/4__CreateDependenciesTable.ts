import { Migration } from '../../Migration';

export default {
    version: 4,
    query: `
        CREATE TABLE IF NOT EXISTS dependencies (
            community_slug TEXT NOT NULL,
            version_full_name TEXT NOT NULL,
            full_name TEXT NOT NULL,

            PRIMARY KEY (community_slug, version_full_name, full_name),
            FOREIGN KEY (community_slug, version_full_name) REFERENCES versions(community_slug, full_name) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_dependencies_community_slug ON dependencies(community_slug);
        CREATE INDEX IF NOT EXISTS idx_dependencies_version_full_name ON dependencies(version_full_name);
        CREATE INDEX IF NOT EXISTS idx_dependencies_full_name ON dependencies(full_name);
    `
} as Migration
