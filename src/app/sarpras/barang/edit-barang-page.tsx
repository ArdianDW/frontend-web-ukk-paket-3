import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

const dataBarang = [
  { id: 1, nama: "Laptop", jenis: "Elektronik", jumlah: 10, ruang: "Ruang 101", kondisi: "Baik", keterangan: "Digunakan untuk presentasi", tanggalRegister: "2023-01-15", kodeInventaris: "INV-001" },
  { id: 2, nama: "Proyektor", jenis: "Elektronik", jumlah: 5, ruang: "Ruang 202", kondisi: "Baik", keterangan: "Digunakan di ruang rapat", tanggalRegister: "2023-02-20", kodeInventaris: "INV-002" },
  { id: 3, nama: "Kamera", jenis: "Fotografi", jumlah: 8, ruang: "Ruang 303", kondisi: "Rusak", keterangan: "Lensa pecah", tanggalRegister: "2023-03-10", kodeInventaris: "INV-003" },
];

export default function EditBarangPage() {
  const { id } = useParams<{ id: string }>();
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

  useEffect(() => {
    if (id) {
      const barang = dataBarang.find((item) => item.id === parseInt(id, 10));
      if (barang) {
        form.reset(barang);
      }
    }
  }, [id, form]);

  const onSubmit = (data: FormData) => {
    console.log("Data Barang yang Diedit:", data);
  };

  return (
    <div className="container">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/barang">Barang</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Edit Barang</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <h1 className="text-3xl font-bold mb-6">Edit Barang</h1>
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
                  <Input placeholder="Jenis Barang" {...field} />
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
                  <Input type="number" placeholder="Jumlah" {...field} />
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
                  <Input placeholder="Ruang" {...field} />
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
            Simpan Perubahan
          </Button>
        </form>
      </Form>
    </div>
  );
}
