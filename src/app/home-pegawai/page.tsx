import React, { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AppSidebarPegawai } from "@/components/app-sidebar-pegawai";
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
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue
} from "@/components/ui/select";

const PegawaiHomePage = () => {
  const [borrowedItems, setBorrowedItems] = useState<any[]>([]);
  const [pegawaiName, setPegawaiName] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("baik");

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
        setPegawaiName(pegawaiData.nama_pegawai); // Set nama pegawai

        // Fetch aktivitas menggunakan pegawai ID
        const response = await fetch(`http://127.0.0.1:8000/api/aktivitas/user/${pegawaiId}/`, {
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
            barang_dipinjam: item.barang_dipinjam,
            tanggalPinjam: item.tanggal_peminjaman,
            status: item.status_peminjaman,
            jumlahTotal: item.barang_dipinjam.reduce((total: number, barang: any) => total + barang.jumlah, 0),
          }));
          setBorrowedItems(formattedData);
        } else {
          console.error("Data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchPegawaiIdAndData();
  }, []);

  const handleReturn = async (itemId: number, itemDetails: any) => {
    try {
      const token = localStorage.getItem("access_token");
      const url = `http://127.0.0.1:8000/api/peminjaman/pegawai/${itemId}/`;
      const requestBody = {
        details: itemDetails.map((barang: any) => ({
          id_inventaris: barang.id_inventaris,
          jumlah: barang.jumlah,
          kondisi: selectedCondition,
        })),
      };
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      };

      console.log("Request URL:", url);
      console.log("Request Options:", options);

      const response = await fetch(url, options);

      if (!response.ok) {
        console.error("Failed to submit return request:", response.statusText);
        return;
      }

      console.log(`Pengembalian untuk barang dengan ID: ${itemId} berhasil diajukan.`);
      // Optionally, refresh the data or update the UI to reflect the change
    } catch (error) {
      console.error("Error submitting return request:", error);
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
                  <BreadcrumbPage>Home Pegawai</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-6">Selamat datang, {pegawaiName}!</h1>
            <h2 className="text-xl font-semibold mb-4">Daftar Barang yang Sedang Anda Pinjam</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Jumlah Total</TableHead>
                  <TableHead>Tanggal Pinjam</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowedItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {item.barang_dipinjam.map((barang: any, idx: number) => (
                        <div key={idx}>
                          {barang.nama_barang} ({barang.jumlah})
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>{item.jumlahTotal}</TableCell>
                    <TableCell>{item.tanggalPinjam}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="default" size="sm" onClick={() => handleReturn(item.id, item.barang_dipinjam)}>
                            Ajukan Pengembalian
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Konfirmasi Pengembalian</AlertDialogTitle>
                            <AlertDialogDescription>
                              Apakah Anda yakin ingin mengembalikan barang ini?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <div my-4>
                            <Select onValueChange={setSelectedCondition}>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih kondisi barang"/>
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
                            <AlertDialogAction onClick={() => handleReturn(item.id, item.barang_dipinjam)}>
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
};

export default PegawaiHomePage;
