import { openDB, DBSchema } from 'idb';

interface SnippetDetails {
  id?: number;
  heading: string;
  description: string;
  code: string;
  tags: string[];
  folder: string;
}

interface SnippetDB extends DBSchema {
  snippets: {
    key: number;
    value: SnippetDetails;
    indexes: { 'by-heading': string };
  };
}

const DB_NAME = 'snippetsDB';
const STORE_NAME = 'snippets';

let dbInitialized = false;

export async function initDB() {
  if (dbInitialized) {
    console.log("Database already initialized.");
    return;
  }
  
  console.log("Initializing database...");
  const db = await openDB<SnippetDB>(DB_NAME, 1, {
    upgrade(db, oldVersion, newVersion, transaction) {
      console.log(`Upgrading database from version ${oldVersion} to ${newVersion}`);
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        console.log(`Creating object store: ${STORE_NAME}`);
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('by-heading', 'heading');

        // Add initial data
        console.log("Adding initial data to the store...");
        store.put({
          heading: "Example Snippet 1",
          description: "A simple example snippet",
          code: "console.log('Hello World');",
          tags: ["javascript", "example"],
          folder: "Folder 1"
        });

        store.put({
          heading: "Example Snippet 2",
          description: "Another example snippet",
          code: "print('Hello Python')",
          tags: ["python", "example"],
          folder: "Folder 1"
        });
      } else {
        console.log(`Object store ${STORE_NAME} already exists.`);
      }
    },
  });

  // Check if the store exists after initialization
  if (db.objectStoreNames.contains(STORE_NAME)) {
    console.log(`Store '${STORE_NAME}' exists.`);
  } else {
    console.log(`Store '${STORE_NAME}' does not exist.`);
  }

  dbInitialized = true;
  console.log("Database initialized successfully.");
  return db;
}

export async function getAllSnippets(): Promise<SnippetDetails[]> {
  try {
    console.log("Initializing DB for fetching all snippets...");
    await initDB(); // Ensure DB is initialized
    const db = await openDB<SnippetDB>(DB_NAME, 1);
    const allSnippets = await db.getAll(STORE_NAME);
    console.log("Fetched all snippets successfully:", allSnippets);
    return allSnippets;
  } catch (error) {
    console.error("Failed to fetch snippets:", error);
    throw error; // Re-throw the error after logging
  }
}

export async function updateSnippet(id: number, snippet: SnippetDetails): Promise<void> {
  const db = await openDB(DB_NAME, 1);
  await db.put('snippets', {
    id, // Ensure ID is included
    heading: snippet.heading,
    description: snippet.description,
    code: snippet.code,
    tags: snippet.tags,
    folder: snippet.folder,
    createdAt: snippet.createdAt || new Date()
  });
}

export async function addSnippet(snippet: SnippetDetails): Promise<number> {
  await initDB();
  const db = await openDB<SnippetDB>(DB_NAME, 1);
  return db.add(STORE_NAME, snippet);
}

export async function deleteSnippet(id: number): Promise<void> {
  await initDB();
  const db = await openDB<SnippetDB>(DB_NAME, 1);
  return db.delete(STORE_NAME, id);
}

export async function getAllFolders(): Promise<string[]> {
  const db = await openDB(DB_NAME, 1);
  const snippets = await db.getAll('snippets');
  
  // Extract unique folder names from existing snippets
  const uniqueFolders = [...new Set(snippets.map(snippet => snippet.folder))].filter(Boolean);
  return uniqueFolders.sort();
}

export interface Snippet {
  id?: number;
  heading: string;
  description: string;
  code: string;
  tags: string[];
  folder: string;
  createdAt?: Date;
} 