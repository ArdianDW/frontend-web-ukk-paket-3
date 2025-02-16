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

export default function RiwayatPengajuanPage() {
  const [pengajuanData, setPengajuanData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPegawaiIdAndPengajuanData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const userData = localStorage.getItem("user");
        const userId = userData ? JSON.parse(userData).id : null;

        if (!token || !userId) {
          console.error("Access token or user ID not found");
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
        const pegawaiId = pegawaiData.id;

        // Fetch pengajuan data using pegawai ID
        const response = await fetch(`http://127.0.0.1:8000/api/peminjaman/user/${pegawaiId}`, {
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
          setPengajuanData(data.reverse());
        } else {
          console.error("Data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPegawaiIdAndPengajuanData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = pengajuanData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pengajuanData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "diterima":
        return "bg-green-500 text-white";
      case "ditolak":
        return "bg-red-500 text-white";
      case "pending":
        return "bg-orange-500 text-white";
      default:
        return "";
    }
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
                  <BreadcrumbPage>Riwayat Pengajuan</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6">Riwayat Pengajuan Saya</h1>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-base">No</TableHead>
                  <TableHead className="text-base">Nama Barang</TableHead>
                  <TableHead className="text-base">Tanggal Pinjam</TableHead>
                  <TableHead className="text-base">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.map((pengajuan, index) => (
                  <TableRow key={pengajuan.id}>
                    <TableCell className="text-sm">{indexOfFirstItem + index + 1}</TableCell>
                    <TableCell className="text-sm">
                      {pengajuan.details.map((detail: any, idx: number) => (
                        <div key={idx}>
                          {detail.nama_barang}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell className="text-sm">{pengajuan.tanggal_pinjam}</TableCell>
                    <TableCell className="text-sm">
                      <span className={`px-2 py-1 rounded ${getStatusColor(pengajuan.status_approval)}`}>
                        {pengajuan.status_approval}
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
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
