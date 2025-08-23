import { type User, type InsertUser, type Registration, type InsertRegistration } from "@shared/schema";
import { randomUUID } from "crypto";
import { Pool } from "pg"; // <-- РЕШЕНИЕ ПРОБЛЕМЫ 2: Добавлен импорт

// --- Интерфейсы ---

export interface IOrder {
  name: string;
  telegram: string | null;
  phone: string | null;
  email: string | null;
  experience: string | null;
  status: string;
  deal_number: string;
}

// РЕШЕНИЕ ПРОБЛЕМЫ 1: Мы упростили интерфейс, оставив только то, что реально используется.
export interface IStorage {
  createOrder(order: IOrder): Promise<any>;
}

// --- Реализация PostgreSQL ---

export class PgStorage implements IStorage {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: "postgresql://postgres:root@109.120.138.85:5432/p2p",
      ssl: false
    });
    console.log("PostgreSQL storage initialized.");
  }

  // Теперь класс PgStorage корректно реализует интерфейс IStorage,
  // так как в интерфейсе остался только один метод, и он здесь есть.
  async createOrder(orderData: IOrder): Promise<any> {
    const query = `
      INSERT INTO orders (name, telegram, phone, email, experience, status, deal_number)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [
      orderData.name,
      orderData.telegram,
      orderData.phone,
      orderData.email,
      orderData.experience,
      orderData.status,
      orderData.deal_number
    ];

    try {
      const result = await this.pool.query(query, values);
      console.log("Заказ успешно сохранен в БД:", result.rows[0]);
      return result.rows[0];
    } catch (error) {
      console.error("Ошибка при сохранении заказа в БД:", error);
      throw error;
    }
  }

  async getAllDealIds(): Promise<string[]> {
    const query = `SELECT deal_number FROM orders;`;
    try {
      const result = await this.pool.query(query);
      return result.rows.map(row => String(row.deal_number));
    } catch (error) {
      console.error("Ошибка при получении deal_number из БД:", error);
      throw error;
    }
  }

  async getOrderByDealNumber(dealNumber: string) {
    const query = `SELECT * FROM orders WHERE deal_number = $1 LIMIT 1;`;
    const result = await this.pool.query(query, [dealNumber]);
    return result.rows[0] || null;
  }

  async updateOrderStatus(dealNumber: string, newStatus: string) {
    const query = `UPDATE orders SET status = $1 WHERE deal_number = $2 RETURNING *;`;
    const result = await this.pool.query(query, [newStatus, dealNumber]);
    return result.rows[0];
  }

}

// Экспортируем экземпляр PgStorage для использования во всем приложении
export const storage = new PgStorage();