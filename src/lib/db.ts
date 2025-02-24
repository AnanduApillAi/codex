import { openDB, DBSchema } from 'idb';
import { SnippetDetails } from '@/types/snippets';

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
          id: 1,
          title: "Example Snippet 1",
          description: "A simple example snippet",
          code: {
            html: "console.log('Hello World');",
            css: "body { background-color: #f0f0f0; }",
            js: "console.log('Hello World');"
          },
          tags: ["javascript", "example"],
          createdAt: new Date()
        });

        store.put({
          id: 2,
          title: "Example Snippet 2",
          description: "Another example snippet",
          code: {
            html: "console.log('Hello World');",
            css: "body { background-color: #f0f0f0; }",
            js: "console.log('Hello World');"
          },
          tags: ["javascript", "example"],
          createdAt: new Date()
        });
      } else {
        console.log(`Object store ${STORE_NAME} already exists.`);
      }
    },
  });

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

export async function getSnippetById(id: number): Promise<SnippetDetails | null> {
  await initDB();
  const db = await openDB<SnippetDB>(DB_NAME, 1);
  const snippet = await db.get(STORE_NAME, id);
  return snippet || null;
}

export async function updateSnippet(id: number, snippet: SnippetDetails): Promise<IDBValidKey> {
  await initDB();
  const db = await openDB(DB_NAME, 1);
  return db.put('snippets', {
    id: snippet.id,
    title: snippet.title,
    description: snippet.description,
    code: snippet.code,
    tags: snippet.tags,
    createdAt: snippet.createdAt || new Date(),
    isFavorite: snippet.isFavorite,
    isTrash: snippet.isTrash
  });
}

export async function addSnippet(snippet: SnippetDetails): Promise<number> {
  await initDB();
  const db = await openDB<SnippetDB>(DB_NAME, 1);
  
  const {id, ...rest} = snippet;
  const newSnippet = {
    ...rest
  };
  
  console.log("Adding snippet:", newSnippet);
  return db.add(STORE_NAME, newSnippet);
}

export async function deleteSnippet(id: number): Promise<boolean> {
    try {
        await initDB();
        const db = await openDB<SnippetDB>(DB_NAME, 1);
        await db.delete(STORE_NAME, id);
        return true;
    } catch (error) {
        console.error("Failed to delete snippet:", error);
        return false;
    }
}


export async function getAllTags(): Promise<string[]> {
  try {
    await initDB();
    const db = await openDB<SnippetDB>(DB_NAME, 1);
    const snippets = await db.getAll(STORE_NAME);
    
    // Flatten all tag arrays and get unique values
    const uniqueTags = [...new Set(
      snippets.flatMap(snippet => snippet.tags)
    )]
      .filter(Boolean)
      .sort();
    
    return uniqueTags;
  } catch (error) {
    console.error("Failed to fetch tags:", error);
    throw error;
  }
}

// Add this new function
// export async function renameFolder(oldFolderName: string, newFolderName: string): Promise<void> {
//   const db = await openDB<SnippetDB>(DB_NAME, 1);
//   const snippets = await db.getAll(STORE_NAME);
  
//   // Find all snippets in the old folder (both active and inactive)
//   const folderSnippets = snippets.filter(s => s.folder === oldFolderName);
  
//   // Update all snippets with the new folder name
//   for (const snippet of folderSnippets) {
//     if (snippet.id) {
//       await db.put(STORE_NAME, {
//         ...snippet,
//         folder: newFolderName
//       });
//     }
//   }
// } 