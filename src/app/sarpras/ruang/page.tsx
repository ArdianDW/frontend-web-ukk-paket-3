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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Ruang = {
  id: number;
  kode_ruang: string;
  nama_ruang: string;
  keterangan: string;
};

export default function RuangPage() {
  const navigate = useNavigate();
  const [dataRuang, setDataRuang] = useState<Ruang[]>([]);
  const [selectedRuang, setSelectedRuang] = useState<Ruang | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruangToDelete, setRuangToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  const fetchData = () => {
    axios.get("http://127.0.0.1:8000/api/ruang/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => setDataRuang(response.data))
    .catch(error => console.error("Error fetching data:", error));
  };

  const { register, handleSubmit, reset, setValue } = useForm<Ruang>();

  const handleAdd = (data: Ruang) => {
    axios.post("http://127.0.0.1:8000/api/ruang/", data, {
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

  const handleEdit = (ruang: Ruang) => {
    setSelectedRuang(ruang);
    setValue("kode_ruang", ruang.kode_ruang);
    setValue("nama_ruang", ruang.nama_ruang);
    setValue("keterangan", ruang.keterangan);
  };

  const handleUpdate = (data: Ruang) => {
    if (!selectedRuang) return;

    axios.put(`http://127.0.0.1:8000/api/ruang/${selectedRuang.id}/`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(() => {
      fetchData(); // Refresh data setelah update
      reset(); // Reset form setelah submit
      setSelectedRuang(null); // Tutup dialog
    })
    .catch(error => console.error("Error updating data:", error));
  };

  const handleDelete = (id: number) => {
    axios.delete(`http://127.0.0.1:8000/api/ruang/${id}/`, {
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
    setRuangToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Filter data berdasarkan pencarian
  const filteredData = dataRuang.filter((ruang) =>
    ruang.nama_ruang.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <BreadcrumbPage>Ruang Sarpras</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Daftar Ruang Sarpras</h1>
              <Input
                type="text"
                placeholder="Cari Ruang..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-1/3"
              />
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm">
                    Tambah Ruang
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Tambah Ruang</DialogTitle>
                    <DialogDescription>
                      Masukkan detail ruang baru di bawah ini.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(handleAdd)}>
                    <div className="space-y-4">
                      <Input {...register("kode_ruang")} placeholder="Kode Ruang" />
                      <Input {...register("nama_ruang")} placeholder="Nama Ruang" />
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
                  <TableHead className="text-base">Kode Ruang</TableHead>
                  <TableHead className="text-base">Nama Ruang</TableHead>
                  <TableHead className="text-base">Keterangan</TableHead>
                  <TableHead className="text-base">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((ruang, index) => (
                  <TableRow key={ruang.id}>
                    <TableCell className="text-sm">{index + 1 + indexOfFirstItem}</TableCell>
                    <TableCell className="text-sm">{ruang.kode_ruang}</TableCell>
                    <TableCell className="text-sm">{ruang.nama_ruang}</TableCell>
                    <TableCell className="text-sm">{ruang.keterangan}</TableCell>
                    <TableCell className="text-sm">
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleEdit(ruang)}>
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Ruang</DialogTitle>
                              <DialogDescription>
                                Ubah detail ruang di bawah ini.
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(handleUpdate)}>
                              <div className="space-y-4">
                                <Input {...register("kode_ruang")} placeholder="Kode Ruang" />
                                <Input {...register("nama_ruang")} placeholder="Nama Ruang" />
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
                        <Button variant="destructive" size="sm" onClick={() => confirmDelete(ruang.id)}>
                          Hapus
                        </Button>
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

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus ruang ini?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Batal</Button>
            </DialogClose>
            <Button type="button" variant="destructive" onClick={() => ruangToDelete && handleDelete(ruangToDelete)}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
