import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import LoginImg from "@/assets/login_img.jpg"
import { useAuth } from '../hooks/use-auth'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    const error = await handleLogin(username, password);
    if (error) {
      setErrorMessage(error.non_field_errors?.[0] || 'Login failed');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Inventaris Sarpras</h1>
                <p className="text-balance text-muted-foreground">
                  Silahkan masuk
                </p>
              </div>
              {errorMessage && (
                <div className="text-red-500 text-center">
                  {errorMessage}
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="username">Nama Pengguna</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Kata Sandi</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Lupa kata sandi?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Masuk
              </Button>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img src={LoginImg} alt="" className="h-full"/>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
