const functions = require('firebase-functions')
const admin = require('firebase-admin')
const db = admin.firestore()
const FieldValue = admin.firestore.FieldValue
/**
* Creates trigger for referenced documents to be synced
* @method refFunc
* @param {Object} options -Route of the referenced Doc ex: 'collectionName' or subcollection 'collectionName/subcollectionName'.
* @param {String} options.docRoute -Route of the referenced Doc ex: 'collectionName' or subcollection 'collectionName/subcollectionName'. ex: test
* @param {Array} options.route -Array of strings indicating the collectionGroup names, of which to search the referenced doc ID ex: testreferencia.
* @param {String} options.mapFather -Object key name of the child where the Referenced docs are saved ex: usarios.
* @param {String} options.refName -Child parameter where the id is referenced ex: id.
*/

const refFather = (options) => {
  const { docRoute, route, mapFather, refName } = options
  return functions.firestore
    .document(`${docRoute}/{refId}`)
    .onWrite(async (change, context) => {
      // const route = 'testreferencia'
      // const mapFather = 'usarios'
      const idReferencias = context.params.refId
      // const refName = 'id'
      const mapChild = mapFather + '.' + idReferencias
      const where = `${mapFather}.${idReferencias}.${refName}`
      const document = change.after.exists ? change.after.data() : null
      if (document === null) {
        let docMaps = {}
        for (const rutas of route) {
          docMaps[rutas] = await db.collectionGroup(rutas).where(where, '==', idReferencias).get()
          docMaps[rutas].forEach((doc) => {
          // Perform operations before updating
            doc.ref.update({
              [mapChild]: FieldValue.delete()
            })
          })
        }
      } else {
      // perform desired operations ...
        let docMaps = {}
        for (const rutas of route) {
          docMaps[rutas] = await db.collectionGroup(rutas).where(where, '==', idReferencias).get()
          docMaps[rutas].forEach((doc) => {
          // Perform operations before updating
            doc.ref.update({
              [mapChild]: {
                docRef: change.before.ref,
                ...document
              }
            })
          })
        }
      }
    })
}

const options = {
  docRoute: 'test',
  route: ['testreferencia'],
  mapFather: 'usarios',
  refName: 'id'
}

module.exports = {
  modifyFather: refFather(options)
}
