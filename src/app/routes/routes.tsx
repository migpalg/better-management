import { createBrowserRouter, type RouteObject } from 'react-router'
import { AppLayout } from '@/features/common/layout/app-layout/app-layout.tsx'
import { HomeScreen } from '@/features/home/screens/home-screen/home-screen.tsx'

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: HomeScreen,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
