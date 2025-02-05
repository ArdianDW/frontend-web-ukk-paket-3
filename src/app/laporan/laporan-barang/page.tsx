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

const dataSemuaBarang = [
  { id: 1, nama: "Laptop", kode: "INV-001", kondisi: "Baik", jenis: "Elektronik", ruang: "Ruang 101", tanggalRegistrasi: "2023-01-01" },
  { id: 2, nama: "Proyektor", kode: "INV-002", kondisi: "Baik", jenis: "Elektronik", ruang: "Ruang 102", tanggalRegistrasi: "2023-02-01" },
  { id: 1, nama: "Laptop", kode: "INV-001", kondisi: "Baik", jenis: "Elektronik", ruang: "Ruang 101", tanggalRegistrasi: "2023-01-01" },
  { id: 2, nama: "Proyektor", kode: "INV-002", kondisi: "Baik", jenis: "Elektronik", ruang: "Ruang 102", tanggalRegistrasi: "2023-02-01" },
  { id: 1, nama: "Laptop", kode: "INV-001", kondisi: "Baik", jenis: "Elektronik", ruang: "Ruang 101", tanggalRegistrasi: "2023-01-01" },
  { id: 2, nama: "Proyektor", kode: "INV-002", kondisi: "Baik", jenis: "Elektronik", ruang: "Ruang 102", tanggalRegistrasi: "2023-02-01" },
];

const dataBarangBaru = [
  { id: 3, nama: "Kamera", kode: "INV-003", kondisi: "Baru", jenis: "Fotografi", ruang: "Ruang 103", tanggalRegistrasi: "2023-03-01" },
  { id: 3, nama: "Kamera", kode: "INV-003", kondisi: "Baru", jenis: "Fotografi", ruang: "Ruang 103", tanggalRegistrasi: "2023-03-01" },
  { id: 3, nama: "Kamera", kode: "INV-003", kondisi: "Baru", jenis: "Fotografi", ruang: "Ruang 103", tanggalRegistrasi: "2023-03-01" },
  { id: 3, nama: "Kamera", kode: "INV-003", kondisi: "Baru", jenis: "Fotografi", ruang: "Ruang 103", tanggalRegistrasi: "2023-03-01" },
];

const dataBarangRusak = [
  { id: 4, nama: "Printer", kode: "INV-004", kondisi: "Rusak", jenis: "Peralatan Kantor", ruang: "Ruang 104", tanggalRegistrasi: "2023-04-01", tanggalRusak: "2023-05-01" },
  { id: 4, nama: "Printer", kode: "INV-004", kondisi: "Rusak", jenis: "Peralatan Kantor", ruang: "Ruang 104", tanggalRegistrasi: "2023-04-01", tanggalRusak: "2023-05-01" },
  { id: 4, nama: "Printer", kode: "INV-004", kondisi: "Rusak", jenis: "Peralatan Kantor", ruang: "Ruang 104", tanggalRegistrasi: "2023-04-01", tanggalRusak: "2023-05-01" },
  { id: 4, nama: "Printer", kode: "INV-004", kondisi: "Rusak", jenis: "Peralatan Kantor", ruang: "Ruang 104", tanggalRegistrasi: "2023-04-01", tanggalRusak: "2023-05-01" },
  { id: 4, nama: "Printer", kode: "INV-004", kondisi: "Rusak", jenis: "Peralatan Kantor", ruang: "Ruang 104", tanggalRegistrasi: "2023-04-01", tanggalRusak: "2023-05-01" },
];

