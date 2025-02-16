import * as React from "react";
import { User, ChevronRight, CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
} from "@/components/ui/sidebar";
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
} from "@/components/ui/alert-dialog";

const dataPegawai = {
  navMain: [
    {
      title: "Beranda",
      url: "/pegawai",
      items: [
        {
          title: "Peminjaman anda",
          url: "/pegawai",
        },
        {
          title: "Daftar Barang Tersedia",
          url: "/pegawai/barang",
        },
        {
            title: "Riwayat peminjaman anda",
            url: "/pegawai/riwayat",
        },
      ],
    },
    {
      title: "Pengaturan",
      url: "/pengaturan",
      items: [
        {
          title: "Pengaturan Pengguna",
          url: "/pegawai/pengaturan",
        },
      ],
    },
  ],
};

export function AppSidebarPegawai({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        {dataPegawai.navMain.map((item) => (
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
        ))}
      </SidebarContent>
    </Sidebar>
  );
} 