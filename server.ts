import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";

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

  // Ensure data folder exists
  const DATA_DIR = path.join(process.cwd(), "data");
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const siteSettingsPath = path.join(DATA_DIR, "site_settings.json");
  const productsPath = path.join(DATA_DIR, "products.json");
  const couponsPath = path.join(DATA_DIR, "coupons.json");
  const ordersPath = path.join(DATA_DIR, "orders.json");

  // Load endpoints
  app.get("/api/site-settings", (req, res) => {
    try {
      if (fs.existsSync(siteSettingsPath)) {
        const data = fs.readFileSync(siteSettingsPath, "utf-8");
        return res.json(JSON.parse(data));
      }
    } catch (e) {
      console.error("Error reading site settings:", e);
    }
    res.json(null);
  });

  app.post("/api/site-settings", (req, res) => {
    try {
      fs.writeFileSync(siteSettingsPath, JSON.stringify(req.body, null, 2), "utf-8");
      return res.json({ success: true });
    } catch (e: any) {
      console.error("Error saving site settings:", e);
      return res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/products", (req, res) => {
    try {
      if (fs.existsSync(productsPath)) {
        const data = fs.readFileSync(productsPath, "utf-8");
        return res.json(JSON.parse(data));
      }
    } catch (e) {
      console.error("Error reading products:", e);
    }
    res.json(null);
  });

  app.post("/api/products", (req, res) => {
    try {
      fs.writeFileSync(productsPath, JSON.stringify(req.body, null, 2), "utf-8");
      return res.json({ success: true });
    } catch (e: any) {
      console.error("Error saving products:", e);
      return res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/coupons", (req, res) => {
    try {
      if (fs.existsSync(couponsPath)) {
        const data = fs.readFileSync(couponsPath, "utf-8");
        return res.json(JSON.parse(data));
      }
    } catch (e) {
      console.error("Error reading coupons:", e);
    }
    res.json(null);
  });

  app.post("/api/coupons", (req, res) => {
    try {
      fs.writeFileSync(couponsPath, JSON.stringify(req.body, null, 2), "utf-8");
      return res.json({ success: true });
    } catch (e: any) {
      console.error("Error saving coupons:", e);
      return res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/orders", (req, res) => {
    try {
      if (fs.existsSync(ordersPath)) {
        const data = fs.readFileSync(ordersPath, "utf-8");
        return res.json(JSON.parse(data));
      }
    } catch (e) {
      console.error("Error reading orders:", e);
    }
    res.json([]);
  });

  app.post("/api/orders", (req, res) => {
    try {
      fs.writeFileSync(ordersPath, JSON.stringify(req.body, null, 2), "utf-8");
      return res.json({ success: true });
    } catch (e: any) {
      console.error("Error saving orders:", e);
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
