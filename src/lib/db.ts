import { openDB, DBSchema } from 'idb';

interface SnippetDetails {
  id?: number;
  heading: string;
  description: string;
  code: string;
  tags: string[];
  folder: string;
  inactive?: boolean;
  createdAt?: Date;
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
  
  // Get the original snippet to check if folder changed
  const originalSnippet = await db.get('snippets', id);
  const oldFolder = originalSnippet?.folder;
  
  // Update the snippet
  await db.put('snippets', {
    id,
    heading: snippet.heading,
    description: snippet.description,
    code: snippet.code,
    tags: snippet.tags,
    folder: snippet.folder,
    inactive: snippet.inactive,
    createdAt: snippet.createdAt || new Date()
  });

  // Handle folder changes
  if (oldFolder && oldFolder !== snippet.folder) {
    // Check old folder and add placeholder if empty
    const snippetsInOldFolder = await getSnippetsInFolder(oldFolder);
    if (snippetsInOldFolder.length === 0) {
      await createPlaceholderSnippet(oldFolder);
    }
    
    // Remove placeholder in new folder if it exists
    await removePlaceholderSnippet(snippet.folder);
  }
}

export async function addSnippet(snippet: SnippetDetails): Promise<number> {
  await initDB();
  const db = await openDB<SnippetDB>(DB_NAME, 1);
  
  // If this is not a placeholder snippet, remove any existing placeholder in the folder
  if (!snippet.inactive) {
    await removePlaceholderSnippet(snippet.folder);
  }
  
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

// Add this new function to check snippets in a folder
async function getSnippetsInFolder(folderName: string): Promise<SnippetDetails[]> {
  const db = await openDB<SnippetDB>(DB_NAME, 1);
  const allSnippets = await db.getAll(STORE_NAME);
  return allSnippets.filter(snippet => snippet.folder === folderName);
}

// Add this function to create a placeholder snippet
async function createPlaceholderSnippet(folderName: string): Promise<void> {
  const placeholder: SnippetDetails = {
    heading: "Folder Placeholder",
    description: "This is a placeholder to keep the folder structure",
    code: "",
    tags: ["placeholder"],
    folder: folderName,
    inactive: true
  };
  await addSnippet(placeholder);
}

// Add this function to find and remove placeholder snippets in a folder
async function removePlaceholderSnippet(folderName: string): Promise<void> {
  const db = await openDB<SnippetDB>(DB_NAME, 1);
  const snippets = await getSnippetsInFolder(folderName);
  
  // Find and delete placeholder snippets in the folder
  for (const snippet of snippets) {
    if (snippet.inactive && snippet.id) {
      await db.delete(STORE_NAME, snippet.id);
    }
  }
} 