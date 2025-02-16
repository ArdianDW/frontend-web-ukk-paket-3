"use client"

import { AppSidebarPegawai } from "@/components/app-sidebar-pegawai";
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
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

export default function PengaturanPegawaiPage() {
  const navigate = useNavigate();
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [user, setUser] = useState({ nama: "", username: "", role: "" });
  const [newUsername, setNewUsername] = useState(user.username);
  const [newNama, setNewNama] = useState(user.nama);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://127.0.0.1:8000/api/me/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUser({
          nama: data.nama_petugas,
          username: data.username,
          role: data.level_name,
        });
        setNewUsername(data.username);
        setNewNama(data.nama_petugas);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/me/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newUsername, nama: newNama }),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      const data = await response.json();
      setUser({
        ...user,
        nama: data.nama_petugas,
        username: data.username,
      });
      setEditDialogOpen(false);
      toast({
        title: "Sukses",
        description: "Profil berhasil diperbarui.",
        action: <CheckCircle className="h-6 w-6 text-green-500" />,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/me/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
      });
      if (!response.ok) {
        throw new Error('Failed to change password');
      }
      setPasswordDialogOpen(false);
      toast({
        title: "Sukses",
        description: "Password berhasil diganti.",
        action: <CheckCircle className="h-6 w-6 text-green-500" />,
      });
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <AppSidebarPegawai />
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
                    <form className="space-y-4" onSubmit={handleEditProfile}>
                      <div className="flex items-center">
                        <label className="w-24 text-black mr-4">Username</label>
                        <Input
                          type="text"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          className="flex-1 mb-2"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="w-24 text-black mr-4">Nama</label>
                        <Input
                          type="text"
                          value={newNama}
                          onChange={(e) => setNewNama(e.target.value)}
                          className="flex-1 mb-2"
                        />
                      </div>
                      <Button type="submit">Simpan</Button>
                    </form>
                  </DialogDescription>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => setPasswordDialogOpen(true)}>
                    Ganti Kata Sandi
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Ganti Kata Sandi</DialogTitle>
                  <DialogDescription>
                    <form className="space-y-4" onSubmit={handleChangePassword}>
                      <div className="flex items-center">
                        <label className="w-24 text-black mr-4">Kata Sandi Lama</label>
                        <Input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="Kata Sandi Lama"
                          className="flex-1 mb-2"
                        />
                      </div>
                      <div className="flex items-center">
                        <label className="w-24 text-black mr-4">Kata Sandi Baru</label>
                        <Input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Kata Sandi Baru"
                          className="flex-1 mb-2"
                        />
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
