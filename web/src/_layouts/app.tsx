import { useQuery } from '@tanstack/react-query'
import { Outlet } from 'react-router-dom'

import { getProfile } from '@/api/get-profile'
import { AppSidebar } from '@/components/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'

export function AppLayout() {
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => getProfile(),
    staleTime: Infinity,
  })

  return (
    <>
      <SidebarProvider className="flex flex-col justify-between min-h-screen max-h-screen">
        <AppSidebar />
        <header className="flex flex-row justify-between bg-primary-foreground items-center">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
            {isLoadingUser ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              user?.user.name
            )}
            {isLoadingUser ? (
              <Skeleton className="h-6 w-10 border-r-4" />
            ) : (
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>user</AvatarFallback>
              </Avatar>
            )}
          </div>
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
