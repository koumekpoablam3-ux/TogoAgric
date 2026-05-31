import fs from 'fs';
import path from 'path';

// ============================================
// TogoAgric v4 - Pure JSON Database Layer
// NO native modules required - works on any OS
// ============================================

export interface DbData {
  Region: Record<string, any>[];
  Product: Record<string, any>[];
  Market: Record<string, any>[];
  PriceRecord: Record<string, any>[];
  Listing: Record<string, any>[];
  WeatherForecast: Record<string, any>[];
  User: Record<string, any>[];
  ForumPost: Record<string, any>[];
  Notification: Record<string, any>[];
  PriceAlert: Record<string, any>[];
  Favorite: Record<string, any>[];
}

let _data: DbData | null = null;

export function getDb(): DbData {
  if (!_data) {
    const dbPath = path.join(process.cwd(), 'src', 'data', 'db.json');
    const raw = fs.readFileSync(dbPath, 'utf-8');
    _data = JSON.parse(raw);
  }
  return _data!;
}

// In-memory store for user-created data (persisted during server lifetime)
const _listings: Record<string, any>[] = [];
const _forumPosts: Record<string, any>[] = [];
const _users: Record<string, any>[] = [];
const _alerts: Record<string, any>[] = [];
const _notifications: Record<string, any>[] = [];
const _favorites: Record<string, any>[] = [];
const _orders: Record<string, any>[] = [];

export function getInMemoryListings() { return _listings; }
export function getInMemoryForumPosts() { return _forumPosts; }
export function getInMemoryUsers() { return _users; }
export function getInMemoryAlerts() { return _alerts; }
export function getInMemoryNotifications() { return _notifications; }
export function getInMemoryFavorites() { return _favorites; }
export function getInMemoryOrders() { return _orders; }
