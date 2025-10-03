import { Sequelize } from 'sequelize'
import * as dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306
  }
)

export async function db () {
  try {
    await sequelize.authenticate()
    console.log('Conexión exitosa a la base de datos MySQL')
  } catch (error) {
    console.error('Error al conectarse a la base de datos:', error)
    throw new Error('Error al conectarse a la base de datos')
  }
}

export default sequelize
