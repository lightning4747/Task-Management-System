import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

/*
 * Connection priority:
 *
 * 1. MYSQL_PUBLIC_URL — Railway public proxy URL.
 *    ✅ Use this locally when connecting TO Railway from your machine.
 *    e.g. mysql://root:pass@maglev.proxy.rlwy.net:23734/railway
 *
 * 2. MYSQL_URL — Railway private/internal URL.
 *    ✅ Railway injects this automatically inside its own network.
 *    e.g. mysql://root:pass@mysql.railway.internal:3306/railway
 *    ❌ Does NOT work from outside Railway (ETIMEDOUT).
 *
 * 3. Individual MYSQLHOST/MYSQLUSER/... vars — also injected by Railway.
 *
 * 4. Legacy DB_* vars — local fallback.
 */

let sequelize: Sequelize;

const connectionUrl =
    process.env.MYSQL_PUBLIC_URL ||   // local → Railway via public proxy
    process.env.MYSQL_URL;            // inside Railway → private network

if (connectionUrl) {
    sequelize = new Sequelize(connectionUrl, {
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            connectTimeout: 20000,
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    });
} else {
    // ── Separate params (Railway plugin vars or local DB_* vars) ──────────
    const database = process.env.MYSQLDATABASE ?? process.env.DB_NAME ?? 'kanban_db';
    const username = process.env.MYSQLUSER ?? process.env.DB_USER ?? 'root';
    const password = process.env.MYSQLPASSWORD ?? process.env.DB_PASS ?? '';
    const host = process.env.MYSQLHOST ?? process.env.DB_HOST ?? 'localhost';
    const port = parseInt(process.env.MYSQLPORT ?? '3306', 10);

    sequelize = new Sequelize(database, username, password, {
        host,
        port,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
            connectTimeout: 20000,
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    });
}

export default sequelize;
