import LoginPage from "@/app/login/page";
import DashboardPage from "@/app/dashboard/page";
import PeminjamanPage from "@/app/transaksi/peminjaman/page";
import PengembalianPage from "@/app/transaksi/pengembalian/page";
import RiwayatPage from "@/app/transaksi/riwayat/page";
import BarangPage from "@/app/sarpras/barang/page";
import TambahBarangPage from "@/app/sarpras/barang/tambah-barang-page";
import EditBarangPage from "@/app/sarpras/barang/edit-barang-page";
import JenisPage from "@/app/sarpras/jenis/page";
import RuangPage from "@/app/sarpras/ruang/page";
import DaftarPenggunaPage from "@/app/pengguna/daftar-pengguna/page";
import PengaturanPage from "@/app/pengguna/pengaturan/page";
import UnauthorizedPage from "@/app/unauthorized/page";
import UserLayout from "@/layout/UserLayout";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthGuard } from '../hooks/use-auth-guard';
import LaporanBarangPage from "@/app/laporan/laporan-barang/page";

const AppRoutes = createBrowserRouter([
    {
        path : "/",
        element : <UserLayout/>,
        children : [
            {
                index: true, 
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path : "/login",
                element : <LoginPage/>
            },
            {
                path : "/dashboard",
                element : <AuthGuard><DashboardPage/></AuthGuard>
            },
            {
                path : "/peminjaman",
                element : <AuthGuard><PeminjamanPage/></AuthGuard>
            },
            {
                path : "/pengembalian",
                element : <AuthGuard><PengembalianPage/></AuthGuard>
            },
            {
                path : "/riwayat",
                element : <AuthGuard><RiwayatPage/></AuthGuard>
            },
            {
                path : "/barang",
                element : <AuthGuard requiredRole="Operator"><BarangPage/></AuthGuard>
            },
            {
                path : "/barang/tambah-barang",
                element : <AuthGuard requiredRole="Operator"><TambahBarangPage/></AuthGuard>
            },
            {
                path : "/barang/edit-barang",
                element : <AuthGuard requiredRole="Operator"><EditBarangPage/></AuthGuard>
            },

            {
                path : "/jenis",
                element : <AuthGuard requiredRole="Operator"><JenisPage/></AuthGuard>
            },
            {
                path : "/ruang",
                element : <AuthGuard requiredRole="Operator"><RuangPage/></AuthGuard>
            },
            {
                path : "/daftar-pengguna",
                element : <AuthGuard requiredRole="Admin"><DaftarPenggunaPage/></AuthGuard>
            },
            {
                path : "/pengaturan",
                element : <AuthGuard><PengaturanPage/></AuthGuard>
            },
            {
                path : "/laporan-barang",
                element : <AuthGuard><LaporanBarangPage/></AuthGuard>
            },
            {
                path : "/unauthorized",
                element : <AuthGuard><UnauthorizedPage/></AuthGuard>
            },
        ]
    }
]);

export default AppRoutes;
