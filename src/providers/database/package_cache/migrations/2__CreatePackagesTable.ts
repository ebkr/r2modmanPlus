import { Migration } from '../../Migration';

export default {
    version: 2,
    query: `
        CREATE TABLE IF NOT EXISTS packages (
            community_slug TEXT NOT NULL REFERENCES communities(slug) ON DELETE CASCADE,
            full_name TEXT NOT NULL,
            name TEXT NOT NULL,
            owner TEXT NOT NULL,
            package_url TEXT,
            date_created DATETIME,
            date_updated DATETIME,
            rating_score INTEGER NOT NULL DEFAULT 0,
            is_pinned BOOLEAN NOT NULL DEFAULT 0,
            is_deprecated BOOLEAN NOT NULL DEFAULT 0,
            has_nsfw_content BOOLEAN NOT NULL DEFAULT 0,
            date_fetched DATETIME NOT NULL DEFAULT (datetime('now')),
            categories TEXT NOT NULL DEFAULT '[]',
            PRIMARY KEY (community_slug, full_name)
        );

        CREATE INDEX IF NOT EXISTS idx_packages_community_date_updated ON packages(community_slug, date_updated DESC);
        CREATE INDEX IF NOT EXISTS idx_packages_community_rating ON packages(community_slug, rating_score DESC);
        CREATE INDEX IF NOT EXISTS idx_packages_community_name ON packages(community_slug, name);
    `
} as Migration
