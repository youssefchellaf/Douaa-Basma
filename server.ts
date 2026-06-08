import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import {
  getSiteSettings,
  saveSiteSettings,
  getProducts,
  saveProducts,
  getCoupons,
  saveCoupons,
  getOrders,
  saveOrders
} from "./src/lib/firestore-service.ts";

// ES module path resolution fallback
let currentDir = process.cwd();
try {
  if (typeof __dirname !== "undefined") {
    currentDir = __dirname;
  } else if (import.meta && import.meta.url) {
    currentDir = path.dirname(fileURLToPath(import.meta.url));
  }
} catch (e) {
  // fallback
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse huge JSON bodies (necessary for base64 images)
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Serve static assets out of src/assets directly in both dev and prod
  app.use("/src/assets", express.static(path.join(process.cwd(), "src/assets")));

  // Image proxy router for external URLs and Google Drive links to prevent third-party referrer/security blocking
  app.get("/api/proxy-image", async (req, res) => {
    const imageUrl = req.query.url as string;
    if (!imageUrl) {
      return res.status(400).send("No image URL provided");
    }

    try {
      const response = await fetch(imageUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`Proxy fetch failed: ${response.status} ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type") || "image/jpeg";
      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=31536000"); // Cache for 1 year (static asset caching)
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return res.send(buffer);
    } catch (e: any) {
      console.error("Error in `/api/proxy-image`:", e);
      // Fallback redirect if server proxy fails for a transient reason
      return res.redirect(imageUrl);
    }
  });

  // Ensure data folder exists as a backup/local fallback
  const DATA_DIR = path.join(process.cwd(), "data");
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Load cloud endpoints
  app.get("/api/site-settings", async (req, res) => {
    try {
      const settings = await getSiteSettings();
      return res.json(settings);
    } catch (e: any) {
      console.error("Error in GET /api/site-settings:", e);
      return res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/site-settings", async (req, res) => {
    try {
      const success = await saveSiteSettings(req.body);
      return res.json({ success });
    } catch (e: any) {
      console.error("Error in POST /api/site-settings:", e);
      return res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const products = await getProducts();
      return res.json(products);
    } catch (e: any) {
      console.error("Error in GET /api/products:", e);
      return res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const success = await saveProducts(req.body);
      return res.json({ success });
    } catch (e: any) {
      console.error("Error in POST /api/products:", e);
      return res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/coupons", async (req, res) => {
    try {
      const coupons = await getCoupons();
      return res.json(coupons);
    } catch (e: any) {
      console.error("Error in GET /api/coupons:", e);
      return res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/coupons", async (req, res) => {
    try {
      const success = await saveCoupons(req.body);
      return res.json({ success });
    } catch (e: any) {
      console.error("Error in POST /api/coupons:", e);
      return res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await getOrders();
      return res.json(orders);
    } catch (e: any) {
      console.error("Error in GET /api/orders:", e);
      return res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const success = await saveOrders(req.body);
      return res.json({ success });
    } catch (e: any) {
      console.error("Error in POST /api/orders:", e);
      return res.status(500).json({ error: e.message });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
