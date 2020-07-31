/**
 * Plugin settings and retrieving selected theme from Local Storage
 *
 * @category client
 * @subcategory plugins
 * @namespace theme-store
 *
 * @todo Fix an issue related to SSR loading default theme first and then applying selected one
 */

export default (ctx) => {
  if (localStorage.getItem('dark') === null) {
    localStorage.setItem('dark', 'true')
  }
  ctx.$vuetify.theme.dark = (localStorage.getItem('dark') === 'true')
}