"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { useState, useEffect } from "react";

interface Barang {
  id: number;
  nama: string;
  kondisi: string;
  keterangan: string;
  jumlah: number;
  tanggal_register: string;
  kode_inventaris: string;
  nama_jenis: string;
  nama_ruang: string;
}

export default function LaporanBarangPage() {
  const [activeTab, setActiveTab] = useState<string>("semua-barang");
  const [dataBarang, setDataBarang] = useState<Barang[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");
      const typeMap: { [key: string]: string } = {
        "semua-barang": "all",
        "barang-baru": "recent",
        "barang-rusak": "rusak",
      };
      const type = typeMap[activeTab];

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/laporan/?type=${type}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Barang[] = await response.json();
        setDataBarang(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleExport = async () => {
    const token = localStorage.getItem("access_token");
    const typeMap: { [key: string]: string } = {
      "semua-barang": "all",
      "barang-baru": "recent",
      "barang-rusak": "rusak",
    };
    const type = typeMap[activeTab];

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/laporan/export/?type=${type}`, {
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
                  <BreadcrumbPage>Laporan Barang</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Laporan Barang</h1>
              <div className="flex space-x-2">
                <Button variant="default" size="sm" onClick={() => window.print()}>
                  Print Laporan
                </Button>
                <Button variant="default" size="sm" onClick={handleExport}>
                  Unduh Laporan
                </Button>
              </div>
            </div>
            <Tabs defaultValue="semua-barang" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="semua-barang">Semua Barang</TabsTrigger>
                <TabsTrigger value="barang-baru">Barang Baru Masuk</TabsTrigger>
                <TabsTrigger value="barang-rusak">Barang Rusak</TabsTrigger>
              </TabsList>
              <TabsContent value="semua-barang">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base">No</TableHead>
                      <TableHead className="text-base">Nama Barang</TableHead>
                      <TableHead className="text-base">Kode</TableHead>
                      <TableHead className="text-base">Kondisi</TableHead>
                      <TableHead className="text-base">Jenis</TableHead>
                      <TableHead className="text-base">Ruang</TableHead>
                      <TableHead className="text-base">Tanggal Registrasi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataBarang.map((barang, index) => (
                      <TableRow key={barang.id}>
                        <TableCell className="text-sm">{index + 1}</TableCell>
                        <TableCell className="text-sm">{barang.nama}</TableCell>
                        <TableCell className="text-sm">{barang.kode_inventaris}</TableCell>
                        <TableCell className="text-sm">{barang.kondisi}</TableCell>
                        <TableCell className="text-sm">{barang.nama_jenis}</TableCell>
                        <TableCell className="text-sm">{barang.nama_ruang}</TableCell>
                        <TableCell className="text-sm">{barang.tanggal_register}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="barang-baru">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base">No</TableHead>
                      <TableHead className="text-base">Nama Barang</TableHead>
                      <TableHead className="text-base">Kode</TableHead>
                      <TableHead className="text-base">Kondisi</TableHead>
                      <TableHead className="text-base">Jenis</TableHead>
                      <TableHead className="text-base">Ruang</TableHead>
                      <TableHead className="text-base">Tanggal Registrasi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataBarang.map((barang, index) => (
                      <TableRow key={barang.id}>
                        <TableCell className="text-sm">{index + 1}</TableCell>
                        <TableCell className="text-sm">{barang.nama}</TableCell>
                        <TableCell className="text-sm">{barang.kode_inventaris}</TableCell>
                        <TableCell className="text-sm">{barang.kondisi}</TableCell>
                        <TableCell className="text-sm">{barang.nama_jenis}</TableCell>
                        <TableCell className="text-sm">{barang.nama_ruang}</TableCell>
                        <TableCell className="text-sm">{barang.tanggal_register}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="barang-rusak">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base">No</TableHead>
                      <TableHead className="text-base">Nama Barang</TableHead>
                      <TableHead className="text-base">Kode</TableHead>
                      <TableHead className="text-base">Kondisi</TableHead>
                      <TableHead className="text-base">Jenis</TableHead>
                      <TableHead className="text-base">Ruang</TableHead>
                      <TableHead className="text-base">Tanggal Registrasi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataBarang.map((barang, index) => (
                      <TableRow key={barang.id}>
                        <TableCell className="text-sm">{index + 1}</TableCell>
                        <TableCell className="text-sm">{barang.nama}</TableCell>
                        <TableCell className="text-sm">{barang.kode_inventaris}</TableCell>
                        <TableCell className="text-sm">{barang.kondisi}</TableCell>
                        <TableCell className="text-sm">{barang.nama_jenis}</TableCell>
                        <TableCell className="text-sm">{barang.nama_ruang}</TableCell>
                        <TableCell className="text-sm">{barang.tanggal_register}</TableCell>
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
