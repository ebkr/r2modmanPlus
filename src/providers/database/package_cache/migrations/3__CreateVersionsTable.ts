import { Migration } from '../../Migration';

export default {
    version: 3,
    query: `
        CREATE TABLE IF NOT EXISTS versions (
            community_slug TEXT NOT NULL,
            package_full_name TEXT NOT NULL,
            version_number TEXT NOT NULL,
            full_name TEXT NOT NULL,
            description TEXT,
            icon TEXT,
            download_url TEXT,
            website_url TEXT,
            file_size INTEGER,
            downloads INTEGER NOT NULL DEFAULT 0,
            date_created DATETIME,
            is_active BOOLEAN NOT NULL DEFAULT 1,
            PRIMARY KEY (community_slug, full_name),
            FOREIGN KEY (community_slug, package_full_name) REFERENCES packages(community_slug, full_name) ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_versions_community_package ON versions(community_slug, package_full_name);
    `
} as Migration
