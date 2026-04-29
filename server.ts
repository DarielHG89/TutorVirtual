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
