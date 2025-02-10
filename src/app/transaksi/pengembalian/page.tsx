"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';
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
import { CheckCircle } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

type BarangDipinjam = {
  nama_barang: string;
  jumlah: number;
};

type Peminjaman = {
  id: number;
  nama_peminjam: string;
  barang_dipinjam: BarangDipinjam[];
  tanggal_peminjaman: string;
};

type BarangDetail = {
  id_inventaris: number;
  nama_barang: string;
  jenis_barang: string;
  ruang: string;
  jumlah_barang: number;
};

export default function PengembalianPage() {
  const [dataPeminjaman, setDataPeminjaman] = useState<Peminjaman[]>([]);
  const [barangDetail, setBarangDetail] = useState<BarangDetail[]>([]);
  const [selectedPeminjamanId, setSelectedPeminjamanId] = useState<number | null>(null);
  const [barangConditions, setBarangConditions] = useState<{ [key: number]: string[] }>({});
  const [isIndividualCondition, setIsIndividualCondition] = useState<boolean>(false);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("Access token not found");
        return;
      }

      const response = await axios.get('http://127.0.0.1:8000/api/aktivitas/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDataPeminjaman(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchBarangDetail = async (id: number) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("Access token not found");
        return;
      }

      const response = await axios.get(`http://127.0.0.1:8000/api/aktivitas/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBarangDetail(response.data);
    } catch (error) {
      console.error('Error fetching barang detail:', error);
    }
  };

  const handleConditionChange = (barangIndex: number, itemIndex: number, condition: string) => {
    setBarangConditions((prevConditions) => {
      const newConditions = { ...prevConditions };
      if (!newConditions[barangIndex]) {
        newConditions[barangIndex] = [];
      }
      newConditions[barangIndex][itemIndex] = condition;
      return newConditions;
    });
  };

  const handleAllItemsConditionChange = (condition: string) => {
    const newConditions: { [key: number]: string[] } = {};
    barangDetail.forEach((detail, barangIndex) => {
      newConditions[barangIndex] = Array(detail.jumlah_barang).fill(condition);
    });
    setBarangConditions(newConditions);
  };

  const handlePengembalian = async () => {
    if (selectedPeminjamanId === null) return;

    const details = barangDetail.flatMap((detail, barangIndex) => {
      const conditionCounts: { [key: string]: number } = {};

      barangConditions[barangIndex]?.forEach((condition) => {
        if (condition !== "masih_dipinjam") {
          if (conditionCounts[condition]) {
            conditionCounts[condition]++;
          } else {
            conditionCounts[condition] = 1;
          }
        }
      });

      return Object.entries(conditionCounts).map(([kondisi, jumlah]) => ({
        id_inventaris: detail.id_inventaris,
        kondisi,
        jumlah,
      }));
    });

    const requestBody = {
      id_peminjaman: selectedPeminjamanId,
      details,
    };

    console.log('Request Body:', requestBody);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("Access token not found");
        return;
      }

      await axios.put(`http://127.0.0.1:8000/api/peminjaman/${selectedPeminjamanId}/`, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Pengembalian berhasil');
      toast({
        title: "Sukses",
        description: "Barang berhasil dikembalikan.",
        action: <CheckCircle className="h-6 w-6 text-green-500" />,
      });

      setDataPeminjaman((prevData) =>
        prevData.map((peminjaman) => {
          if (peminjaman.id === selectedPeminjamanId) {
            const updatedBarangDipinjam = peminjaman.barang_dipinjam.map((barang, index) => {
              const remainingJumlah = barang.jumlah - (barangConditions[index]?.filter(cond => cond !== "masih_dipinjam").length || 0);
              return { ...barang, jumlah: remainingJumlah };
            }).filter(barang => barang.jumlah > 0);

            return { ...peminjaman, barang_dipinjam: updatedBarangDipinjam };
          }
          return peminjaman;
        })
      );

      fetchData();
    } catch (error) {
      console.error('Error during pengembalian:', error);
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
                  <TableHead className="text-base">Nama Barang</TableHead>
                  <TableHead className="text-base">Jumlah Total</TableHead>
                  <TableHead className="text-base">Tanggal Peminjaman</TableHead>
                  <TableHead className="text-base">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataPeminjaman.map((peminjaman, index) => {
                  const totalJumlah = peminjaman.barang_dipinjam.reduce((total, barang) => total + barang.jumlah, 0);
                  return (
                    <TableRow key={peminjaman.id}>
                      <TableCell className="text-sm">{index + 1}</TableCell>
                      <TableCell className="text-sm">{peminjaman.nama_peminjam}</TableCell>
                      <TableCell className="text-sm">
                        {peminjaman.barang_dipinjam.map((barang: BarangDipinjam, idx) => (
                          <div key={idx}>
                            - {barang.nama_barang}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell className="text-sm">{totalJumlah}</TableCell>
                      <TableCell className="text-sm">{peminjaman.tanggal_peminjaman}</TableCell>
                      <TableCell className="text-sm">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => {
                                setSelectedPeminjamanId(peminjaman.id);
                                fetchBarangDetail(peminjaman.id);
                              }}
                            >
                              Kembalikan
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-lg max-h-[80vh] overflow-hidden ml-0.5">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Detail Barang</AlertDialogTitle>
                              <AlertDialogDescription>
                                Silahkan kondisi barang yang akan dikemablikan:
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <ScrollArea className="max-h-60">
                              <div className="my-4">
                                <Select onValueChange={(value) => {
                                  if (value === "semua_baik") {
                                    handleAllItemsConditionChange("baik");
                                    setIsIndividualCondition(false);
                                  } else {
                                    setIsIndividualCondition(true);
                                  }
                                }}>
                                  <SelectTrigger className="w-48 pl-2 ml-0.5 mb-2">
                                    <SelectValue placeholder="Pilih Kondisi Barang" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="semua_baik">Kondisi Semua Barang Baik</SelectItem>
                                    <SelectItem value="berbeda">Kondisi Setiap Barang Berbeda</SelectItem>
                                  </SelectContent>
                                </Select>
                                {barangDetail.map((detail, barangIndex) => (
                                  <div key={barangIndex} className="mb-2 ml-0.5">
                                    <strong>Nama Barang:</strong> {detail.nama_barang}<br />
                                    <strong>Jenis Barang:</strong> {detail.jenis_barang}<br />
                                    <strong>Ruang:</strong> {detail.ruang}<br />
                                    <strong>Jumlah:</strong> {detail.jumlah_barang}<br />
                                    {isIndividualCondition && [...Array(detail.jumlah_barang)].map((_, itemIndex) => (
                                      <div key={itemIndex} className="flex items-center mt-1">
                                        <span className="mr-2">Item {itemIndex + 1}:</span>
                                        <Select onValueChange={(value) => handleConditionChange(barangIndex, itemIndex, value)}>
                                          <SelectTrigger className="w-32 pl-2">
                                            <SelectValue placeholder="Pilih Kondisi" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="baik">Baik</SelectItem>
                                            <SelectItem value="rusak">Rusak</SelectItem>
                                            <SelectItem value="hilang">Hilang</SelectItem>
                                            <SelectItem value="masih_dipinjam">Masih Dipinjam</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction onClick={handlePengembalian}>
                                Kembalikan
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
