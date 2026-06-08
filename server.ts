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
