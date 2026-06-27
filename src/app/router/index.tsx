import { createBrowserRouter } from 'react-router-dom'

import HomePage from '@/pages/HomePage'
import NotFoundPage from '@/pages/NotFoundPage'
import { paths } from '@/routes/paths'

/**
 * Application router (React Router v7, data-router API).
 *
 * Routes are declared centrally here. As features land they register their own
 * route objects (ideally as lazy-loaded children) to keep this file thin.
 */
export const router = createBrowserRouter([
  {
    path: paths.home,
    element: <HomePage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
