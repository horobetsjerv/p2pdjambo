import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {


  app.get("/api/gc_callback", async (req, res) => {
    console.log("Получены данные от GetCourse:", req.query);

    // Функция sleep
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    await sleep(15000); // ждем 15 секунд перед запросом

    const url = "https://djambocommunity.getcourse.ru/pl/api/account/deals?key=6o9VC1KAml7oyN5U9Nt1489CmDJTebhfBAn6yFrED6dMa61mVxHLhHP7AYTLZvS8FwClUuf1JWSwQMrASIzurR5OWx3TLIKkFYEQ9JZlqfi8pMF2Kd7KkMg34RfiWA5E&status=in_work&created_at[from]=2025-07-20";

    try {
      const response = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } });

      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      console.log("Сделки успешно получены:", data);
      res.status(200).json({ ok: true, data });
    } catch (err) {
      console.error("Не удалось получить сделки:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  // try {

  //   await fetch("http://localhost:8000/notify", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       message: `Новая заявка от GetCourse: ${JSON.stringify(req.query)}`,
  //     }),
  //   });
  // } catch (err) {
  //   console.error("Не удалось отправить сообщение в Telegram:", err);
  // }



  // Registration endpoint
  app.post("/api/register", async (req, res) => {
    try {
      const validatedData = insertRegistrationSchema.parse(req.body);
      const registration = await storage.createRegistration(validatedData);

      // Send to Telegram bot
      await sendToTelegramBot(registration);

      res.json({ success: true, id: registration.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Ошибка валидации данных",
          errors: error.errors
        });
      } else {
        console.error("Registration error:", error);
        res.status(500).json({
          success: false,
          message: "Произошла ошибка при обработке заявки"
        });
      }
    }
  });

  // Get registrations endpoint (for admin purposes)
  app.get("/api/registrations", async (req, res) => {
    try {
      const registrations = await storage.getRegistrations();
      res.json(registrations);
    } catch (error) {
      console.error("Get registrations error:", error);
      res.status(500).json({
        success: false,
        message: "Ошибка получения данных"
      });
    }
  });


  app.post("/api/deal", async (req, res) => {
    const key =
      "6o9VC1KAml7oyN5U9Nt1489CmDJTebhfBAn6yFrED6dMa61mVxHLhHP7AYTLZvS8FwClUuf1JWSwQMrASIzurR5OWx3TLIKkFYEQ9JZlqfi8pMF2Kd7KkMg34RfiWA5E";

    try {
      const response = await fetch("https://djambocommunity.getcourse.ru/pl/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          action: "add",
          key: key,
          params: req.body.params
        })
      });

      const data = await response.json();
      if (data.success && data.result?.payment_link) {
        res.json({ success: true, payment_link: data.result.payment_link });
      } else {
        res.status(400).json({ success: false, message: "Не удалось получить payment_link", data });
      }
      console.log(req.body.decoded);
      try {
        await fetch("https://0227aa62b56c.ngrok-free.app/create_order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: req.body.decoded // 
        });
      } catch (err) {
        console.error("Не удалось отправить заказ в Telegram бот:", err);
      }


    } catch (err) {
      console.error("Ошибка запроса в GetCourse:", err);
      res.status(500).json({ error: "Ошибка соединения с GetCourse" });
    }
  });
  const httpServer = createServer(app);
  return httpServer;
}

async function sendToTelegramBot(registration: any) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || process.env.BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || process.env.CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("Telegram bot token or chat ID not configured");
    return;
  }

  const message = `
🚀 *Новая заявка на криптоинтенсив!*

👤 *Имя:* ${registration.name}
📱 *Телефон:* ${registration.phone}
📧 *Email:* ${registration.email}
📊 *Опыт:* ${registration.experience || "Не указан"}
📅 *Дата:* ${new Date().toLocaleString("ru-RU")}

#новаязаявка #криптоинтенсив
  `;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }

    console.log("Message sent to Telegram successfully");
  } catch (error) {
    console.error("Failed to send message to Telegram:", error);
  }
}
