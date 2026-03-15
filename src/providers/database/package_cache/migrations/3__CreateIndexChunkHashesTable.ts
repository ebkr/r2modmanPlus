import { Migration } from '../../Migration';

export default {
    version: 3,
    query: `
        CREATE TABLE IF NOT EXISTS index_chunk_hashes (
            community_slug TEXT NOT NULL REFERENCES communities(slug) ON DELETE CASCADE,
            hash TEXT NOT NULL,
            date_updated DATETIME NOT NULL DEFAULT (datetime('now')),
            PRIMARY KEY (community_slug, hash)
        );
    `
} as Migration
