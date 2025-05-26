import { createBrowserRouter } from 'react-router'

// import Root from './pages/Root'
import Auth from './pages/Auth'
import Cooperativa from './pages/Cooperativa'
import Comercio from './pages/Comercio'
import Coletor from './pages/Coletor'
import Root from './pages/Root'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      {
        path: 'login',
        Component: Auth,
      },
      {
        path: 'dashboard/coletor',
        Component: Coletor,
      },
      {
        path: 'dashboard/comercio',
        Component: Comercio,
      },
      {
        path: 'dashboard/cooperativa',
        Component: Cooperativa,
      },
    ],
  },
])
