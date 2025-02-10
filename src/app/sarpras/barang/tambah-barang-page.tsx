"use client"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

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
import { useEffect, useState } from "react";
import axios from "axios";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  nama: z.string().min(1, "Nama barang diperlukan"),
  jenis: z.string().min(1, "Jenis barang diperlukan"),
  jumlah: z.number().min(1, "Jumlah diperlukan"),
  ruang: z.string().min(1, "Ruang diperlukan"),
  kondisi: z.string().min(1, "Kondisi diperlukan"),
  keterangan: z.string().optional(),
  tanggalRegister: z.string().min(1, "Tanggal register diperlukan"),
  kodeInventaris: z.string().min(1, "Kode inventaris diperlukan"),
});

type FormData = z.infer<typeof formSchema>;

export default function TambahBarangPage() {
  // Definisikan tipe untuk ruang dan jenis
  type Option = {
    id: number;
    nama_jenis?: string;
    nama_ruang?: string;
  };

  const [ruangOptions, setRuangOptions] = useState<Option[]>([]);
  const [jenisOptions, setJenisOptions] = useState<Option[]>([]);
  const idPetugas = 1;
  const accessToken = localStorage.getItem("access_token");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/ruang/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => setRuangOptions(response.data))
    .catch(error => console.error("Error fetching ruang:", error));

    axios.get("http://127.0.0.1:8000/api/jenis/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => setJenisOptions(response.data))
    .catch(error => console.error("Error fetching jenis:", error));
  }, [accessToken]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      jenis: "",
      jumlah: 1,
      ruang: "",
      kondisi: "",
      keterangan: "",
      tanggalRegister: "",
      kodeInventaris: "",
    },
  });

  const onSubmit = (data: FormData) => {
    const requestData = {
      nama: data.nama,
      kode_inventaris: data.kodeInventaris,
      kondisi: data.kondisi,
      keterangan: data.keterangan,
      jumlah: data.jumlah,
      id_jenis: parseInt(data.jenis),
      id_ruang: parseInt(data.ruang),
      id_petugas: idPetugas,
      tanggal_register: data.tanggalRegister,
    };

    console.log("Request Data:", requestData);

    axios.post("http://127.0.0.1:8000/api/inventaris/", requestData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(response => {
      console.log("Data Barang berhasil disimpan:", response.data);
      toast({
        title: "Sukses",
        description: "Barang berhasil ditambahkan.",
        action: <CheckCircle className="h-6 w-6 text-green-500" />,
      });
      navigate("/barang");
    })
    .catch(error => {
      console.error("Error saving data:", error);
      if (error.response) {
        console.error("Server responded with:", error.response.data);
      }
    });
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
                  <BreadcrumbLink href="/barang">Barang</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Tambah Barang</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Barang</FormLabel>
                      <FormControl>
                        <Input placeholder="Nama Barang" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jenis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jenis Barang</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Jenis" />
                          </SelectTrigger>
                          <SelectContent>
                            {jenisOptions.map((jenis) => (
                              <SelectItem key={jenis.id} value={jenis.id.toString()}>
                                {jenis.nama_jenis}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jumlah"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jumlah</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Jumlah"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ruang"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ruang</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih Ruang" />
                          </SelectTrigger>
                          <SelectContent>
                            {ruangOptions.map((ruang) => (
                              <SelectItem key={ruang.id} value={ruang.id.toString()}>
                                {ruang.nama_ruang}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kondisi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kondisi</FormLabel>
                      <FormControl>
                        <Input placeholder="Kondisi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="keterangan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keterangan</FormLabel>
                      <FormControl>
                        <Input placeholder="Keterangan" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tanggalRegister"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tanggal Register</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="kodeInventaris"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kode Inventaris</FormLabel>
                      <FormControl>
                        <Input placeholder="Kode Inventaris" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Simpan
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}