
export const Etiqueta = ({ icon: Icon, texto, size }) => {

  return (
    <span className='flex items-center gap-1'>
      {Icon && <Icon size={size || 14} />}
      {texto}
    </span>
  )
}
