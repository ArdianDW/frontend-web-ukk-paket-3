"use client"

import { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AppSidebar } from "@/components/app-sidebar";
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
import { z } from "zod";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationNext,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { useNavigate } from 'react-router-dom';

type Pegawai = {
  id: number;
  nama_pegawai: string;
};

type Inventaris = {
  id: number;
  nama: string;
  nama_jenis: string;
  nama_ruang: string;
  jumlah: number;
  kode_inventaris: string;
};

const formSchema = z.object({
  borrowerName: z.string().min(1, "Nama peminjam diperlukan"),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().min(1, "Jumlah harus lebih dari 0"),
  })).min(1, "Setidaknya satu barang harus dipilih"),
});

type FormData = z.infer<typeof formSchema>;

export default function PeminjamanPage() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      borrowerName: "",
      items: [],
    },
  });

  const { toast } = useToast();
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [itemList, setItemList] = useState<Inventaris[]>([]);
  const [availableItems, setAvailableItems] = useState<Inventaris[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPegawai = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("Access token not found");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/pegawai/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Pegawai[] = await response.json();
        setPegawaiList(data.map((pegawai) => ({ id: pegawai.id, nama_pegawai: pegawai.nama_pegawai })));
      } catch (error) {
        console.error("Error fetching pegawai:", error);
      }
    };

    const fetchInventaris = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("Access token not found");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/inventaris/baik/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Inventaris[] = await response.json();
        setAvailableItems(data);
      } catch (error) {
        console.error("Error fetching inventaris:", error);
      }
    };

    fetchPegawai();
    fetchInventaris();
  }, []);

  const filteredItems = availableItems.filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const onSubmit = async (data: FormData) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error("Access token not found");
      return;
    }

    const selectedPegawai = pegawaiList.find(p => p.nama_pegawai === data.borrowerName);
    if (!selectedPegawai) {
      console.error("Pegawai not found");
      return;
    }

    const requestBody = {
      id_pegawai: selectedPegawai.id,
      details: data.items.map(item => {
        const selectedItem = itemList.find(i => i.nama === item.name);
        return {
          id_inventaris: selectedItem?.id,
          jumlah: item.quantity,
        };
      }),
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/peminjaman/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to submit peminjaman");
      }

      toast({
        title: "Peminjaman Berhasil",
        description: "Peminjaman telah berhasil disubmit.",
        action: <CheckCircle className="h-6 w-6 text-green-500" />,
      });

      form.reset(); 
    } catch (error) {
      console.error("Error submitting peminjaman:", error);
    }
  };

  const handleSelectItem = (item: string) => {
    const currentItems = form.getValues('items');
    if (!currentItems.some(i => i.name === item)) {
      form.setValue('items', [...currentItems, { name: item, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (item: string) => {
    const currentItems = form.getValues('items');
    form.setValue('items', currentItems.filter(i => i.name !== item));
  };

  const handlePinjam = (item: Inventaris) => {
    localStorage.setItem('selectedItem', JSON.stringify(item));
    navigate('/peminjaman/form');
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
                  <BreadcrumbPage>Peminjaman</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Daftar Barang Tersedia</h1>
              <Button
                variant="default"
                onClick={() => navigate('/peminjaman/form')}
              >
                Pinjam Barang
              </Button>
            </div>
            <div className="flex justify-between items-center mb-4">
              <Input
                type="text"
                placeholder="Cari Nama Barang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-1/2"
              />
            </div>
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
                {currentItems.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{index + 1 + indexOfFirstItem}</TableCell>
                    <TableCell>{item.nama}</TableCell>
                    <TableCell>{item.nama_jenis}</TableCell>
                    <TableCell>{item.nama_ruang}</TableCell>
                    <TableCell>{item.jumlah}</TableCell>
                    <TableCell>{item.kode_inventaris}</TableCell>
                    <TableCell>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handlePinjam(item)}
                      >
                        Pinjam
                      </Button>
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
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={i + 1 === currentPage}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
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
