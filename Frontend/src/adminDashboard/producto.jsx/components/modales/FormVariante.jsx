/* eslint-disable no-unused-vars */
import { FormInput } from "../../../../global/components/formulario/FormInput"
import { FormModal } from "../../../../global/components/formulario/FormModal"

export const FormVariante = ({ modal, guardarVariante, formConfigVariante, isLoading }) => {
  return (
    < FormModal
      title={modal?.data?.id ? "Editar Variante" : "Agregar Variante"}
      isOpen={modal.isOpen}
      onClose={modal.cerrar}
      onSubmit={guardarVariante}
      isLoading={isLoading}
      size="lg"
      formConfig={{
        defaultValues: formConfigVariante
      }}
      acciones={(form, isLoading, onClose) => [
        <button
          key="cancelar"
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
        >
          Cancelar
        </button>,
        <button
          key="guardar"
          type="submit"
          disabled={!form.state.canSubmit || isLoading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {isLoading ? 'Guardando...' : (modal?.data ? 'Guardar Cambios' : 'Crear Variante')}
        </button>
      ]}
    >
      {(form) => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <form.Field
            name="talla"
            validators={{
              onChange: ({ value }) => {
                if (!value || value.length < 1) return 'La talla debe tener al menos 1 digito'
                if (value.length > 5) return 'La talla no puede tener más de 5 digitos'
              },
              onBlur: ({ value }) => {
                if (!value) return 'Este campo es obligatorio'
              }
            }}
            children={(field) => (
              <FormInput
                field={field}
                label="Talla"
                type="float"
                placeholder="Ej: 42"
              />
            )}
          />
          <form.Field
            name="color"
            validators={{
              onChange: ({ value }) => {
                if (value.length > 225) return 'El color no puede tener más de 225 caracteres'
              }
            }}
            children={(field) => (
              <FormInput
                field={field}
                label="Color"
                placeholder="Ej: Rojo"
              />
            )}
          />
          <form.Field
            name="codigo"
            validators={{
              onChange: ({ value }) => {
                if (value.length > 225) return 'El código no puede tener más de 225 caracteres'
              },
              onBlur: ({ value }) => {
                if (!value) return 'Este campo es obligatorio'
              }
            }}
            children={(field) => (
              <FormInput
                field={field}
                label="Código SKU"
                placeholder="Ej: ZAP-ROJO-42"
              />
            )}
          />
          <form.Field
            name="precioCompra"
            validators={{
              onChange: ({ value }) => {
                if (value < 0) return 'El Valor no puede ser negativo'
              },
              onBlur: ({ value }) => {
                if (!value) return 'Este campo es obligatorio'
              }
            }}
            children={(field) => (
              <FormInput
                field={field}
                type="float"
                label="Precio de Compra"
                placeholder="Ej: 100.00"
              />
            )}
          />
          <form.Field
            name="precioVenta"
            validators={{
              onChange: ({ value }) => {
                if (value < 0) return 'El Valor no puede ser negativo'
              },
              onBlur: ({ value }) => {
                if (!value) return 'Este campo es obligatorio'
              }
            }}
            children={(field) => (
              <FormInput
                field={field}
                type="float"
                label="Precio de Venta"
                placeholder="Ej: 150.00"
              />
            )}
          />
          <form.Field
            name="stockActual"
            validators={{
              onChange: ({ value }) => {
                if (value < 0) return 'El stock actual no puede ser negativo'
              }
            }}
            children={(field) => (
              <FormInput
                field={field}
                type="number"
                label="stock Actual"
                placeholder="Ej: 10"
              />
            )}
          />
          <form.Field
            name="stockMinimo"
            validators={{
              onChange: ({ value }) => {
                if (value < 0) return 'El stock mínimo no puede ser negativo'
              }
            }}
            children={(field) => (
              <FormInput
                field={field}
                type="number"
                label="stock Minimo"
                placeholder="Ej: 5"
              />
            )}
          />
        </div>
      )}
    </FormModal >
  )
}
