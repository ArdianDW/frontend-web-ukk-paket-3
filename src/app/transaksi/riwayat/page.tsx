"use client"

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

const dataRiwayat = [
  { id: 1, nama: "John Doe", jenis: "Elektronik", barang: "Laptop", jumlah: 1, ruang: "Ruang 101", kondisi: "Baik", tanggalPinjam: "2023-10-01", tanggalKembali: "2023-10-10" },
  { id: 2, nama: "Jane Smith", jenis: "Elektronik", barang: "Proyektor", jumlah: 2, ruang: "Ruang 202", kondisi: "Rusak", tanggalPinjam: "2023-10-05", tanggalKembali: "2023-10-12" },
  { id: 3, nama: "Alice Johnson", jenis: "Fotografi", barang: "Kamera", jumlah: 1, ruang: "Ruang 303", kondisi: "Baik", tanggalPinjam: "2023-10-07", tanggalKembali: "2023-10-15" },
];

export default function RiwayatPage() {
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
            <h1 className="text-3xl font-bold mb-6">Riwayat Pengembalian Barang</h1>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-base">No</TableHead>
                  <TableHead className="text-base">Nama Peminjam</TableHead>
                  <TableHead className="text-base">Jenis Barang</TableHead>
                  <TableHead className="text-base">Ruang</TableHead>
                  <TableHead className="text-base">Nama Barang</TableHead>
                  <TableHead className="text-base">Jumlah Barang</TableHead>
                  <TableHead className="text-base">Kondisi Barang</TableHead>
                  <TableHead className="text-base">Tanggal Peminjaman</TableHead>
                  <TableHead className="text-base">Tanggal Pengembalian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataRiwayat.map((riwayat, index) => (
                  <TableRow key={riwayat.id}>
                    <TableCell className="text-sm">{index + 1}</TableCell>
                    <TableCell className="text-sm">{riwayat.nama}</TableCell>
                    <TableCell className="text-sm">{riwayat.jenis}</TableCell>
                    <TableCell className="text-sm">{riwayat.ruang}</TableCell>
                    <TableCell className="text-sm">{riwayat.barang}</TableCell>
                    <TableCell className="text-sm">{riwayat.jumlah}</TableCell>
                    <TableCell className="text-sm">{riwayat.kondisi}</TableCell>
                    <TableCell className="text-sm">{riwayat.tanggalPinjam}</TableCell>
                    <TableCell className="text-sm">{riwayat.tanggalKembali}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
