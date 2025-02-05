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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const dataPeminjaman = [
  { id: 1, nama: "John Doe", jenis: "Elektronik", barang: "Laptop", jumlah: 1, ruang: "Ruang 101", tanggalPinjam: "2023-10-01" },
  { id: 2, nama: "Jane Smith", jenis: "Elektronik", barang: "Proyektor", jumlah: 2, ruang: "Ruang 202", tanggalPinjam: "2023-10-05" },
  { id: 3, nama: "Alice Johnson", jenis: "Fotografi", barang: "Kamera", jumlah: 1, ruang: "Ruang 303", tanggalPinjam: "2023-10-07" },
];

export default function PengembalianPage() {
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
                  <BreadcrumbPage>Pengembalian</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6">Daftar Peminjaman Barang</h1>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-base">No</TableHead>
                  <TableHead className="text-base">Nama Peminjam</TableHead>
                  <TableHead className="text-base">Jenis Barang</TableHead>
                  <TableHead className="text-base">Ruang</TableHead>
                  <TableHead className="text-base">Nama Barang</TableHead>
                  <TableHead className="text-base">Jumlah Barang</TableHead>
                  <TableHead className="text-base">Tanggal Peminjaman</TableHead>
                  <TableHead className="text-base">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataPeminjaman.map((peminjaman, index) => (
                  <TableRow key={peminjaman.id}>
                    <TableCell className="text-sm">{index + 1}</TableCell>
                    <TableCell className="text-sm">{peminjaman.nama}</TableCell>
                    <TableCell className="text-sm">{peminjaman.jenis}</TableCell>
                    <TableCell className="text-sm">{peminjaman.ruang}</TableCell>
                    <TableCell className="text-sm">{peminjaman.barang}</TableCell>
                    <TableCell className="text-sm">{peminjaman.jumlah}</TableCell>
                    <TableCell className="text-sm">{peminjaman.tanggalPinjam}</TableCell>
                    <TableCell className="text-sm">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="default" size="sm">
                            Kembalikan
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Apakah Anda yakin ingin mengembalikan barang ini?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Pilih kondisi barang terlebih dahulu
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="my-4">
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Kondisi Barang" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="baik">Baik</SelectItem>
                                <SelectItem value="rusak">Rusak</SelectItem>
                                <SelectItem value="hilang">Hilang</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => console.log(`Barang dengan ID ${peminjaman.id} dikembalikan`)}
                            >
                              Kembalikan
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
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
