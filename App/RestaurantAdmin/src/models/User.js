/** Class representing a User. */
export default class User {
  /**
   * Create a user.
   * @param {String} id - Place holder for a unique Firebase id.
  */
  id = ''
  email = ''
  nombre = ''
  apellido = ''
  cedula = ''
  /**
   * @param  {Object} args - User arguments supplied during
   * user creation
   */
  constructor (args) {
    Object.keys(args).forEach((v, i) => {
      this[v] = args[v]
    })

    return {
      ...this
    }
  }
}
