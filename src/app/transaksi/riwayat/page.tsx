"use client";

import { useEffect, useState } from "react";
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
import axios from "axios";
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
};

type RiwayatAktivitas = {
  id: number;
  nama_peminjam: string;
  barang_dipinjam: BarangDipinjam[];
  tanggal_meminjam: string;
  tanggal_mengembalikan: string | null;
  keterangan: string;
};

export default function RiwayatPage() {
  const [riwayatData, setRiwayatData] = useState<RiwayatAktivitas[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchRiwayatData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/riwayat-aktivitas/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        setRiwayatData(response.data);
      } catch (error) {
        console.error("Error fetching riwayat data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiwayatData();
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
                  <BreadcrumbPage>Riwayat</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6">Riwayat Aktivitas</h1>

            {loading ? (
              <p className="text-center text-gray-500">Memuat data...</p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base">No</TableHead>
                      <TableHead className="text-base">Nama Peminjam</TableHead>
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
                        <TableCell className="text-sm">{riwayat.nama_peminjam}</TableCell>
                        <TableCell className="text-sm">
                          {riwayat.barang_dipinjam.map((barang, idx) => (
                            <div key={idx}>
                              - {barang.nama_barang}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell className="text-sm">{riwayat.tanggal_meminjam}</TableCell>
                        <TableCell className="text-sm">{riwayat.tanggal_mengembalikan || "Belum Dikembalikan"}</TableCell>
                        <TableCell className="text-sm">
                          <span
                            className={`px-2 py-1 rounded ${
                              riwayat.keterangan === "Meminjam" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                            }`}
                          >
                            {riwayat.keterangan}
                          </span>
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
              </>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
