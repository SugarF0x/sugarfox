export default (ctx) => {
  if (localStorage.getItem('dark') === null) {
    localStorage.setItem('dark', 'true')
  }
  ctx.$vuetify.theme.dark = (localStorage.getItem('dark') === 'true')
}