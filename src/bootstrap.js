import './hacks'
import 'bootstrap/dist/css/bootstrap-reboot.css'
import '@reach/dialog/styles.css'
import '@reach/menu-button/styles.css'
import '@reach/tabs/styles.css'
import '@reach/tooltip/styles.css'
import './styles/global.css'

import {bootstrapAppData} from './utils/bootstrap'
import {prefetchQuery} from 'react-query'

prefetchQuery('bootstrapAppData', bootstrapAppData, {force: true})
