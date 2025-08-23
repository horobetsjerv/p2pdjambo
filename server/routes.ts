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

    const url = "https://djambocommunity.getcourse.ru/pl/api/account/deals?key=6o9VC1KAml7oyN5U9Nt1489CmDJTebhfBAn6yFrED6dMa61mVxHLhHP7AYTLZvS8FwClUuf1JWSwQMrASIzurR5OWx3TLIKkFYEQ9JZlqfi8pMF2Kd7KkMg34RfiWA5E&created_at[from]=2025-07-20";

    try {
      const response = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } });

      if (!response.ok) throw new Error(response.statusText);
      const data = await response.json();
      const exportId = data.info.export_id;
      await sleep(15000);
      const ids = await storage.getAllDealIds()
      try {
        console.log("exportId", exportId)
        const response = await fetch(`https://djambocommunity.getcourse.ru/pl/api/account/exports/${exportId}?key=6o9VC1KAml7oyN5U9Nt1489CmDJTebhfBAn6yFrED6dMa61mVxHLhHP7AYTLZvS8FwClUuf1JWSwQMrASIzurR5OWx3TLIKkFYEQ9JZlqfi8pMF2Kd7KkMg34RfiWA5E`)
        const data = await response.json();
        const items = data.info.items
        const filteredItems = items.filter((item) => ids.includes(String(item[1])));
        for (const item of filteredItems) {
          const dealNumber = String(item[1]); // номер заказа
          const newStatus = String(item[9]);
          const existingOrder = await storage.getOrderByDealNumber(dealNumber);

          if (existingOrder) {
            // Проверяем: если статус изменился и стал "Завершен"
            if (existingOrder.status !== newStatus && newStatus === "Завершен") {
              // Обновляем статус в БД
              const updated = await storage.updateOrderStatus(dealNumber, newStatus);

              // Отправляем уведомление
              try {
                await fetch("http://localhost:8000/notify", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    message: `Заявка ${dealNumber} обновлена на "${newStatus}"`,
                    order: updated // данные из БД после обновления
                  }),
                });
                console.log(`Уведомление отправлено для ${dealNumber}`);
              } catch (err) {
                console.error("Не удалось отправить уведомление:", err);
              }
            }
          }
        }
        console.log("Filtered Items:", filteredItems);
        if (!data.success) {
          throw new Error("Не удалось получить данные экспорта");
        }

      } catch (err) {
        console.error("Ошибка при обработке данных:", err);
      }
      console.log("Сделки успешно получены:", data);
      res.status(200).json({ ok: true, data });
    } catch (err) {
      console.error("Не удалось получить сделки:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  app.get("/api/check-payment/:dealNumber", async (req, res) => {
    const key =
      "6o9VC1KAml7oyN5U9Nt1489CmDJTebhfBAn6yFrED6dMa61mVxHLhHP7AYTLZvS8FwClUuf1JWSwQMrASIzurR5OWx3TLIKkFYEQ9JZlqfi8pMF2Kd7KkMg34RfiWA5E";

    const dealNumber = req.params.dealNumber;

    if (!dealNumber) {
      return res.status(400).json({ error: "dealNumber is required" });
    }

    try {
      const url = `https://djambocommunity.getcourse.ru/pl/api/account/deals?key=${key}&created_at[from]=2025-07-20`;
      const response = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } });
      if (!response.ok) throw new Error(response.statusText);

      const data = await response.json();
      const exportId = data.info.export_id;

      // ждем пока экспорт соберется
      await new Promise(r => setTimeout(r, 15000));

      const exportResponse = await fetch(
        `https://djambocommunity.getcourse.ru/pl/api/account/exports/${exportId}?key=${key}`
      );
      const exportData = await exportResponse.json();

      const items = exportData.info.items;
      const foundItem = items.find(item => String(item[1]) === dealNumber);

      if (!foundItem) {
        return res.status(404).json({ error: "Deal not found" });
      }

      const newStatus = String(foundItem[9]); // Статус сделки
      const existingOrder = await storage.getOrderByDealNumber(dealNumber);

      let updatedOrder = null;
      if (existingOrder && existingOrder.status !== newStatus) {
        updatedOrder = await storage.updateOrderStatus(dealNumber, newStatus);
      }

      res.json({
        success: true,
        dealNumber,
        status: newStatus,
        updated: updatedOrder,
        paid: newStatus === "Завершен"
      });
    } catch (err) {
      console.error("Ошибка проверки оплаты:", err);
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
      let dealData = req.body.decoded;
      if (typeof dealData === "string") {
        try {
          dealData = JSON.parse(dealData);
        } catch (e) {
          console.error("Не удалось распарсить decoded:", req.body.decoded);
          return;
        }
      }
      if (!dealData?.deal) {
        console.error("Ошибка: нет deal в decoded", dealData);
        return;
      }
      const { deal } = dealData;
      console.log(deal);
      console.log("req.body:", req.body);
      try {
        if (!dealData?.deal?.deal_comment) {
          console.error("Ошибка: в req.body.decoded отсутствуют данные о сделке.");
          return;
        }

        const { deal } = dealData;
        const parts = String(deal.deal_comment).split(" ");

        // Парсим данные из комментария сделки
        const orderToSave = {
          name: parts[0] || "Имя не найдено",
          telegram: parts.find(p => p.startsWith("@")) || null,
          phone: parts.find(p => p.startsWith("+")) || null,
          email: parts.find(p => p.includes("@") && !p.startsWith("@")) || null,
          experience: parts.find(p => ["beginner", "intermediate", "advanced"].includes(p)) || null,
          status: deal.deal_status,
          deal_number: String(deal.deal_number)
        };

        // Вызываем метод из нашего PgStorage
        await storage.createOrder(orderToSave);

      } catch (dbError) {
        console.error("Не удалось сохранить заказ в БД:", dbError);
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
