import { motion } from "motion/react"
import { useForm } from '@tanstack/react-form'

export const FormModal = ({
  isOpen,
  onClose,
  title,
  formConfig,
  onSubmit,
  children,
  acciones,
  size = "md",
  isLoading = false
}) => {
  const form = useForm({
    ...formConfig,
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  const handleClose = () => {
    form.reset()
    onClose()
  }

  if (!isOpen) return null

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-white rounded-xl w-full ${sizes[size]} max-h-[90vh] overflow-y-auto border border-gray-200 shadow-lg`}
      >
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
            {title}
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="space-y-4"
          >
            {children(form)}

            {acciones && (
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                {acciones(form, isLoading, handleClose)}
              </div>
            )}
          </form>


        </div>
      </motion.div>
    </div>
  )
}