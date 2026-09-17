import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export interface CartItem {
  sku: string;
  quantity: number;
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;
  private fallbackStore: Map<string, string> = new Map();
  private isConnected = false;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('REDIS_PORT', 6379);

    try {
      this.client = new Redis({
        host,
        port,
        retryStrategy: (times) => {
          if (times > 3) {
            this.logger.warn('Redis connection failed. Switching to in-memory cart fallback mode.');
            return null;
          }
          return Math.min(times * 100, 2000);
        },
        maxRetriesPerRequest: 1,
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.log(`Connected to Redis server at ${host}:${port}`);
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        this.logger.warn(`Redis Error: ${err.message}. Fallback store enabled.`);
      });
    } catch (e) {
      this.logger.warn('Failed to initialize Redis client. Using fallback store.');
    }
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
    }
  }

  async getCart(shopId: string): Promise<CartItem[]> {
    const key = `cart:${shopId}`;
    if (this.isConnected && this.client) {
      try {
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : [];
      } catch {
        // Fallback
      }
    }
    const val = this.fallbackStore.get(key);
    return val ? JSON.parse(val) : [];
  }

  async setCart(shopId: string, items: CartItem[]): Promise<void> {
    const key = `cart:${shopId}`;
    const dataStr = JSON.stringify(items);
    if (this.isConnected && this.client) {
      try {
        await this.client.set(key, dataStr);
        return;
      } catch {
        // Fallback
      }
    }
    this.fallbackStore.set(key, dataStr);
  }

  async clearCart(shopId: string): Promise<void> {
    const key = `cart:${shopId}`;
    if (this.isConnected && this.client) {
      try {
        await this.client.del(key);
        return;
      } catch {
        // Fallback
      }
    }
    this.fallbackStore.delete(key);
  }
}
