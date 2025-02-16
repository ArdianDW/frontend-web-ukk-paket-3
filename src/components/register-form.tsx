import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LoginImg from "@/assets/login_img.jpg"
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import axios from 'axios'
import { CheckCircle, XCircle } from "lucide-react"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const username = formData.get('username') as string;
    const namaPegawai = formData.get('name') as string;
    const password = formData.get('password') as string;
    const nip = formData.get('nip') as string;
    const alamat = formData.get('alamat') as string;

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/pegawai/', {
        username,
        nama_pegawai: namaPegawai,
        password,
        nip,
        alamat
      });

      if (response.status === 201) {
        toast({
          title: "Registrasi Berhasil",
          description: "Akun Anda telah berhasil dibuat.",
          action: <CheckCircle className="h-6 w-6 text-green-500" />,
        });
        navigate('/login');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.nip) {
          setErrorMessage('NIP sudah terdaftar.');
          toast({
            title: "Pendaftaran Gagal",
            description: 'NIP sudah terdaftar.',
            variant: "destructive",
            action: <XCircle className="h-6 w-6 text-red-500" />,
          });
        } else {
          setErrorMessage('Pendaftaran gagal. Silakan coba lagi.');
          toast({
            title: "Pendaftaran Gagal",
            description: 'Pendaftaran gagal. Silakan coba lagi.',
            variant: "destructive",
            action: <XCircle className="h-6 w-6 text-red-500" />,
          });
        }
      } else {
        setErrorMessage('Pendaftaran gagal. Silakan coba lagi.');
        toast({
          title: "Pendaftaran Gagal",
          description: 'Pendaftaran gagal. Silakan coba lagi.',
          variant: "destructive",
          action: <XCircle className="h-6 w-6 text-red-500" />,
        });
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card className="overflow-hidden -mt-4">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-4 md:p-8" onSubmit={handleRegister}>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Inventaris Sarpras</h1>
                <p className="text-balance text-muted-foreground">
                  Daftarkan Pengguna Baru 
                </p>
              </div>
              {errorMessage && (
                <div className="text-red-500 text-center">
                  {errorMessage}
                </div>
              )}
              <div className="grid gap-1">
                <Label htmlFor="username">Nama Pengguna</Label>
                <Input id="username" name="username" type="text" required />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="name">Nama</Label>
                <Input id="name" name="name" type="text" required />
              </div>
              <div className="grid gap-1">
                <div className="flex items-center">
                  <Label htmlFor="password">Kata Sandi</Label>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="nip">NIP</Label>
                <Input id="nip" name="nip" type="text" required />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="alamat">Alamat</Label>
                <Input id="alamat" name="alamat" type="text" required />
              </div>
              <Button type="submit" className="w-full">
                Daftar
              </Button>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img src={LoginImg} alt="" className="h-full w-full object-cover aspect-square" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
