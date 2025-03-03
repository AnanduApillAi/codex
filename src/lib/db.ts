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
          title: "Interactive Card Flip",
          description: "A smooth 3D card flip animation with hover effect",
          code: {
            html: `<div class="card">
  <div class="card-inner">
    <div class="card-front">
      <h2>Hover Me</h2>
    </div>
    <div class="card-back">
      <p>Hello from the other side!</p>
    </div>
  </div>
</div>`,
            css: `.card {
  width: 300px;
  height: 200px;
  perspective: 1000px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  cursor: pointer;
}

.card:hover .card-inner {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.card-front {
  background: linear-gradient(45deg, #ff6b6b, #ff8e8e);
  color: white;
}

.card-back {
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  color: white;
  transform: rotateY(180deg);
}`,
            js: "// Pure CSS animation - no JavaScript required!"
          },
          tags: ["css", "animation", "interactive", "3d"],
          createdAt: new Date(),
          isFavorite: false,
          isTrash: false
        });

        store.put({
          id: 2,
          title: "Animated Loading Button",
          description: "Button with loading spinner and success state",
          code: {
            html: `<button class="submit-button">
  <span class="button-text">Submit</span>
  <span class="loading-spinner"></span>
  <span class="success-icon">✓</span>
</button>`,
            css: `.submit-button {
  position: relative;
  padding: 12px 24px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.loading-spinner {
  display: none;
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.success-icon {
  display: none;
  font-size: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.button-loading .button-text { display: none; }
.button-loading .loading-spinner { display: inline-block; }
.button-success .button-text { display: none; }
.button-success .loading-spinner { display: none; }
.button-success .success-icon { display: inline-block; }`,
            js: `document.querySelector('.submit-button').addEventListener('click', function() {
  const button = this;
  button.classList.add('button-loading');
  
  // Simulate API call
  setTimeout(() => {
    button.classList.remove('button-loading');
    button.classList.add('button-success');
    
    // Reset button after 2 seconds
    setTimeout(() => {
      button.classList.remove('button-success');
    }, 2000);
  }, 2000);
});`
          },
          tags: ["javascript", "css", "animation", "button", "ui"],
          createdAt: new Date(),
          isFavorite: false,
          isTrash: false
        });

        store.put({
          id: 3,
          title: "Parallax Scroll Gallery",
          description: "Smooth parallax scrolling image gallery",
          code: {
            html: `<div class="gallery">
  <div class="gallery-item" data-speed="0.5">
    <img src="https://picsum.photos/600/400?1" alt="Gallery Image 1">
  </div>
  <div class="gallery-item" data-speed="0.8">
    <img src="https://picsum.photos/600/400?2" alt="Gallery Image 2">
  </div>
  <div class="gallery-item" data-speed="1.1">
    <img src="https://picsum.photos/600/400?3" alt="Gallery Image 3">
  </div>
</div>`,
            css: `.gallery {
  height: 100vh;
  overflow-y: scroll;
  perspective: 1px;
  transform-style: preserve-3d;
}

.gallery-item {
  position: relative;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-style: preserve-3d;
}

.gallery-item img {
  width: 60%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
}

.gallery-item img:hover {
  transform: scale(1.05);
}`,
            js: `document.addEventListener('scroll', () => {
  const items = document.querySelectorAll('.gallery-item');
  
  items.forEach(item => {
    const speed = item.getAttribute('data-speed');
    const yPos = -(window.pageYOffset * speed);
    item.style.transform = \`translateY(\${yPos}px)\`;
  });
});`
          },
          tags: ["javascript", "css", "parallax", "gallery", "scroll"],
          createdAt: new Date(),
          isFavorite: false,
          isTrash: false
        });

        store.put({
          id: 4,
          title: "Glassmorphism Calculator",
          description: "Modern calculator with glassmorphism effect",
          code: {
            html: `<div class="calculator">
        <input type="text" id="display" disabled>
        <div class="buttons">
            <button onclick="clearDisplay()">C</button>
            <button onclick="appendToDisplay('7')">7</button>
            <button onclick="appendToDisplay('8')">8</button>
            <button onclick="appendToDisplay('9')">9</button>
            <button onclick="appendToDisplay('/')">/</button>
            
            <button onclick="appendToDisplay('4')">4</button>
            <button onclick="appendToDisplay('5')">5</button>
            <button onclick="appendToDisplay('6')">6</button>
            <button onclick="appendToDisplay('*')">*</button>

            <button onclick="appendToDisplay('1')">1</button>
            <button onclick="appendToDisplay('2')">2</button>
            <button onclick="appendToDisplay('3')">3</button>
            <button onclick="appendToDisplay('-')">-</button>

            <button onclick="appendToDisplay('0')">0</button>
            <button onclick="appendToDisplay('.')">.</button>
            <button onclick="calculateResult()">=</button>
            <button onclick="appendToDisplay('+')">+</button>
        </div>
    </div>`,
            css: `.calculator {
    width: 300px;
    padding: 20px;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    text-align: center;
}
body{
    background-color: #000;
}
#display {
    width: 100%;
    height: 60px;
    margin-bottom: 10px;
    padding: 10px;
    font-size: 1.5em;
    text-align: right;
    border: none;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    border-radius: 10px;
    outline: none;
}

.buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
}

button {
    width: 100%;
    padding: 15px;
    font-size: 1.2em;
    border: none;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.3);
    color: white;
    backdrop-filter: blur(10px);
    cursor: pointer;
    transition: 0.3s;
}

button:hover {
    background: rgba(255, 255, 255, 0.5);
}`,
            js: `function appendToDisplay(value) {
    document.getElementById("display").value += value;
}

function clearDisplay() {
    document.getElementById("display").value = "";
}

function calculateResult() {
    try {
        document.getElementById("display").value = eval(document.getElementById("display").value);
    } catch (error) {
        document.getElementById("display").value = "Error";
    }
}
`
          },
          tags: ["javascript", "css", "calculator", "glassmorphism", "ui"],
          createdAt: new Date(),
          isFavorite: false,
          isTrash: false
        });

        store.put({
          id: 5,
          title: "Particle Text Effect",
          description: "Interactive particle text animation",
          code: {
            html: `<canvas id="canvas"></canvas>
<h1 id="text">HOVER ME</h1>`,
            css: `canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

#text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 80px;
  color: transparent;
  z-index: 2;
  cursor: pointer;
}`,
            js: `const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const text = document.getElementById('text');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 2;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = (Math.random() * 30) + 1;
  }

  draw() {
    ctx.fillStyle = '#4facfe';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update(mouseX, mouseY) {
    let dx = mouseX - this.x;
    let dy = mouseY - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / distance;
    let forceDirectionY = dy / distance;
    let maxDistance = 100;
    let force = (maxDistance - distance) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (distance < maxDistance) {
      this.x -= directionX;
      this.y -= directionY;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx/10;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy/10;
      }
    }
  }
}

let particleArray = [];
function init() {
  particleArray = [];
  
  const textRect = text.getBoundingClientRect();
  const fontSize = 100;
  ctx.font = \`\${fontSize}px Arial\`;
  ctx.fillStyle = 'white';
  ctx.fillText('HOVER ME', textRect.left, textRect.top + fontSize);
  
  const textData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  for (let y = 0; y < textData.height; y += 4) {
    for (let x = 0; x < textData.width; x += 4) {
      if (textData.data[(y * 4 * textData.width) + (x * 4) + 3] > 128) {
        particleArray.push(new Particle(x, y));
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  particleArray.forEach(particle => {
    particle.draw();
    particle.update(mouse.x, mouse.y);
  });
  
  requestAnimationFrame(animate);
}

const mouse = {
  x: null,
  y: null,
  radius: 100
};

document.addEventListener('mousemove', (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});

init();
animate();`
          },
          tags: ["javascript", "canvas", "animation", "particles", "interactive"],
          createdAt: new Date(),
          isFavorite: false,
          isTrash: false
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

export async function addSnippet(snippet: SnippetDetails): Promise<SnippetDetails> {
  await initDB();
  const db = await openDB<SnippetDB>(DB_NAME, 1);

  const { id, ...rest } = snippet;
  const newSnippet = {
    ...rest
  };

  console.log("Adding snippet:", newSnippet);
  const newId = await db.add(STORE_NAME, newSnippet);

  // Return the complete snippet with the new ID
  return {
    ...newSnippet,
    id: newId as number
  };
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