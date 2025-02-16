import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { AppSidebarPegawai } from "@/components/app-sidebar-pegawai"; // Import sidebar pegawai
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
import { Input } from "@/components/ui/input"; // Import input component
import axios from "axios";

const BarangPegawaiPage = () => {
  const [availableItems, setAvailableItems] = useState<any[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [jumlahPinjam, setJumlahPinjam] = useState<number>(1);
  const [pegawaiId, setPegawaiId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAvailableItems = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.error("Access token not found in localStorage");
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/api/inventaris/baik/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch available items:", response.statusText);
          return;
        }
        const data = await response.json();
        console.log("Fetched Items:", data); // Log data untuk debugging
        setAvailableItems(data);
      } catch (error) {
        console.error("Error fetching available items:", error);
      }
    };

    const fetchPegawaiId = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const userData = localStorage.getItem("user");
        const userId = userData ? JSON.parse(userData).id : null;

        if (!userId) {
          console.error("User ID not found in localStorage");
          return;
        }

        const response = await fetch(`http://127.0.0.1:8000/api/pegawai/petugas/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error("Failed to fetch pegawai ID:", response.statusText);
          return;
        }

        const data = await response.json();
        setPegawaiId(data.id);
      } catch (error) {
        console.error("Error fetching pegawai ID:", error);
      }
    };

    fetchAvailableItems();
    fetchPegawaiId();
  }, []);

  const handlePeminjaman = async () => {
    if (selectedItemId !== null && pegawaiId !== null) {
      try {
        const token = localStorage.getItem("access_token");
        const requestBody = {
          id_pegawai: pegawaiId,
          details: [
            {
              id_inventaris: selectedItemId,
              jumlah: jumlahPinjam,
            },
          ],
        };

        console.log("Request body for peminjaman:", requestBody);

        const response = await axios.post("http://127.0.0.1:8000/api/peminjaman/pegawai/", requestBody, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.status === 201) {
          console.log("Peminjaman berhasil diajukan.");
          // Optionally, refresh the data or update the UI to reflect the change
        } else {
          console.error("Failed to submit peminjaman:", response.statusText);
        }
      } catch (error) {
        console.error("Error submitting peminjaman:", error);
      }
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
                  <BreadcrumbPage>Barang Pegawai</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6">Daftar Barang Tersedia</h1>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Ruang</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Kode Barang</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {availableItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.nama}</TableCell>
                    <TableCell>{item.nama_jenis}</TableCell>
                    <TableCell>{item.nama_ruang}</TableCell>
                    <TableCell>{item.jumlah}</TableCell>
                    <TableCell>{item.kode_inventaris}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              setSelectedItemId(item.id);
                              setJumlahPinjam(1); // Reset jumlah pinjam setiap kali dialog dibuka
                            }}
                          >
                            Ajukan Peminjaman
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Peminjaman</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin mengajukan peminjaman untuk barang ini?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div className="my-4">
                            <label htmlFor="jumlahPinjam" className="block text-sm font-medium text-gray-700">
                              Jumlah Barang
                            </label>
                            <Input
                              id="jumlahPinjam"
                              type="number"
                              min="1"
                              max={item.jumlah}
                              value={jumlahPinjam}
                              onChange={(e) => setJumlahPinjam(Number(e.target.value))}
                              className="mt-1 block w-full"
                            />
                          </div>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={handlePeminjaman}>
                              Ajukan
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
};

export default BarangPegawaiPage;
