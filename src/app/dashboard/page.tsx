import { useState, useEffect } from 'react';
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Users, Box, User, Building } from "lucide-react"
import { Component as PieChartComponent } from "@/components/pie-chart"
import { RecentActivity } from "@/components/recent-activity"
import axios from 'axios';

export default function Page() {
  const [dashboardData, setDashboardData] = useState({
    totalPetugas: 0,
    totalBarang: 0,
    totalPegawai: 0,
    totalRuang: 0,
    barangTersedia: 0,
    barangDipinjam: 0,
    barangRusakDanHilang: 0,
    recentActivities: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get('http://127.0.0.1:8000/api/dashboard', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API Response:', response.data);
        setDashboardData({
          totalPetugas: response.data.total_petugas,
          totalBarang: response.data.total_inventaris,
          totalPegawai: response.data.total_pegawai,
          totalRuang: response.data.total_ruang,
          barangTersedia: response.data.barang_tersedia,
          barangDipinjam: response.data.barang_dipinjam,
          barangRusakDanHilang: response.data.barang_rusak_dan_hilang,
          recentActivities: response.data.riwayat_terbaru,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const pieData = [
    { name: 'Tersedia', value: dashboardData.barangTersedia, fill: '#4CAF50' },
    { name: 'Dipinjam', value: dashboardData.barangDipinjam, fill: '#FFC107' },
    { name: 'Rusak / Hilang', value: dashboardData.barangRusakDanHilang, fill: '#F44336' },
  ];

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
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-2 p-2">
          <div className="grid auto-rows-min gap-2 md:grid-cols-4">
            <div className="h-20 rounded-lg bg-muted/50 flex items-center justify-start p-4">
              <Users className="mr-4 size-6" />
              <div>
                <h2 className="text-lg font-semibold">Total Petugas</h2>
                <p className="text-xl">{dashboardData.totalPetugas}</p>
              </div>
            </div>
            <div className="h-20 rounded-lg bg-muted/50 flex items-center justify-start p-4">
              <User className="mr-4 size-6" />
              <div>
                <h2 className="text-lg font-semibold">Total Pegawai</h2>
                <p className="text-xl">{dashboardData.totalPegawai}</p>
              </div>
            </div>
            <div className="h-20 rounded-lg bg-muted/50 flex items-center justify-start p-4">
              <Box className="mr-4 size-6" />
              <div>
                <h2 className="text-lg font-semibold">Total Barang</h2>
                <p className="text-xl">{dashboardData.totalBarang}</p>
              </div>
            </div>
            <div className="h-20 rounded-lg bg-muted/50 flex items-center justify-start p-4">
              <Building className="mr-4 size-6" />
              <div>
                <h2 className="text-lg font-semibold">Total Ruang</h2>
                <p className="text-xl">{dashboardData.totalRuang}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <PieChartComponent data={pieData} />
            <RecentActivity activities={dashboardData.recentActivities} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
