import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "Oxz8eU0CipNGMcKz4XVpJuKQ7ySOXodc";
const PROJECT = "aspan-store";
const AUTHOR = "Aspan-Official";

// test supaya tidak Cannot GET /
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Backend aktif 🚀", author: AUTHOR });
});

app.post("/qris", async (req, res) => {
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
