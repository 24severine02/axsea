import type {StructureBuilder} from 'sanity/structure'
import {SINGLETON_TYPES} from './singletons'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Pages')
        .child(
          S.list()
            .title('Site Pages')
            .items(
              SINGLETON_TYPES.map(({id, title}) =>
                S.listItem()
                  .title(title)
                  .id(id)
                  // A singleton is just a document whose _id we hardcode to the
                  // type name, so there's only ever one and we always know its id.
                  .child(S.document().schemaType(id).documentId(id)),
              ),
            ),
        ),

      S.divider(),

      S.listItem().title('Catch Log').child(S.documentTypeList('catchLogEntry').title('Catch Log')),
      S.listItem().title('Gear').child(S.documentTypeList('gearItem').title('Gear')),
      S.listItem().title('Sessions').child(S.documentTypeList('course').title('Sessions')),
      S.listItem().title('Fishing Spots').child(S.documentTypeList('fishingSpot').title('Fishing Spots')),
      S.listItem().title('Sponsors').child(S.documentTypeList('sponsor').title('Sponsors')),

      S.divider(),

      S.listItem().title('Shop Products').child(S.documentTypeList('product').title('Shop Products')),
      S.listItem().title('Orders').child(S.documentTypeList('order').title('Orders')),
    ])
