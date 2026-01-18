import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ENV dari Vercel
const PAKASIR_PROJECT = "aspan-store";
const PAKASIR_APIKEY = "Oxz8eU0CipNGMcKz4XVpJuKQ7ySOXodc";

// test
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend aktif" });
});

// create qris invoice
app.post("/api/create-qris", async (req, res) => {
  try {
    const { order_id, amount } = req.body;

    if (!order_id || !amount) {
      return res.status(400).json({
        success: false,
        message: "order_id atau amount kosong",
      });
    }

    const pakasirUrl = "https://app.pakasir.com/api/transactioncreate/qris";

    const payload = {
      project: PAKASIR_PROJECT,
      order_id: order_id,
      amount: Number(amount),
      api_key: PAKASIR_APIKEY,
    };

    const response = await fetch(pakasirUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({
        success: false,
        message: "Pakasir error",
        raw: data,
      });
    }

    const payment = data.payment;
    if (!payment) {
      return res.status(500).json({
        success: false,
        message: "Response tidak valid",
        raw: data,
      });
    }

    // QR string -> jadi gambar QR (demo pakai qrserver)
    const qrString = payment.payment_number || "";
    const qrImage =
      "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
      encodeURIComponent(qrString);

    return res.json({
      success: true,
      order_id: payment.order_id,
      total_payment: payment.total_payment,
      expired_at: payment.expired_at,
      qr_image: qrImage,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default app;
