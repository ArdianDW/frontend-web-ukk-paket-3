"use client"

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";

export default function PengaturanPage() {
  const navigate = useNavigate();
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);

  const user = {
    nama: "teststst",
    username: "ardiantest",
    role: "Admin",
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Pengaturan</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <div className="flex items-center mb-6">
              <div className="flex aspect-square size-16 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                <User className="size-8" />
              </div>
              <div className="ml-4">
                <h2 className="text-2xl font-bold">{user.nama}</h2>
                <p className="text-sm text-gray-500">{user.username}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm" onClick={() => setEditDialogOpen(true)}>
                    Edit Profil
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Edit Profil</DialogTitle>
                  <DialogDescription>
                    <form className="space-y-4">
                      <div className="flex items-center">
                        <label className="w-24 text-black mr-4">Username</label>
                        <Input type="text" defaultValue={user.username} className="flex-1 mb-2" />
                      </div>
                      <div className="flex items-center">
                        <label className="w-24 text-black mr-4">Nama</label>
                        <Input type="text" defaultValue={user.nama} className="flex-1 mb-2" />
                      </div>
                      <Button type="submit">Simpan</Button>
                    </form>
                  </DialogDescription>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setPasswordDialogOpen(true)}>
                    Ganti Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Ganti Password</DialogTitle>
                  <DialogDescription>
                    <form className="space-y-4">
                      <div className="flex items-center">
                        <label className="w-24 text-black mr-4">Password Lama</label>
                        <Input type="password" placeholder="Password Lama" className="flex-1 mb-2" />
                      </div>
                      <div className="flex items-center">
                        <label className="w-24 text-black mr-4">Password Baru</label>
                        <Input type="password" placeholder="Password Baru" className="flex-1 mb-2" />
                      </div>
                      <div className="flex items-center">
                        <label className="w-24 text-black mr-4">Konfirmasi Password</label>
                        <Input type="password" placeholder="Konfirmasi Password" className="flex-1 mb-2" />
                      </div>
                      <Button type="submit">Simpan</Button>
                    </form>
                  </DialogDescription>
                </DialogContent>
              </Dialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Logout
                  </Button>
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
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
