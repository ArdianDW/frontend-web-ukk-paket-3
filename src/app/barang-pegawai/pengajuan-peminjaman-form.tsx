"use client";

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
import { z } from "zod";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Inventaris = {
  id: number;
  nama: string;
};

const formSchema = z.object({
  borrowerName: z.string().min(1, "Nama peminjam diperlukan"),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().min(1, "Jumlah harus lebih dari 0"),
  })).min(1, "Setidaknya satu barang harus dipilih"),
});

type FormData = z.infer<typeof formSchema>;

export default function PengajuanPeminjamanForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      borrowerName: "",
      items: [],
    },
  });

  const { toast } = useToast();
  const [itemList, setItemList] = useState<Inventaris[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [pegawaiId, setPegawaiId] = useState<number | null>(null);

  useEffect(() => {
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
        console.log("Fetched Inventaris Data:", data); // Log data from API
        setItemList(data.map((item) => ({ id: item.id, nama: item.nama })));
      } catch (error) {
        console.error("Error fetching inventaris:", error);
      }
    };

    fetchInventaris();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error("Access token not found");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch current user");
        }
        const userData = await response.json();
        console.log("Pengajuan Peminjaman Form - User ID:", userData.id); // Log ID pegawai
        form.setValue('borrowerName', userData.nama_petugas);
        const pegawaiId = localStorage.getItem("pegawai_id");
        if (pegawaiId) {
          setPegawaiId(parseInt(pegawaiId, 10)); // Use ID from localStorage
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, [form]);

  const onSubmit = async (data: FormData) => {
    const token = localStorage.getItem('access_token');
    if (!token || pegawaiId === null) {
      console.error("Access token or pegawai ID not found");
      return;
    }

    console.log("Item List:", itemList); // Log itemList
    console.log("Form Data Items:", data.items); // Log data.items

    const requestBody = {
      id_pegawai: pegawaiId,
      tanggal_pinjam: new Date().toISOString().split('T')[0],
      details: data.items.map(item => {
        const selectedItem = itemList.find(i => i.nama === item.name);
        console.log("Selected Item:", selectedItem); // Log selectedItem
        return {
          id_inventaris: selectedItem?.id,
          jumlah: item.quantity,
        };
      }),
    };

    console.log("Request Body:", requestBody);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/peminjaman/pegawai/", {
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

  const filteredItems = searchTerm
    ? itemList.filter(item => item.nama.toLowerCase().includes(searchTerm.toLowerCase()))
    : itemList.slice(0, 5);

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
                  <BreadcrumbLink href="/pegawai">Beranda</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/pegawai/barang">Barang Pegawai</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Form</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-2">
          <div className="flex items-center justify-center py-8">
            <div className="w-full max-w-3xl p-6 bg-white shadow-md rounded-lg">
              <h1 className="text-3xl font-bold mb-6">Form Pengajuan Peminjaman</h1>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="borrowerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="text-left font-semibold">Nama Peminjam: {field.value}</div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="items"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Barang</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Input
                                placeholder="Pilih Barang"
                                readOnly
                                value={field.value.map(i => i.name).join(', ')}
                                className="text-left"
                              />
                            </PopoverTrigger>
                            <PopoverContent className="w-full">
                              <Command>
                                <CommandInput
                                  placeholder="Cari nama barang..."
                                  onValueChange={setSearchTerm}
                                />
                                <CommandList>
                                  {filteredItems.map((item, index) => (
                                    <CommandItem
                                      key={index}
                                      onSelect={() => handleSelectItem(item.nama)}
                                      className="text-left"
                                    >
                                      {item.nama}
                                    </CommandItem>
                                  ))}
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {field.value.map((item, index) => (
                            <div key={index} className="flex items-center gap-1 border border-gray-300 bg-white px-2 py-1 rounded">
                              <span>{item.name}</span>
                              <Controller
                                control={form.control}
                                name={`items.${index}.quantity`}
                                render={({ field: quantityField }) => (
                                  <Input
                                    type="number"
                                    min="1"
                                    {...quantityField}
                                    className="w-16"
                                    onChange={(e) => {
                                      const quantity = parseInt(e.target.value, 10);
                                      quantityField.onChange(isNaN(quantity) ? 1 : quantity);
                                    }}
                                  />
                                )}
                              />
                              <button type="button" onClick={() => handleRemoveItem(item.name)} className="text-black">
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
