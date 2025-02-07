"use client"

import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
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
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

type Jenis = {
  id: number;
  kode_jenis: string;
  nama_jenis: string;
  keterangan: string;
};

export default function JenisPage() {
  const navigate = useNavigate();
  const [dataJenis, setDataJenis] = useState<Jenis[]>([]);
  const [selectedJenis, setSelectedJenis] = useState<Jenis | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jenisToDelete, setJenisToDelete] = useState<number | null>(null);

  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  const fetchData = () => {
    axios.get("http://127.0.0.1:8000/api/jenis/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => setDataJenis(response.data))
    .catch(error => console.error("Error fetching data:", error));
  };

  const { register, handleSubmit, reset, setValue } = useForm<Jenis>();

  const handleAdd = (data: Jenis) => {
    axios.post("http://127.0.0.1:8000/api/jenis/", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(() => {
      fetchData(); // Refresh data setelah penambahan
      reset(); // Reset form setelah submit
    })
    .catch(error => console.error("Error adding data:", error));
  };

  const handleEdit = (jenis: Jenis) => {
    setSelectedJenis(jenis);
    setValue("kode_jenis", jenis.kode_jenis);
    setValue("nama_jenis", jenis.nama_jenis);
    setValue("keterangan", jenis.keterangan);
  };

  const handleUpdate = (data: Jenis) => {
    if (!selectedJenis) return;

    axios.put(`http://127.0.0.1:8000/api/jenis/${selectedJenis.id}/`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(() => {
      fetchData(); 
      reset(); 
      setSelectedJenis(null); 
    })
    .catch(error => console.error("Error updating data:", error));
  };

  const handleDelete = (id: number) => {
    axios.delete(`http://127.0.0.1:8000/api/jenis/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(() => {
      fetchData(); // Refresh data setelah penghapusan
      setDeleteDialogOpen(false); // Tutup dialog konfirmasi
    })
    .catch(error => console.error("Error deleting data:", error));
  };

  const confirmDelete = (id: number) => {
    setJenisToDelete(id);
    setDeleteDialogOpen(true);
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
                  <BreadcrumbPage>Jenis Sarpras</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Daftar Jenis Sarpras</h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm">
                    Tambah Jenis
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Jenis</DialogTitle>
                    <DialogDescription>
                      Masukkan detail jenis baru di bawah ini.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(handleAdd)}>
                    <div className="space-y-4">
                      <Input {...register("kode_jenis")} placeholder="Kode Jenis" />
                      <Input {...register("nama_jenis")} placeholder="Nama Jenis" />
                      <Input {...register("keterangan")} placeholder="Keterangan" />
                    </div>
                    <DialogFooter className="mt-4">
                      <DialogClose asChild>
                        <Button type="button" variant="outline">Batal</Button>
                      </DialogClose>
                      <Button type="submit">Simpan</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-base">No</TableHead>
                  <TableHead className="text-base">Kode Jenis</TableHead>
                  <TableHead className="text-base">Nama Jenis</TableHead>
                  <TableHead className="text-base">Keterangan</TableHead>
                  <TableHead className="text-base">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataJenis.map((jenis, index) => (
                  <TableRow key={jenis.id}>
                    <TableCell className="text-sm">{index + 1}</TableCell>
                    <TableCell className="text-sm">{jenis.kode_jenis}</TableCell>
                    <TableCell className="text-sm">{jenis.nama_jenis}</TableCell>
                    <TableCell className="text-sm">{jenis.keterangan}</TableCell>
                    <TableCell className="text-sm">
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(jenis)}>
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Jenis</DialogTitle>
                              <DialogDescription>
                                Ubah detail jenis di bawah ini.
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(handleUpdate)}>
                              <div className="space-y-4">
                                <Input {...register("kode_jenis")} placeholder="Kode Jenis" />
                                <Input {...register("nama_jenis")} placeholder="Nama Jenis" />
                                <Input {...register("keterangan")} placeholder="Keterangan" />
                              </div>
                              <DialogFooter className="mt-4">
                                <DialogClose asChild>
                                  <Button type="button" variant="outline">Batal</Button>
                                </DialogClose>
                                <Button type="submit">Simpan</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="sm" onClick={() => confirmDelete(jenis.id)}>
                          Hapus
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarInset>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus jenis ini?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Batal</Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={() => jenisToDelete && handleDelete(jenisToDelete)}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