const dataBarangHilang = [
  { id: 5, nama: "Monitor", kode: "INV-005", kondisi: "Hilang", jenis: "Elektronik", ruang: "Ruang 105", tanggalRegistrasi: "2023-06-01", tanggalHilang: "2023-07-01" },
  { id: 5, nama: "Monitor", kode: "INV-005", kondisi: "Hilang", jenis: "Elektronik", ruang: "Ruang 105", tanggalRegistrasi: "2023-06-01", tanggalHilang: "2023-07-01" },
  { id: 5, nama: "Monitor", kode: "INV-005", kondisi: "Hilang", jenis: "Elektronik", ruang: "Ruang 105", tanggalRegistrasi: "2023-06-01", tanggalHilang: "2023-07-01" },
  { id: 5, nama: "Monitor", kode: "INV-005", kondisi: "Hilang", jenis: "Elektronik", ruang: "Ruang 105", tanggalRegistrasi: "2023-06-01", tanggalHilang: "2023-07-01" },
  { id: 5, nama: "Monitor", kode: "INV-005", kondisi: "Hilang", jenis: "Elektronik", ruang: "Ruang 105", tanggalRegistrasi: "2023-06-01", tanggalHilang: "2023-07-01" },
];

export default function LaporanBarangPage() {
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
              <Button variant="default" size="sm" onClick={() => window.print()}>
                Print Laporan
              </Button>
            </div>
            <Tabs defaultValue="semua-barang">
              <TabsList>
                <TabsTrigger value="semua-barang">Semua Barang</TabsTrigger>
                <TabsTrigger value="barang-baru">Barang Baru Masuk</TabsTrigger>
                <TabsTrigger value="barang-rusak">Barang Rusak</TabsTrigger>
                <TabsTrigger value="barang-hilang">Barang Hilang</TabsTrigger>
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
                    {dataSemuaBarang.map((barang, index) => (
                      <TableRow key={barang.id}>
                        <TableCell className="text-sm">{index + 1}</TableCell>
                        <TableCell className="text-sm">{barang.nama}</TableCell>
                        <TableCell className="text-sm">{barang.kode}</TableCell>
                        <TableCell className="text-sm">{barang.kondisi}</TableCell>
                        <TableCell className="text-sm">{barang.jenis}</TableCell>
                        <TableCell className="text-sm">{barang.ruang}</TableCell>
                        <TableCell className="text-sm">{barang.tanggalRegistrasi}</TableCell>
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
                    {dataBarangBaru.map((barang, index) => (
                      <TableRow key={barang.id}>
                        <TableCell className="text-sm">{index + 1}</TableCell>
                        <TableCell className="text-sm">{barang.nama}</TableCell>
                        <TableCell className="text-sm">{barang.kode}</TableCell>
                        <TableCell className="text-sm">{barang.kondisi}</TableCell>
                        <TableCell className="text-sm">{barang.jenis}</TableCell>
                        <TableCell className="text-sm">{barang.ruang}</TableCell>
                        <TableCell className="text-sm">{barang.tanggalRegistrasi}</TableCell>
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
                      <TableHead className="text-base">Tanggal Rusak</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataBarangRusak.map((barang, index) => (
                      <TableRow key={barang.id}>
                        <TableCell className="text-sm">{index + 1}</TableCell>
                        <TableCell className="text-sm">{barang.nama}</TableCell>
                        <TableCell className="text-sm">{barang.kode}</TableCell>
                        <TableCell className="text-sm">{barang.kondisi}</TableCell>
                        <TableCell className="text-sm">{barang.jenis}</TableCell>
                        <TableCell className="text-sm">{barang.ruang}</TableCell>
                        <TableCell className="text-sm">{barang.tanggalRegistrasi}</TableCell>
                        <TableCell className="text-sm">{barang.tanggalRusak}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="barang-hilang">
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
                      <TableHead className="text-base">Tanggal Hilang</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataBarangHilang.map((barang, index) => (
                      <TableRow key={barang.id}>
                        <TableCell className="text-sm">{index + 1}</TableCell>
                        <TableCell className="text-sm">{barang.nama}</TableCell>
                        <TableCell className="text-sm">{barang.kode}</TableCell>
                        <TableCell className="text-sm">{barang.kondisi}</TableCell>
                        <TableCell className="text-sm">{barang.jenis}</TableCell>
                        <TableCell className="text-sm">{barang.ruang}</TableCell>
                        <TableCell className="text-sm">{barang.tanggalRegistrasi}</TableCell>
                        <TableCell className="text-sm">{barang.tanggalHilang}</TableCell>
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
