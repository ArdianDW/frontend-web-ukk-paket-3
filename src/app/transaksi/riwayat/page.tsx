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

export default function RiwayatPage() {
  const [dataRiwayat, setDataRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem('access_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/aktivitas/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data");
        }

        const data = await response.json();

        const formattedData = data.flatMap((item) =>
          item.details.map((detail) => ({
            id: item.id,
            nama: item.nama_peminjam,
            jenis: detail.jenis_barang,
            barang: detail.nama_barang,
            jumlah: detail.jumlah_barang,
            ruang: detail.ruang,
            tanggalPinjam: item.tanggal_pinjam,
          }))
        );

        setDataRiwayat(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
            <h1 className="text-3xl font-bold mb-6">Riwayat Peminjaman Barang</h1>

            {loading ? (
              <p className="text-center text-gray-500">Memuat data...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-base">No</TableHead>
                    <TableHead className="text-base">Nama Peminjam</TableHead>
                    <TableHead className="text-base">Jenis Barang</TableHead>
                    <TableHead className="text-base">Nama Barang</TableHead>
                    <TableHead className="text-base">Jumlah Barang</TableHead>
                    <TableHead className="text-base">Ruang</TableHead>
                    <TableHead className="text-base">Tanggal Peminjaman</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dataRiwayat.map((riwayat, index) => (
                    <TableRow key={`${riwayat.id}-${index}`}>
                      <TableCell className="text-sm">{index + 1}</TableCell>
                      <TableCell className="text-sm">{riwayat.nama}</TableCell>
                      <TableCell className="text-sm">{riwayat.jenis}</TableCell>
                      <TableCell className="text-sm">{riwayat.barang}</TableCell>
                      <TableCell className="text-sm">{riwayat.jumlah}</TableCell>
                      <TableCell className="text-sm">{riwayat.ruang}</TableCell>
                      <TableCell className="text-sm">{riwayat.tanggalPinjam}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
