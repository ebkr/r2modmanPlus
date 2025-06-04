/**
 * The contents in this file are intended for internal use by PackageDexieStore
 * but defined in a separate file so they can be mocked separately by unit tests.
 * Mocking Dexie parts is required as IndexedDB implementation is not available
 * on Node environment where the tests run.
 */

export interface DexieVersion {
    full_name: string;
    name: string;
    version_number: string;
    uuid4: string;
    dependencies: string[];
    description: string;
    icon: string;
    is_active: boolean;
    downloads: number;
    download_url: string;
    website_url: string;
    file_size: number;
    date_created: Date;
}

export interface DexiePackage {
    full_name: string;
    owner: string;
    name: string;
    uuid4: string;
    package_url: string;
    categories: string[];
    rating_score: number;
    is_pinned: boolean;
    is_deprecated: boolean;
    has_nsfw_content: boolean;
    donation_link: string | null;
    date_created: Date;
    date_updated: Date;
    versions: DexieVersion[];

    // Extra fields not included in the API response
    community: string;
    date_fetched: Date; // When the entry was fetched from the API
}

export async function fetchPackagesByCommunityPackagePairs(
    db: any /* PackageDexieStore */,
    communityPackagePairs: [string, string][]
): Promise<DexiePackage[]> {
    // Dexie's anyOfIgnoreCase doesn't support compound indexes.
    return await db.packages.where('[community+full_name]').anyOf(communityPackagePairs).toArray();
}
