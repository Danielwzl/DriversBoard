/**
 * Lightweight "class ORM" base class: use an object to describe a row of data, generate INSERT statements uniformly, and avoid writing SQL拼接 in various places.
 * Still based on better-sqlite3 (synchronous), without introducing heavy ORM dependencies.
 */
export class BaseRepository {
  /**
   * @param {import("better-sqlite3").Database} db
   */
  constructor(db) {
    this.db = db;
  }

  /**
   * @param {string} table The table name (internal constant, forbidden from user input)
   * @param {Record<string, unknown>} row The keys of the row must match the column names in the database
   * @returns {import("better-sqlite3").RunResult}
   */
  insertInto(table, row) {
    const cols = Object.keys(row);
    const colSql = cols.map((c) => `"${c}"`).join(", ");
    const placeholders = cols.map((c) => `@${c}`).join(", ");
    const sql = `INSERT INTO ${table} (${colSql}) VALUES (${placeholders})`; // safe sql injection
    return this.db.prepare(sql).run(row);
  }
}
