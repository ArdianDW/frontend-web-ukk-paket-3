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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filterKondisi, setFilterKondisi] = useState("all");

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
    console.log("Data yang dikirim:", data);
    const jenis = jenisOptions.find(j => j.nama_jenis === data.nama_jenis);
    console.log("Jenis yang ditemukan:", jenis);
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
    console.log("Data yang dikirim:", data);
    console.log("Jenis Options:", jenisOptions);
    console.log("Ruang Options:", ruangOptions);
    console.log("Nama ruang dari form:", data.nama_ruang);
    const jenis = jenisOptions.find(j => j.nama_jenis === data.nama_jenis);
    console.log("Jenis yang ditemukan:", jenis);
    const ruang = ruangOptions.find(r => r.nama_ruang === data.nama_ruang);
    console.log("Ruang yang ditemukan:", ruang);

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

    console.log("Data yang diterima di handleAdd:", newData);
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

  const { register, handleSubmit, reset, getValues, watch } = useForm<Barang>();

  useEffect(() => {
    if (selectedBarang) {
      reset(selectedBarang);
    }
  }, [selectedBarang, reset]);

  useEffect(() => {
    console.log("Current form values:", getValues());
  }, [watch("nama_ruang")]);

  // Filter data berdasarkan pencarian dan kondisi
  const filteredData = dataBarang.filter((barang) => {
    const matchesSearch = barang.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKondisi = filterKondisi === "all" || barang.kondisi === filterKondisi;
    return matchesSearch && matchesKondisi;
  });

  // Hitung data untuk paginasi
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset halaman ke 1 saat pencarian berubah
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
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
              <div className="flex gap-4">
                <Input
                  type="text"
                  placeholder="Cari Barang..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-1/1"
                />
                <Select onValueChange={setFilterKondisi}>
                  <SelectTrigger className="w-1/1">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="baik">Baik</SelectItem>
                    <SelectItem value="rusak">Rusak</SelectItem>
                    <SelectItem value="hilang">Hilang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/barang/tambah-barang")}
              >
                Tambah Barang
              </Button>
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
                {currentData.map((barang, index) => (
                  <TableRow key={barang.id}>
                    <TableCell className="text-sm">{index + 1 + indexOfFirstItem}</TableCell>
                    <TableCell className="text-sm">{barang.nama}</TableCell>
                    <TableCell className="text-sm">{barang.nama_jenis}</TableCell>
                    <TableCell className="text-sm">{barang.jumlah}</TableCell>
                    <TableCell className="text-sm">{barang.nama_ruang}</TableCell>
                    <TableCell className="text-sm">
                      <span
                        className={`px-2 py-1 rounded ${
                          barang.kondisi === "rusak" || barang.kondisi === "hilang" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                        }`}
                      >
                        {barang.kondisi}
                      </span>
                    </TableCell>
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
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                />
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={i + 1 === currentPage}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
                />
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
