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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

type BarangDipinjam = {
  nama_barang: string;
  jumlah: number;
};

type RiwayatAktivitas = {
  id: number;
  nama_peminjam: string;
  barang_dipinjam: BarangDipinjam[];
  tanggal: string;
};

export default function LaporanTransaksiPage() {
  const [activeTab, setActiveTab] = useState<string>("peminjaman");
  const [riwayatData, setRiwayatData] = useState<RiwayatAktivitas[]>([]);

  useEffect(() => {
    const fetchRiwayatData = async () => {
      const token = localStorage.getItem("access_token");
      const type = activeTab === "peminjaman" ? "peminjaman" : "pengembalian";
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/laporan/peminjaman-pengembalian/?type=${type}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setRiwayatData(data);
      } catch (error) {
        console.error("Error fetching riwayat data:", error);
      }
    };

    fetchRiwayatData();
  }, [activeTab]);

  const handleExport = async () => {
    const token = localStorage.getItem("access_token");
    const type = activeTab === "peminjaman" ? "peminjaman" : "pengembalian";

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/laporan/export-peminjaman-pengembalian/?type=${type}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to export data");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `laporan-${type}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
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
                  <BreadcrumbPage>Laporan Transaksi</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Laporan Transaksi</h1>
              <Button variant="default" size="sm" onClick={handleExport}>
                Unduh Laporan
              </Button>
            </div>
            <Tabs defaultValue="peminjaman" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="peminjaman">Peminjaman</TabsTrigger>
                <TabsTrigger value="pengembalian">Pengembalian</TabsTrigger>
              </TabsList>
              <TabsContent value="peminjaman">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base">No</TableHead>
                      <TableHead className="text-base">Nama Peminjam</TableHead>
                      <TableHead className="text-base">Nama Barang</TableHead>
                      <TableHead className="text-base">Tanggal Meminjam</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {riwayatData.map((riwayat, index) => (
                      <TableRow key={riwayat.id}>
                        <TableCell className="text-sm">{index + 1}</TableCell>
                        <TableCell className="text-sm">{riwayat.nama_peminjam}</TableCell>
                        <TableCell className="text-sm">
                          {riwayat.barang_dipinjam.map((barang, idx) => (
                            <div key={idx}>
                              {barang.nama_barang} ({barang.jumlah})
                            </div>
                          ))}
                        </TableCell>
                        <TableCell className="text-sm">{riwayat.tanggal}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="pengembalian">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base">No</TableHead>
                      <TableHead className="text-base">Nama Peminjam</TableHead>
                      <TableHead className="text-base">Nama Barang</TableHead>
                      <TableHead className="text-base">Tanggal Mengembalikan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {riwayatData.map((riwayat, index) => (
                      <TableRow key={riwayat.id}>
                        <TableCell className="text-sm">{index + 1}</TableCell>
                        <TableCell className="text-sm">{riwayat.nama_peminjam}</TableCell>
                        <TableCell className="text-sm">
                          {riwayat.barang_dipinjam.map((barang, idx) => (
                            <div key={idx}>
                              {barang.nama_barang} ({barang.jumlah})
                            </div>
                          ))}
                        </TableCell>
                        <TableCell className="text-sm">{riwayat.tanggal}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
