import { Sequelize } from "sequelize"
import * as dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize(
  process.env.DB_NAME,      
  process.env.DB_USER,      
  process.env.DB_PASSWORD,  
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false
  }
);

export async function db() {
  try {
    await sequelize.authenticate();
    console.log("Conexión exitosa a la base de datos PostgreSQL")
  } catch (error) {
    console.error("Error al conectarse a la base de datos:", error)
    throw error
  }
}

export default sequelize


