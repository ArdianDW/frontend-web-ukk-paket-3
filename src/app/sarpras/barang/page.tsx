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
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function BarangPage() {
  const navigate = useNavigate();

  type Barang = {
    id: number;
    nama: string;
    nama_jenis: string;
    jumlah: number;
    nama_ruang: string;
    kondisi: string;
    keterangan: string;
    tanggal_register: string;
    kode_inventaris: string;
  };

  type Jenis = {
    id: number;
    nama_jenis: string;
  };

  type Ruang = {
    id: number;
    nama_ruang: string;
  };

  const [dataBarang, setDataBarang] = useState<Barang[]>([]);
  const [jenisOptions, setJenisOptions] = useState<Jenis[]>([]);
  const [ruangOptions, setRuangOptions] = useState<Ruang[]>([]);
  const [selectedBarang, setSelectedBarang] = useState<Barang | null>(null);

  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    fetchData();
    fetchJenis();
    fetchRuang();
  }, [accessToken]);

  const fetchData = () => {
    axios.get("http://127.0.0.1:8000/api/inventaris/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => setDataBarang(response.data))
    .catch(error => console.error("Error fetching data:", error));
  };

  const fetchJenis = () => {
    axios.get("http://127.0.0.1:8000/api/jenis/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => setJenisOptions(response.data))
    .catch(error => console.error("Error fetching jenis:", error));
  };

  const fetchRuang = () => {
    axios.get("http://127.0.0.1:8000/api/ruang/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => setRuangOptions(response.data))
    .catch(error => console.error("Error fetching ruang:", error));
  };

  const handleDelete = (id: number) => {
    axios.delete(`http://127.0.0.1:8000/api/inventaris/${id}/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(() => {
      console.log(`Barang dengan ID ${id} berhasil dihapus.`);
      setDataBarang(dataBarang.filter(barang => barang.id !== id));
    })
    .catch(error => console.error("Error deleting data:", error));
  };

  const handleEdit = (barang: Barang) => {
    setSelectedBarang(barang);
  };

  const handleUpdate = (data: Barang) => {
    const jenis = jenisOptions.find(j => j.nama_jenis === data.nama_jenis);
    const ruang = ruangOptions.find(r => r.nama_ruang === data.nama_ruang);

    const updatedData = {
      nama: data.nama,
      kode_inventaris: data.kode_inventaris,
      kondisi: data.kondisi,
      keterangan: data.keterangan,
      jumlah: data.jumlah,
      id_jenis: jenis ? jenis.id : null,
      id_ruang: ruang ? ruang.id : null,
      id_petugas: 1,
      tanggal_register: data.tanggal_register,
    };

    console.log("Request body for update:", updatedData);
    axios.put(`http://127.0.0.1:8000/api/inventaris/${data.id}/`, updatedData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(() => {
      console.log(`Barang dengan ID ${data.id} berhasil diperbarui.`);
      fetchData();
      setSelectedBarang(null);
    })
    .catch(error => console.error("Error updating data:", error));
  };

  const handleAdd = (data: Barang) => {
    const jenis = jenisOptions.find(j => j.nama_jenis === data.nama_jenis);
    const ruang = ruangOptions.find(r => r.nama_ruang === data.nama_ruang);

    const newData = {
      nama: data.nama,
      kode_inventaris: data.kode_inventaris,
      kondisi: data.kondisi,
      keterangan: data.keterangan,
      jumlah: data.jumlah,
      id_jenis: jenis ? jenis.id : null,
      id_ruang: ruang ? ruang.id : null,
      id_petugas: 1,
      tanggal_register: data.tanggal_register,
    };

    console.log("Request body for add:", newData);
    axios.post("http://127.0.0.1:8000/api/inventaris/", newData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(() => {
      console.log("Barang berhasil ditambahkan.");
      fetchData();
    })
    .catch(error => console.error("Error adding data:", error));
  };

  const { register, handleSubmit, reset } = useForm<Barang>();

  useEffect(() => {
    if (selectedBarang) {
      reset(selectedBarang);
    }
  }, [selectedBarang, reset]);

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
                  <BreadcrumbPage>Barang</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Daftar Barang Sarpras</h1>
              {/* <Button variant="default" size="sm" onClick={() => navigate("/barang/tambah-barang")}>
                Tambah Barang
              </Button> */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm">
                    Tambah Barang
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Barang</DialogTitle>
                    <DialogDescription>
                      Masukkan detail barang baru di bawah ini.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(handleAdd)}>
                    <div className="space-y-4">
                      <Input {...register("nama")} placeholder="Nama Barang" />
                      <Select {...register("nama_jenis")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Jenis" />
                        </SelectTrigger>
                        <SelectContent>
                          {jenisOptions.map((jenis) => (
                            <SelectItem key={jenis.id} value={jenis.nama_jenis}>
                              {jenis.nama_jenis}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input type="number" {...register("jumlah")} placeholder="Jumlah" />
                      <Select {...register("nama_ruang")}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Ruang" />
                        </SelectTrigger>
                        <SelectContent>
                          {ruangOptions.map((ruang) => (
                            <SelectItem key={ruang.id} value={ruang.nama_ruang}>
                              {ruang.nama_ruang}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input {...register("kondisi")} placeholder="Kondisi" />
                      <Input {...register("keterangan")} placeholder="Keterangan" />
                      <Input type="date" {...register("tanggal_register")} placeholder="Tanggal Register" />
                      <Input {...register("kode_inventaris")} placeholder="Kode Inventaris" />
                    </div>
                    <DialogFooter className="mt-2">
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
                  <TableHead className="text-base">Nama Barang</TableHead>
                  <TableHead className="text-base">Jenis Barang</TableHead>
                  <TableHead className="text-base">Jumlah</TableHead>
                  <TableHead className="text-base">Ruang</TableHead>
                  <TableHead className="text-base">Kondisi</TableHead>
                  <TableHead className="text-base">Keterangan</TableHead>
                  <TableHead className="text-base">Tanggal Register</TableHead>
                  <TableHead className="text-base">Kode Inventaris</TableHead>
                  <TableHead className="text-base">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataBarang.map((barang, index) => (
                  <TableRow key={barang.id}>
                    <TableCell className="text-sm">{index + 1}</TableCell>
                    <TableCell className="text-sm">{barang.nama}</TableCell>
                    <TableCell className="text-sm">{barang.nama_jenis}</TableCell>
                    <TableCell className="text-sm">{barang.jumlah}</TableCell>
                    <TableCell className="text-sm">{barang.nama_ruang}</TableCell>
                    <TableCell className="text-sm">{barang.kondisi}</TableCell>
                    <TableCell className="text-sm">{barang.keterangan}</TableCell>
                    <TableCell className="text-sm">{barang.tanggal_register}</TableCell>
                    <TableCell className="text-sm">{barang.kode_inventaris}</TableCell>
                    <TableCell className="text-sm">
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(barang)}>
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Barang</DialogTitle>
                              <DialogDescription>
                                Ubah detail barang di bawah ini.
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(handleUpdate)}>
                              <div className="space-y-4">
                                <Input {...register("nama")} placeholder="Nama Barang" />
                                <Select {...register("nama_jenis")} defaultValue={selectedBarang?.nama_jenis}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih Jenis" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {jenisOptions.map((jenis) => (
                                      <SelectItem key={jenis.id} value={jenis.nama_jenis}>
                                        {jenis.nama_jenis}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Input type="number" {...register("jumlah")} placeholder="Jumlah" />
                                <Select {...register("nama_ruang")} defaultValue={selectedBarang?.nama_ruang}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih Ruang" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {ruangOptions.map((ruang) => (
                                      <SelectItem key={ruang.id} value={ruang.nama_ruang}>
                                        {ruang.nama_ruang}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Input {...register("kondisi")} placeholder="Kondisi" />
                                <Input {...register("keterangan")} placeholder="Keterangan" />
                                <Input type="date" {...register("tanggal_register")} placeholder="Tanggal Register" />
                                <Input {...register("kode_inventaris")} placeholder="Kode Inventaris" />
                              </div>
                              <DialogFooter className="mt-2">
                                <DialogClose asChild>
                                  <Button type="button" variant="outline">Batal</Button>
                                </DialogClose>
                                <Button type="submit">Simpan</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              Hapus
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus barang <strong>{barang.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(barang.id)}>
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
