"use client"

import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
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
import axios from 'axios';
import { z } from "zod";
import { getAccessToken } from '@/utils/token';

const formSchema = z.object({
  borrowerName: z.string().min(1, "Nama peminjam diperlukan"),
  itemName: z.string().min(1, "Nama barang diperlukan"),
  borrowUntil: z.string().min(1, "Tanggal pengembalian diperlukan"),
});

type FormData = z.infer<typeof formSchema>;

export default function PeminjamanPage() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      borrowerName: "",
      itemName: "",
      borrowUntil: "",
    },
  });

  const [pegawaiList, setPegawaiList] = useState<string[]>([]);
  const [itemList, setItemList] = useState<string[]>([]);
  const [query, setQuery] = useState<{ [key: string]: string }>({
    borrowerName: "",
    itemName: "",
  });

  const fetchData = async (type: 'pegawai' | 'inventaris', searchQuery: string) => {
    if (searchQuery.length < 2) return;
    try {
      const token = getAccessToken();
      const response = await axios.get(`http://127.0.0.1:8000/api/${type}/?search=${searchQuery}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (type === 'pegawai') {
        setPegawaiList(response.data.map((item: { nama_pegawai: string }) => item.nama_pegawai));
      } else {
        setItemList(response.data.map((item: { nama: string }) => item.nama));
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };

  useEffect(() => {
    fetchData('pegawai', query.borrowerName);
  }, [query.borrowerName]);

  useEffect(() => {
    fetchData('inventaris', query.itemName);
  }, [query.itemName]);

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
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
        <div className="flex flex-1 flex-col gap-2 p-2">
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full h-full p-8 bg-white shadow-md rounded-lg">
              <h1 className="text-3xl font-bold mb-6">Form Peminjaman</h1>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="borrowerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Peminjam</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nama Peminjam"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setQuery((prev) => ({ ...prev, borrowerName: e.target.value }));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                        {pegawaiList.length > 0 && (
                          <ul className="bg-white border border-gray-300 mt-2 rounded-md shadow-lg">
                            {pegawaiList.map((nama, index) => (
                              <li
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  form.setValue('borrowerName', nama);
                                  setPegawaiList([]);
                                }}
                              >
                                {nama}
                              </li>
                            ))}
                          </ul>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="itemName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nama Barang</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nama Barang"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              setQuery((prev) => ({ ...prev, itemName: e.target.value }));
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                        {itemList.length > 0 && (
                          <ul className="bg-white border border-gray-300 mt-2 rounded-md shadow-lg">
                            {itemList.map((item, index) => (
                              <li
                                key={index}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  form.setValue('itemName', item);
                                  setItemList([]);
                                }}
                              >
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="borrowUntil"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dipinjam Sampai</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
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
