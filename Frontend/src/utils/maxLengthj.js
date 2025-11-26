
import toast from "react-hot-toast"

export const maxLengthChar = (text, maxLength) => {
  console.log('Validating max length for text:', text)
  if (text.length >= maxLength) {
    toast.error(`El texto no puede exceder los ${maxLength} caracteres.`)
    return text.slice(0, maxLength)
  }
}