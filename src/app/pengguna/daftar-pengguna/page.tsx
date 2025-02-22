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
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";

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
  const [pegawaiForm, setPegawaiForm] = useState({
    username: "",
    password: "",
    nama_pegawai: "",
    nip: "",
    alamat: "",
    id_level: "3",
  });
  const [petugasForm, setPetugasForm] = useState({ username: "", password: "", nama_petugas: "", id_level: "" });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Petugas | Pegawai | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Petugas | Pegawai | null>(null);
  const { toast } = useToast();

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

  const fetchPetugasData = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/petugas/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setDataPetugas(data);
    } catch (error) {
      console.error('Error fetching petugas data:', error);
    }
  };

  useEffect(() => {
    fetchPetugasData();
  }, []);

  const handleSubmitPetugas = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/petugas/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...petugasForm,
          id_level: operatorLevelId, // Set the level to operator
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error('Failed to create petugas');
      }
      // Reset form, close dialog, show success toast, and refresh list
      setPetugasForm({ username: '', password: '', nama_petugas: '' });
      setDialogOpen(false);
      toast({
        title: "Sukses",
        description: "Petugas berhasil dibuat dengan level operator.",
        action: <CheckCircle className="h-6 w-6 text-green-500" />,
      });
      fetchPetugasData(); // Refresh the list of petugas
    } catch (error) {
      console.error('Error creating petugas:', error);
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
        setPegawaiForm({ username: "", password: "", nama_pegawai: "", nip: "", alamat: "", id_level: "3" });
        toast({
          title: "Sukses",
          description: "Pegawai berhasil ditambahkan.",
          action: <CheckCircle className="h-6 w-6 text-green-500" />,
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to add pegawai:", errorData);
      }
    } catch (error) {
      console.error("Error adding pegawai:", error);
    }
  };

  const handleEditClick = (user: Petugas | Pegawai) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    if (!token || !selectedUser) {
      console.error("Access token tidak ditemukan atau pengguna tidak dipilih");
      return;
    }

    try {
      const endpoint = selectedUser.hasOwnProperty('nama_petugas') ? 'petugas' : 'pegawai';
      const response = await fetch(`http://127.0.0.1:8000/api/${endpoint}/${selectedUser.id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedUser),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        if (endpoint === 'petugas') {
          setDataPetugas(dataPetugas.map(user => user.id === updatedUser.id ? updatedUser : user));
        } else {
          setDataPegawai(dataPegawai.map(user => user.id === updatedUser.id ? updatedUser : user));
        }
        setEditDialogOpen(false);
        setSelectedUser(null);
        toast({
          title: "Sukses",
          description: "Pengguna berhasil diedit.",
          action: <CheckCircle className="h-6 w-6 text-green-500" />,
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to update user:", errorData);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteClick = (user: Petugas | Pegawai) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("Access token tidak ditemukan");
      return;
    }

    try {
      const endpoint = userToDelete.hasOwnProperty('nama_petugas') ? 'petugas' : 'pegawai';
      const response = await fetch(`http://127.0.0.1:8000/api/${endpoint}/${userToDelete.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        if (endpoint === 'petugas') {
          setDataPetugas(dataPetugas.filter(user => user.id !== userToDelete.id));
        } else {
          setDataPegawai(dataPegawai.filter(user => user.id !== userToDelete.id));
        }
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        toast({
          title: "Sukses",
          description: "Pengguna berhasil dihapus.",
          action: <CheckCircle className="h-6 w-6 text-green-500" />,
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to delete user:", errorData);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Define the operator level ID
  const operatorLevelId = 1; // Set to the actual ID for "operator"

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
                        <Button type="submit">Simpan</Button>
                      </form>
                    ) : (
                      <form className="space-y-4" onSubmit={handleSubmitPegawai}>
                        <div className="flex items-center">
                          <label className="w-24 text-black mr-4">Username</label>
                          <Input
                            type="text"
                            name="username"
                            value={pegawaiForm.username}
                            onChange={handleInputChange}
                            placeholder="Username"
                            className="flex-1 mb-2"
                          />
                        </div>
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
                            <Button variant="outline" size="sm" onClick={() => handleEditClick(petugas)} disabled={petugas.level_name === 'Admin'}>
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(petugas)} disabled={petugas.level_name === 'Admin'}>
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
                            <Button variant="outline" size="sm" onClick={() => handleEditClick(pegawai)}>
                              Edit
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(pegawai)}>
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
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogTitle>Edit Pengguna</DialogTitle>
          <DialogDescription>
            {selectedUser && (
              <form className="space-y-4" onSubmit={handleEditSubmit}>
                {selectedUser.hasOwnProperty('nama_petugas') ? (
                  <>
                    <div className="flex items-center">
                      <label className="w-24 text-black mr-4">Username</label>
                      <Input
                        type="text"
                        name="username"
                        value={selectedUser.username}
                        onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                        placeholder="Username"
                        className="flex-1 mb-2"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="w-24 text-black mr-4">Password</label>
                      <Input
                        type="password"
                        name="password"
                        onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                        placeholder="Password"
                        className="flex-1 mb-2"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="w-24 text-black mr-4">Nama</label>
                      <Input
                        type="text"
                        name="nama_petugas"
                        value={selectedUser.nama_petugas}
                        onChange={(e) => setSelectedUser({ ...selectedUser, nama_petugas: e.target.value })}
                        placeholder="Nama"
                        className="flex-1 mb-2"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center">
                      <label className="w-24 text-black mr-4">Username</label>
                      <Input
                        type="text"
                        name="username"
                        value={selectedUser.username}
                        onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                        placeholder="Username"
                        className="flex-1 mb-2"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="w-24 text-black mr-4">Nama</label>
                      <Input
                        type="text"
                        name="nama_pegawai"
                        value={selectedUser.nama_pegawai}
                        onChange={(e) => setSelectedUser({ ...selectedUser, nama_pegawai: e.target.value })}
                        placeholder="Nama"
                        className="flex-1 mb-2"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="w-24 text-black mr-4">Password</label>
                      <Input
                        type="password"
                        name="password"
                        onChange={(e) => setSelectedUser({ ...selectedUser, password: e.target.value })}
                        placeholder="Password"
                        className="flex-1 mb-2"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="w-24 text-black mr-4">NIP</label>
                      <Input
                        type="text"
                        name="nip"
                        value={selectedUser.nip}
                        onChange={(e) => setSelectedUser({ ...selectedUser, nip: e.target.value })}
                        placeholder="NIP"
                        className="flex-1 mb-2"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="w-24 text-black mr-4">Alamat</label>
                      <Input
                        type="text"
                        name="alamat"
                        value={selectedUser.alamat}
                        onChange={(e) => setSelectedUser({ ...selectedUser, alamat: e.target.value })}
                        placeholder="Alamat"
                        className="flex-1 mb-2"
                      />
                    </div>
                  </>
                )}
                <Button type="submit">Simpan</Button>
              </form>
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus pengguna ini?
          </DialogDescription>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
