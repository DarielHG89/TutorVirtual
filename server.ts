import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Dynamic automatic downloader for offline emoji font (Google Noto Color Emoji)
  const publicDir = path.join(process.cwd(), 'public');
  const fontPath = path.join(publicDir, 'NotoColorEmoji.ttf');
  const fontUrl = 'https://fonts.gstatic.com/s/notocoloremoji/v39/Yq6P-KqIXTD0t4D9z1ESnKM3-HpFab4.ttf';

  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  if (!fs.existsSync(fontPath)) {
    console.log(`[Font Downloader] Noto Color Emoji font not found at ${fontPath}. Downloading offline asset...`);
    fetch(fontUrl)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP status ${res.status}`);
        return res.arrayBuffer();
      })
      .then(buffer => {
        fs.writeFileSync(fontPath, Buffer.from(buffer));
        console.log(`[Font Downloader] Noto Color Emoji successfully saved at ${fontPath} for complete offline support.`);
      })
      .catch(err => {
        console.error('[Font Downloader] Failed to retrieve emoji font:', err);
      });
  } else {
    console.log(`[Font Downloader] Noto Color Emoji font is ready locally at ${fontPath}.`);
  }

  // API Route to save content back to source files
  app.post("/api/save-content", async (req, res) => {
    const { type, data } = req.body;
    
    if (!type || !data) {
      return res.status(400).json({ error: "Missing type or data" });
    }

    try {
      console.log(`[API] Saving content type: ${type}`);
      if (type === 'lessons') {
        const filePath = path.join(process.cwd(), 'data', 'lessons.ts');
        console.log(`[API] Writing to: ${filePath}`);
        const content = `import type { LessonContent } from '../types';\n\nexport const lessons: LessonContent[] = ${JSON.stringify(data, null, 4)};\n`;
        fs.writeFileSync(filePath, content);
      } else if (type === 'questions') {
        const filePath = path.join(process.cwd(), 'data', 'questions.ts');
        console.log(`[API] Writing to: ${filePath}`);
        // This is more complex because questions usually import from categories.
        // For simplicity, we will save the unified questions object.
        const content = `import type { CategoryId, Question } from '../types';\n\nexport const questions: Record<CategoryId, Record<number, Question[]>> = ${JSON.stringify(data, null, 4)};\n`;
        fs.writeFileSync(filePath, content);
      } else if (type === 'taxonomy') {
        const filePath = path.join(process.cwd(), 'data', 'taxonomy.ts');
        const content = `import type { AppTaxonomy } from '../types';\n\nexport const taxonomyData: AppTaxonomy = ${JSON.stringify(data, null, 2)};\n`;
        fs.writeFileSync(filePath, content);
      }
      console.log(`[API] Successfully saved ${type}`);
      res.json({ success: true, message: `Persistido en el servidor (${type})` });
    } catch (error) {
      console.error("Error saving content:", error);
      res.status(500).json({ error: "Failed to save to disk" });
    }
  });

  // API Route to fetch latest content
  app.get("/api/content", (req, res) => {
    try {
      const taxonomyStr = fs.readFileSync(path.join(process.cwd(), 'data', 'taxonomy.ts'), 'utf-8');
      const lessonsStr = fs.readFileSync(path.join(process.cwd(), 'data', 'lessons.ts'), 'utf-8');
      const questionsStr = fs.readFileSync(path.join(process.cwd(), 'data', 'questions.ts'), 'utf-8');

      // The files are exports in ts, but we can extract the JSON part
      const extractJSON = (str: string, varName: string) => {
        const startIdx = str.indexOf('= {') !== -1 ? str.indexOf('= {') + 2 : str.indexOf('= [') + 2;
        if (startIdx === 1) return null;
        let endIdx = str.lastIndexOf(';');
        if (endIdx === -1) endIdx = str.length;
        const jsonStr = str.substring(startIdx, endIdx).trim();
        try {
          return JSON.parse(jsonStr);
        } catch {
          // If parsing fails, it might be due to trailing commas or unexpected format, fallback needed
          // but since save-content writes clean JSON output, it should parse.
          return null;
        }
      };

      res.json({
        taxonomy: extractJSON(taxonomyStr, 'taxonomyData'),
        lessons: extractJSON(lessonsStr, 'lessons'),
        questions: extractJSON(questionsStr, 'questions')
      });
    } catch (e) {
      res.status(500).json({ error: "Failed to read content" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
