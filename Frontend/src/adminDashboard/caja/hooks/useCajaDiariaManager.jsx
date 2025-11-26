import { useInvalidarCajaDiaria } from "./useCajaDiaria"

export const useCajaDiariaManager = () => {
  const { invalidarQueries } = useInvalidarCajaDiaria()

  return {
    invalidarQueries
  }
}