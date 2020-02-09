import '@babel/polyfill'
import 'whatwg-fetch'
import {app} from './js/main'
import './styles/normalize.css'
import './styles/main.css'

const mainApp = new Vue(app);