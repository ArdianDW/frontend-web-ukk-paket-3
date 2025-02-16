import * as React from "react"
import { User, ChevronRight, CheckCircle } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"

const data = {
  navMain: [
    {
      title: "Beranda",
      url: "/dashboard",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        }
      ],
    },
    {
      title: "Peminjaman & Pengembalian",
      url: "#",
      items: [
        {
          title: "Peminjaman",
          url: "/peminjaman",
        },
        {
          title: "Pengembalian",
          url: "/pengembalian",
        },
        {
          title: "Pengajuan",
          url: "/pengajuan",
        },
        {
          title: "Riwayat",
          url: "/riwayat",
        },
      ],
    },
    {
      title: "Data Sarpras",
      url: "#",
      items: [
        {
          title: "Data Barang",
          url: "/barang",
        },
        {
          title: "Jenis Barang",
          url: "/jenis",
        },
        {
          title: "Data Ruang",
          url: "/ruang",
        },
      ],
    },
    {
      title: "Laporan",
      url: "#",
      items: [
        {
          title: "Laporan Barang",
          url: "/laporan-barang",
        },
        {
          title: "Peminjaman & Pengembalian",
          url: "#",
        },
      ],
    },
    {
      title: "Pengguna",
      url: "#",
      items: [
        {
          title: "Pengaturan Pengguna",
          url: "/pengaturan",
        },
        {
          title: "Daftar Pengguna",
          url: "/daftar-pengguna",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const namaPetugas = userData.nama_petugas;
  const level = userData.level;

  const handleNavigation = (url: string) => {
    navigate(url);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    toast({
      title: "Logout Berhasil",
      description: "Anda telah berhasil logout.",
      action: <CheckCircle className="h-6 w-6 text-green-500" />,
    });
    navigate('/login');
  };

  // Filter menu based on user role
  const filteredNavMain = data.navMain.map((item) => {
    if (level === 'Admin' && item.title === 'Data Sarpras') {
      return null; 
    }
    if (level === 'Operator' && item.title === 'Pengguna') {
      return {
        ...item,
        items: item.items.filter(subItem => subItem.title !== 'Daftar Pengguna')
      };
    }
    return item;
  }).filter(Boolean); 
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground cursor-pointer">
                    <User className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none ml-2">
                    <span className="font-semibold">{namaPetugas}</span>
                    <span className="">{level}</span>
                  </div>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="ml-4 py-1 px-3 text-white bg-red-500 hover:bg-red-600 rounded"
                    >
                      Logout
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Konfirmasi Logout</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin logout?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {/* We create a collapsible SidebarGroup for each parent. */}
        {filteredNavMain.map((item) => (
          item && (
            <Collapsible
              key={item.title}
              title={item.title}
              defaultOpen={true}
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <CollapsibleTrigger>
                    {item.title}{" "}
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.items.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton
                            asChild
                            isActive={location.pathname === subItem.url}
                            onClick={() => handleNavigation(subItem.url)}
                          >
                            <div className="cursor-pointer">{subItem.title}</div>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          )
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
