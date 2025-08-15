import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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
