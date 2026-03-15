import { SortDirection } from '../../../model/real_enums/sort/SortDirection';
import SortingStyle from '../../../model/enums/SortingStyle';
import type { DatabaseProvider } from '../DatabaseProvider';

type OrderByEntry = { column: string; asc: boolean };

export class PackageSearchQuery {
    private _conditions: string[] = [];
    private _args: any[] = [];
    private _orderBy: OrderByEntry[] = [];

    withSearch(term: string): this {
        if (term) {
            this._conditions.push(`(
                LOWER(p.name) LIKE ?
                OR LOWER(p.owner) LIKE ?
                OR LOWER(v.description) LIKE ?
            )`);
            const like = `%${term.toLowerCase()}%`;
            this._args.push(like, like, like);
        }
        return this;
    }

    withCommunity(community: string): this {
        this._conditions.push(`p.community_slug = ?`);
        this._args.push(community);
        return this;
    }

    withAllCategories(categories: string[]): this {
        for (const cat of categories) {
            this._conditions.push(`EXISTS (SELECT 1 FROM json_each(p.categories) WHERE value = ?)`);
            this._args.push(cat);
        }
        return this;
    }

    withAtLeastOneCategory(categories: string[]): this {
        if (categories.length > 0) {
            const placeholders = categories.map(() => '?').join(', ');
            this._conditions.push(`EXISTS (SELECT 1 FROM json_each(p.categories) WHERE value IN (${placeholders}))`);
            this._args.push(...categories);
        }
        return this;
    }

    withoutCategories(categories: string[]): this {
        if (categories.length > 0) {
            const placeholders = categories.map(() => '?').join(', ');
            this._conditions.push(`NOT EXISTS (SELECT 1 FROM json_each(p.categories) WHERE value IN (${placeholders}))`);
            this._args.push(...categories);
        }
        return this;
    }

    withSortingStyle(sortingStyle: string, sortDirection: SortDirection): this {
        const desc = sortDirection === SortDirection.STANDARD;
        if (sortingStyle === SortingStyle.DEFAULT) {
            this._orderBy = [
                { column: 'p.is_pinned', asc: !desc },
                { column: 'p.date_updated', asc: !desc },
            ];
        } else if (sortingStyle === SortingStyle.LAST_UPDATED) {
            this._orderBy = [{ column: 'p.date_updated', asc: !desc }];
        } else if (sortingStyle === SortingStyle.ALPHABETICAL) {
            this._orderBy = [{ column: 'p.name', asc: desc }];
        } else if (sortingStyle === SortingStyle.RATING) {
            this._orderBy = [{ column: 'p.rating_score', asc: !desc }];
        } else if (sortingStyle === SortingStyle.DOWNLOADS) {
            this._orderBy = [{ column: 'total_downloads', asc: !desc }];
        }
        return this;
    }

    async count(db: DatabaseProvider): Promise<number> {
        const whereClause = this._conditions.length > 0
            ? `WHERE ${this._conditions.join(' AND ')}`
            : '';

        const rows = await db.query(`
            SELECT COUNT(*) AS total
            FROM packages p
            LEFT JOIN versions v ON p.community_slug = v.community_slug AND p.full_name = v.package_full_name
            ${whereClause}`,
            ...this._args
        );
        return rows[0]!.total as number;
    }

    async execute(db: DatabaseProvider, limit: number, page: number): Promise<Record<string, any>[]> {
        const whereClause = this._conditions.length > 0
            ? `WHERE ${this._conditions.join(' AND ')}`
            : '';
        const orderByClause = this._orderBy.length > 0
            ? `ORDER BY ${this._orderBy.map(o => `${o.column} ${o.asc ? 'ASC' : 'DESC'}`).join(', ')}`
            : '';

        return db.query(`
            SELECT p.*,
                COALESCE(v.downloads, 0) AS total_downloads,
                v.version_number AS latest_version_number,
                v.description AS latest_description,
                v.icon AS latest_icon
            FROM packages p
            LEFT JOIN versions v ON p.community_slug = v.community_slug AND p.full_name = v.package_full_name
            ${whereClause}
            ${orderByClause}
            LIMIT ?
            OFFSET ?`,
            ...this._args, limit, (page - 1) * limit
        );
    }
}
