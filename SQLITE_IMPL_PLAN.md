# SQLite Implementation Plan

To avoid this work getting lost down the line, and to prevent progress from stalling, I'm writing down my ideas for SQLite implementation.

## Plan

_Web Workers have already been verified to work on both TSMM and r2modman. They have been added alongside Comlink to make usage easier._

_The storage backend will use OPFS-SAH. Whilst restricted to singular read/write operations, our writes are in batches so should have negligible impact._
_Promises handle switching between operations when necessary._

### Step 1: Add the initial tables and migrations

This is needed so that we get setup our expected format.

We can optimize this significantly to what was previously stored in IndexedDB. We can properly use JOINs and indexes.

### Step 2: Add upsert logic

The pre-requirement data wise is to actually get that into the database.
The upsert logic is needed so that we can update existing records, and insert new ones if they don't exist.

### Step 2.5 (Benchmark times)

We need to benchmark the upsert logic so that we can verify performance wins over IndexedDB.

### Step 3: Feature flags

Feature flags are needed so that we can switch between SQLite and IndexedDB implementations.
It enables us to continuously merge code without the need to make breaking changes. Work doesn't have to stall and work can continue to be merged.

The feature flags should be added so that we can:
1. Disable SQLite entirely to prevent double insertion overhead in production builds
2. Enable individual query actions to use SQLite once implemented

Something along the lines of:
```
VITE_SQLITE_ENABLED=true
VITE_SQLITE_SEARCH_ENABLED=true
...
```

----

This is a theoretical stopping point. SQLite is "implemented" (exists in the backend), but is not ready for production use.

----

### Step 4: Replace the search logic

Let's immediately replace the search logic so that we can test performance and memory wins over IndexedDB.

### Step 5: Replace remaining usages

This is a large open task, but in reality, other usages are just specialized queries.

### Step 6: Final testing and cleanup

Remove the feature flags as this should be in a state ready to deploy to production. No remaining IndexedDB usages should exist for tsPackages.
