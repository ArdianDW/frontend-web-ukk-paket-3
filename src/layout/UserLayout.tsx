import { ThemeProvider } from "@/components/theme-provider"
import { Outlet } from "react-router-dom"

function UserLayout() {
  return (
    <>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Outlet/>
        </ThemeProvider>
    </>
  )
}

export default UserLayout
