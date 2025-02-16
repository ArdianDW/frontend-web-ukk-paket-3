"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { AppSidebarPegawai } from "@/components/app-sidebar-pegawai"; // Import sidebar pegawai
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

type BarangDipinjam = {
  nama_barang: string;
  jumlah: number;
};

type RiwayatAktivitas = {
  id: number;
  barang_dipinjam: BarangDipinjam[];
  tanggal_meminjam: string;
  tanggal_mengembalikan: string | null;
  keterangan: string;
};

export default function RiwayatPegawaiPage() {
  const [riwayatData, setRiwayatData] = useState<RiwayatAktivitas[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPegawaiIdAndData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const userData = localStorage.getItem("user");
        const userId = userData ? JSON.parse(userData).id : null;

        if (!userId) {
          console.error("User ID not found in localStorage");
          return;
        }

        // Fetch pegawai ID
        const pegawaiResponse = await fetch(`http://127.0.0.1:8000/api/pegawai/petugas/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!pegawaiResponse.ok) {
          console.error("Failed to fetch pegawai ID:", pegawaiResponse.statusText);
          return;
        }

        const pegawaiData = await pegawaiResponse.json();
        const pegawaiId = pegawaiData.id; // Asumsikan pegawai ID ada di pegawaiData.id

        const response = await fetch(`http://127.0.0.1:8000/api/riwayat-aktivitas/user/${pegawaiId}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch data:", response.statusText);
          return;
        }

        const data = await response.json();
        console.log("API Response:", data); // Log respons untuk debugging

        if (Array.isArray(data)) {
          const formattedData = data.map((item: any) => ({
            id: item.id,
            barang_dipinjam: item.barang_dipinjam.map((barang: any) => ({
              nama_barang: barang.nama_barang,
              jumlah: barang.jumlah,
            })),
            tanggal_meminjam: item.tanggal_meminjam,
            tanggal_mengembalikan: item.tanggal_mengembalikan,
            keterangan: item.keterangan,
          }));
          setRiwayatData(formattedData);
        } else {
          console.error("Data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPegawaiIdAndData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = riwayatData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(riwayatData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
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
                  <BreadcrumbPage>Riwayat Pegawai</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6">Riwayat Peminjaman Saya</h1>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-base">No</TableHead>
                  <TableHead className="text-base">Nama Barang</TableHead>
                  <TableHead className="text-base">Tanggal Meminjam</TableHead>
                  <TableHead className="text-base">Tanggal Mengembalikan</TableHead>
                  <TableHead className="text-base">Aktivitas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((riwayat, index) => (
                  <TableRow key={riwayat.id}>
                    <TableCell className="text-sm">{indexOfFirstItem + index + 1}</TableCell>
                    <TableCell className="text-sm">
                      {riwayat.barang_dipinjam.map((barang, idx) => (
                        <div key={idx}>
                          {barang.nama_barang} ({barang.jumlah})
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="text-sm">{riwayat.tanggal_meminjam}</TableCell>
                    <TableCell className="text-sm">{riwayat.tanggal_mengembalikan || "Belum Dikembalikan"}</TableCell>
                    <TableCell className="text-sm">{riwayat.keterangan}</TableCell>
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
                {[...Array(totalPages)].map((_, pageIndex) => (
                  <PaginationItem key={pageIndex}>
                    <PaginationLink
                      isActive={currentPage === pageIndex + 1}
                      onClick={() => handlePageChange(pageIndex + 1)}
                    >
                      {pageIndex + 1}
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
