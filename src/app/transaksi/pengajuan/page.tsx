import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationNext,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

const PengajuanPage = () => {
  const [availableItems, setAvailableItems] = useState<any[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [jumlahPinjam, setJumlahPinjam] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPengajuan, setFilterPengajuan] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://127.0.0.1:8000/api/aktivitas/pending/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const formattedData = data.map((item: any) => ({
        id: item.id,
        nama_peminjam: item.nama_peminjam,
        barang_dipinjam: item.barang_dipinjam.map((barang: any) => ({
          nama_barang: barang.nama_barang,
          jumlah: barang.jumlah,
        })),
        tanggal_peminjaman: item.tanggal_peminjaman,
        pengajuan: item.status_peminjaman === "Dipinjam" ? "Meminjam" : "Mengembalikan",
      }));
      setAvailableItems(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproval = async (status: string) => {
    if (selectedItemId !== null) {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://127.0.0.1:8000/api/peminjaman/approve/${selectedItemId}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ status_approval: status }),
        });

        if (response.ok) {
          console.log(`Pengajuan untuk barang dengan ID: ${selectedItemId} berhasil ${status}.`);
          fetchData();
        } else {
          console.error(`Gagal ${status} pengajuan.`);
        }
      } catch (error) {
        console.error(`Error saat ${status} pengajuan:`, error);
      }
    }
  };

  // Filter data berdasarkan pencarian dan jenis pengajuan
  const filteredData = availableItems.filter((item) => {
    const matchesSearch = item.nama_peminjam.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPengajuan = filterPengajuan === "all" || item.pengajuan === filterPengajuan;
    return matchesSearch && matchesPengajuan;
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
                  <BreadcrumbPage>Pengajuan</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6">Pengajuan Peminjaman & Pengembalian</h1>
            <div className="flex justify-between items-center mb-6">
              <Input
                type="text"
                placeholder="Cari Peminjam..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-1/2"
              />
              <Select onValueChange={setFilterPengajuan}>
                <SelectTrigger className="w-1/4">
                  <SelectValue placeholder="Filter Pengajuan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="Meminjam">Meminjam</SelectItem>
                  <SelectItem value="Mengembalikan">Mengembalikan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Peminjam</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Jumlah Total</TableHead>
                  <TableHead>Tanggal Peminjaman</TableHead>
                  <TableHead>Pengajuan</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1 + indexOfFirstItem}</TableCell>
                    <TableCell>{item.nama_peminjam}</TableCell>
                    <TableCell>
                      {item.barang_dipinjam.map((barang: any, idx: number) => (
                        <div key={idx}>
                          -{barang.nama_barang}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>{item.barang_dipinjam.reduce((total, barang) => total + barang.jumlah, 0)}</TableCell>
                    <TableCell>{item.tanggal_peminjaman}</TableCell>
                    <TableCell>{item.pengajuan}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedItemId(item.id);
                              setJumlahPinjam(1); // Reset jumlah pinjam setiap kali dialog dibuka
                            }}
                          >
                            Tolak
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Penolakan</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menolak pengajuan peminjaman untuk barang ini?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleApproval("ditolak")}>
                              Tolak
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="default"
                            size="sm"
                            className="ml-2"
                            onClick={() => {
                              setSelectedItemId(item.id);
                              setJumlahPinjam(1); // Reset jumlah pinjam setiap kali dialog dibuka
                            }}
                          >
                            Terima
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Pengajuan</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin menerima pengajuan peminjaman untuk barang ini?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleApproval("diterima")}>
                              Terima
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
};

export default PengajuanPage;
