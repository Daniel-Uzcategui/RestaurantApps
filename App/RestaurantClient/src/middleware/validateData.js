export default (context) => {
  context.errorValidacion = false
  if (!context.courier ||
        !context.estado ||
        !context.ciudad ||
        !context.municipio ||
        !context.parroquia ||
        //! context.oficina ||
        !context.destinatario ||
        !context.contacto ||
        !context.cirif ||
        !context.telefono ||
        !context.direccion ||
        !context.inmueble ||
        !context.descripcionPaquete ||
        !context.referencia ||
        !context.numeroPiezas ||
        !context.peso ||
        !context.tipoEnvio ||
        !context.valor ||
        !context.tipoServicio
  ) {
    context.mensajeError = 'Favor Completar los datos'
    context.errorValidacion = true
  }

  // ------- Aquí van las otras validaciones
}
