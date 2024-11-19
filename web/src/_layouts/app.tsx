import { Outlet } from 'react-router-dom'

import { AppSidebar } from '@/components/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export function AppLayout() {
  return (
    <>
      <SidebarProvider className="flex flex-col justify-between min-h-screen max-h-screen">
        <AppSidebar />
        <header className="flex flex-row justify-between bg-primary-foreground items-center">
          <SidebarTrigger />
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>user</AvatarFallback>
          </Avatar>
        </header>
        <main className="flex flex-1">
          <Outlet />
        </main>

        <footer className="bg-primary-foreground">
          <span className="text-xs text-gray-400 py-4 text-center block">
            lfqcamargo@gmail.com
          </span>
        </footer>
      </SidebarProvider>
    </>
  )
}
