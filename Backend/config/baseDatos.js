import { Sequelize } from "sequelize";

const sequelize = new Sequelize('calzados','root','root',{
  host:'localhost',
  dialect: 'mysql'
})

export async function db() {
  try {
    await sequelize.authenticate()
  } catch (error) {
    throw new Error("error al conectarse a la base de datos", error);
  }
}

export default sequelize