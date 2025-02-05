"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Petugas {
  id: number;
  username: string;
  nama_petugas: string;
  level_name: string;
}

interface Pegawai {
  id: number;
  nama_pegawai: string;
  nip: string;
  alamat: string;
}

interface Level {
  id: number;
  nama_level: string;
}

export default function DaftarPenggunaPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("petugas");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dataPetugas, setDataPetugas] = useState<Petugas[]>([]);
  const [dataPegawai, setDataPegawai] = useState<Pegawai[]>([]);
  const [dataLevel, setDataLevel] = useState<Level[]>([]);
  const [pegawaiForm, setPegawaiForm] = useState({ nama_pegawai: "", password: "", nip: "", alamat: "" });
  const [petugasForm, setPetugasForm] = useState({ username: "", password: "", nama_petugas: "", id_level: "" });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.error("Access token tidak ditemukan");
        return;
      }

      try {
        const petugasResponse = await fetch("http://127.0.0.1:8000/api/petugas/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const petugasData: Petugas[] = await petugasResponse.json();
        setDataPetugas(Array.isArray(petugasData) ? petugasData : []);

        const pegawaiResponse = await fetch("http://127.0.0.1:8000/api/pegawai/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const pegawaiData: Pegawai[] = await pegawaiResponse.json();
        setDataPegawai(Array.isArray(pegawaiData) ? pegawaiData : []);

        const levelResponse = await fetch("http://127.0.0.1:8000/api/level/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const levelData: Level[] = await levelResponse.json();
        setDataLevel(Array.isArray(levelData) ? levelData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (activeTab === "petugas") {
      setPetugasForm({ ...petugasForm, [name]: value });
    } else {
      setPegawaiForm({ ...pegawaiForm, [name]: value });
    }
  };

  const handleSubmitPetugas = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("Access token tidak ditemukan");
      return;
    }

    try {
      console.log("Data yang dikirim:", petugasForm);

      const response = await fetch("http://127.0.0.1:8000/api/petugas/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(petugasForm),
      });

      if (response.ok) {
        const newPetugas = await response.json();
        setDataPetugas([...dataPetugas, newPetugas]);
        setDialogOpen(false);
        setPetugasForm({ username: "", password: "", nama_petugas: "", id_level: "" });
      } else {
        const errorData = await response.json();
        console.error("Failed to add petugas:", errorData);
      }
    } catch (error) {
      console.error("Error adding petugas:", error);
    }
  };

  const handleSubmitPegawai = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("Access token tidak ditemukan");
      return;
    }

    try {
      console.log("Data yang dikirim:", pegawaiForm);

      const response = await fetch("http://127.0.0.1:8000/api/pegawai/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pegawaiForm),
      });

      if (response.ok) {
        const newPegawai = await response.json();
        setDataPegawai([...dataPegawai, newPegawai]);
        setDialogOpen(false);
        setPegawaiForm({ nama_pegawai: "", password: "", nip: "", alamat: "" });
      } else {
        const errorData = await response.json();
        console.error("Failed to add pegawai:", errorData);
      }
    } catch (error) {
      console.error("Error adding pegawai:", error);
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
                  <BreadcrumbPage>Daftar Pengguna</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Daftar Pengguna</h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default" size="sm" onClick={() => setDialogOpen(true)}>
                    Tambah Pengguna
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>Tambah {activeTab === "petugas" ? "Petugas" : "Pegawai"}</DialogTitle>
                  <DialogDescription>
                    {activeTab === "petugas" ? (
                      <form className="space-y-4" onSubmit={handleSubmitPetugas}>
                        <div className="flex items-center">
                          <label className="w-24 text-black mr-4">Username</label>
                          <Input
                            type="text"
                            name="username"
                            value={petugasForm.username}
                            onChange={handleInputChange}
                            placeholder="Username"
                            className="flex-1 mb-2"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-black mr-4">Password</label>
                          <Input
                            type="password"
                            name="password"
                            value={petugasForm.password}
                            onChange={handleInputChange}
                            placeholder="Password"
                            className="flex-1 mb-2"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-black mr-4">Nama</label>
                          <Input
                            type="text"
                            name="nama_petugas"
                            value={petugasForm.nama_petugas}
                            onChange={handleInputChange}
                            placeholder="Nama"
                            className="flex-1 mb-2"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-black mr-4">Level</label>
                          <Select
                            name="id_level"
                            value={petugasForm.id_level}
                            onValueChange={(value) => setPetugasForm({ ...petugasForm, id_level: value })}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Pilih Level" />
                            </SelectTrigger>
                            <SelectContent>
                              {dataLevel.map((level) => (
                                <SelectItem key={level.id} value={level.id.toString()}>
                                  {level.nama_level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit">Simpan</Button>
                      </form>
                    ) : (
                      <form className="space-y-4" onSubmit={handleSubmitPegawai}>
                        <div className="flex items-center">
                          <label className="w-24 text-black mr-4">Nama</label>
                          <Input
                            type="text"
                            name="nama_pegawai"
                            value={pegawaiForm.nama_pegawai}
                            onChange={handleInputChange}
                            placeholder="Nama"
                            className="flex-1 mb-2"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-black mr-4">Password</label>
                          <Input
                            type="password"
                            name="password"
                            value={pegawaiForm.password}
                            onChange={handleInputChange}
                            placeholder="Password"
                            className="flex-1 mb-2"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-black mr-4">NIP</label>
                          <Input
                            type="text"
                            name="nip"
                            value={pegawaiForm.nip}
                            onChange={handleInputChange}
                            placeholder="NIP"
                            className="flex-1 mb-2"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="w-24 text-black mr-4">Alamat</label>
                          <Input
                            type="text"
                            name="alamat"
                            value={pegawaiForm.alamat}
                            onChange={handleInputChange}
                            placeholder="Alamat"
                            className="flex-1 mb-2"
                          />
                        </div>
                        <Button type="submit">Simpan</Button>
                      </form>
                    )}
                  </DialogDescription>
                </DialogContent>
              </Dialog>
            </div>
            <Tabs defaultValue="petugas" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="petugas">Petugas</TabsTrigger>
                <TabsTrigger value="pegawai">Pegawai</TabsTrigger>
              </TabsList>
              <TabsContent value="petugas">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base">No</TableHead>
                      <TableHead className="text-base">Username</TableHead>
                      <TableHead className="text-base">Nama Petugas</TableHead>
                      <TableHead className="text-base">Level</TableHead>
                      <TableHead className="text-base">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataPetugas.map((petugas, index) => (
                      <TableRow key={petugas.id}>
                        <TableCell className="text-sm">{index + 1}</TableCell>
                        <TableCell className="text-sm">{petugas.username}</TableCell>
                        <TableCell className="text-sm">{petugas.nama_petugas}</TableCell>
                        <TableCell className="text-sm">{petugas.level_name}</TableCell>
                        <TableCell className="text-sm">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => console.log(`Edit ${petugas.nama_petugas}`)}>
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => console.log(`Hapus ${petugas.nama_petugas}`)}>
                              Hapus
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="pegawai">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base">No</TableHead>
                      <TableHead className="text-base">Nama</TableHead>
                      <TableHead className="text-base">NIP</TableHead>
                      <TableHead className="text-base">Alamat</TableHead>
                      <TableHead className="text-base">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dataPegawai.map((pegawai, index) => (
                      <TableRow key={pegawai.id}>
                        <TableCell className="text-sm">{index + 1}</TableCell>
                        <TableCell className="text-sm">{pegawai.nama_pegawai}</TableCell>
                        <TableCell className="text-sm">{pegawai.nip}</TableCell>
                        <TableCell className="text-sm">{pegawai.alamat}</TableCell>
                        <TableCell className="text-sm">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => console.log(`Edit ${pegawai.nama_pegawai}`)}>
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => console.log(`Hapus ${pegawai.nama_pegawai}`)}>
                              Hapus
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
