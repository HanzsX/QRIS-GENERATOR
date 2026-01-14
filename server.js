import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = "kIb2krvypAo8WYYjvI5tOyHInS5ftmil";
const PROJECT = "raff-coffe";
const AUTHOR = "Aspan-Official"; // ⬅️ TAMBAHAN

app.post("/qris", async (req, res) => {
  try {
    const { order_id, amount } = req.body;

    const response = await fetch(
      "https://app.pakasir.com/api/transactioncreate/qris",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project: PROJECT,
          order_id,
          amount,
          api_key: API_KEY
        })
      }
    );

    const data = await response.json();

    // ⬇️ KIRIM AUTHOR KE FRONTEND
    res.json({
      ...data,
      author: AUTHOR
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
      author: AUTHOR
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API running"));
