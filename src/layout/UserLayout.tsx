import { ThemeProvider } from "@/components/theme-provider"
import { Outlet } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"

function UserLayout() {
  return (
    <>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Toaster />
            <Outlet/>
        </ThemeProvider>
    </>
  )
}

export default UserLayout
