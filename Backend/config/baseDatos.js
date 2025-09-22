import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql'
  })

export async function db () {
  try {
    await sequelize.authenticate()
  } catch (error) {
    throw new Error('error al conectarse a la base de datos', error)
  }
}

export default sequelize
