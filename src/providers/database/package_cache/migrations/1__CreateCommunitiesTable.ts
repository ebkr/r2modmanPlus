import { Migration } from '../../Migration';

export default {
    version: 1,
    query: `
    CREATE TABLE IF NOT EXISTS communities (
        slug TEXT PRIMARY KEY,
        date_fetched DATETIME NOT NULL DEFAULT (DATETIME('now'))
    );
    `
} as Migration;
