import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {singletonTypeNames} from './singletons'

// Actions a singleton document is still allowed to have. Anything not listed
// here (duplicate, delete, unpublish) is stripped — there must only ever be
// one Hero, one Site Settings, etc.
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'Axsea',

  projectId: 'vrcjzuxv',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (input, context) =>
      singletonTypeNames.has(context.schemaType)
        ? input.filter(({action}) => action && singletonActions.has(action))
        : input,
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev.filter((templateItem) => !singletonTypeNames.has(templateItem.templateId))
      }
      return prev
    },
  },
})
