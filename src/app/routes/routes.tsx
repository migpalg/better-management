import { createBrowserRouter, type RouteObject } from 'react-router'
import { HomeScreen } from '../../features/home/screens/home-screen/home-screen.tsx'

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: HomeScreen,
  },
]

export const router = createBrowserRouter(routes)
