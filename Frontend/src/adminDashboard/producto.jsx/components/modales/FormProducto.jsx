/* eslint-disable no-unused-vars */
import { FormModal } from '../../../../global/components/formulario/FormModal'
import { FormInput } from '../../../../global/components/formulario/FormInput'
import { Tag } from 'lucide-react'
import { FormSeleccionado } from '../../../../global/components/formulario/FormSeleccionado'
import { FormTextarea } from '../../../../global/components/formulario/FormTextarea'

export const FormProducto = ({ modal, guardarProducto, formConfigProducto, categorias, isLoading }) => {
  return (
    <FormModal
      title={modal?.data ? "Editar Producto" : "Agregar Producto"}
      isOpen={modal.isOpen}
      onClose={modal.cerrar}
      onSubmit={guardarProducto}
      isLoading={isLoading}
      size='lg'
      formConfig={{
        defaultValues: formConfigProducto
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
          {isLoading ? 'Guardando...' : (modal?.data ? 'Guardar Cambios' : 'Crear Producto')}
        </button>
      ]}
    >
      {(form) => (
        <>
          <form.Field
            name="nombre"
            validators={{
              onChange: ({ value }) => {
                if (!value || value.length < 2) return 'El nombre debe tener al menos 2 caracteres'
                if (value.length > 50) return 'El nombre no puede tener más de 50 caracteres'
              },
              onBlur: ({ value }) => {
                if (!value) return 'Este campo es obligatorio'
              }

            }}
            children={(field) => (
              <FormInput
                field={field}
                label="Nombre del Producto"
                placeholder="Ej: Zapatillas Deportivas"
                icon={Tag}
              />
            )}
          />
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <form.Field
              name="marca"
              validators={{
                onChange: ({ value }) => {
                  if (!value || value.length < 2) return 'La marca debe tener al menos 2 caracteres'
                  if (value.length > 50) return 'La marca no puede tener más de 50 caracteres'
                },
                onBlur: ({ value }) => {
                  if (!value) return 'Este campo es obligatorio'
                }
              }}
              children={(field) => (
                <FormInput
                  field={field}
                  label="Marca"
                  placeholder="Ej: Nike"
                  icon={Tag}
                />
              )}
            />
            <form.Field
              name="modelo"
              validators={{
                onChange: ({ value }) => {
                  if (!value || value.length < 1) return 'El modelo es obligatorio'
                  if (value.length > 50) return 'El modelo no puede tener más de 50 caracteres'
                },
                onBlur: ({ value }) => {
                  if (!value) return 'Este campo es obligatorio'
                }
              }}
              children={(field) => (
                <FormInput
                  field={field}
                  label="Modelo"
                  placeholder="Ej: Air Max"
                  icon={Tag}
                />
              )}
            />
          </div>
          <form.Field
            name="categoria"
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'El género es requerido'
              }
            }}
            children={(field) => (
              <FormSeleccionado
                field={field}
                label="Categoría"
                options={categorias}
              />
            )}
          />
          <form.Field
            name="descripcion"
            validators={{
              onChange: ({ value }) => {
                if (value && value.length > 255) return 'La descripción no puede tener más de 255 caracteres'
              }
            }}
            children={(field) => (
              <FormTextarea
                field={field}
                label="Descripción"
                placeholder="Describe el producto (opcional)"
                rows={3}
              />
            )}
          />
        </>
      )}
    </FormModal>
  )
}
