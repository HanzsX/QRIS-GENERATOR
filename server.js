import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// ⚠️ lebih aman taruh di ENV, tapi ini dulu boleh
const API_KEY = "Oxz8eU0CipNGMcKz4XVpJuKQ7ySOXodc";
const PROJECT = "aspan-store";
const AUTHOR = "Aspan-Official";

// TEST
app.get("/api/health", (req, res) => {
  res.json({ ok: true, author: AUTHOR });
});

// CREATE QRIS
app.post("/api/create-qris", async (req, res) => {
  try {
    const { order_id, amount } = req.body;

    if (!order_id || !amount) {
      return res.status(400).json({
        success: false,
        message: "order_id dan amount wajib diisi",
        author: AUTHOR
      });
    }

    const response = await fetch(
      "https://app.pakasir.com/api/transactioncreate/qris",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: PROJECT,
          order_id,
          amount: Number(amount),
          api_key: API_KEY
        })
      }
    );

    const data = await response.json();

    return res.json({
      success: true,
      ...data,
      author: AUTHOR
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      author: AUTHOR
    });
  }
});

export default app;
