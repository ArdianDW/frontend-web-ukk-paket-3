import LoginPage from "@/app/login/page";
import DashboardPage from "@/app/dashboard/page";
import PeminjamanPage from "@/app/transaksi/peminjaman/page";
import PengembalianPage from "@/app/transaksi/pengembalian/page";
import PengajuanPage from "@/app/transaksi/pengajuan/page";
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
import LaporanTransaksiPage from "@/app/laporan/laporan-transaksi/page";
import PegawaiHomePage from "@/app/home-pegawai/page";
import BarangPegawaiPage from "@/app/barang-pegawai/page";
import RiwayatPegawaiPage from "@/app/riwayat-pegawai/page";
import PengaturanPegawaiPage from "@/app/pengaturan-pegawai/page";
import RegisterPage from "@/app/register/page";
import PeminjamanFormPage from "@/app/transaksi/peminjaman/peminjaman-form-page";
import PengajuanPeminjamanForm from "@/app/barang-pegawai/pengajuan-peminjaman-form";
import RiwayatPengajuanPage from "@/app/riwayat-pengajuan/page";
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
                path : "/register",
                element: <RegisterPage/>
            },
            {
                path : "/dashboard",
                element : <AuthGuard requiredRoles={["Admin", "Operator"]}><DashboardPage/></AuthGuard>
            },
            {
                path : "/peminjaman",
                element : <AuthGuard requiredRoles={["Admin", "Operator"]}><PeminjamanPage/></AuthGuard>
            },
            {
                path : "/peminjaman/form",
                element : <AuthGuard requiredRoles={["Admin", "Operator"]}><PeminjamanFormPage/></AuthGuard>
            },
            {
                path : "/pengembalian",
                element : <AuthGuard requiredRoles={["Admin", "Operator"]}><PengembalianPage/></AuthGuard>
            },
            {
                path : "/pengajuan",
                element : <AuthGuard requiredRoles={["Admin", "Operator"]}><PengajuanPage/></AuthGuard>
            },
            {
                path : "/riwayat",
                element : <AuthGuard requiredRoles={["Admin", "Operator"]}><RiwayatPage/></AuthGuard>
            },
            {
                path : "/barang",
                element : <AuthGuard requiredRoles={["Operator"]}><BarangPage/></AuthGuard>
            },
            {
                path : "/barang/tambah-barang",
                element : <AuthGuard requiredRoles={["Operator"]}><TambahBarangPage/></AuthGuard>
            },
            {
                path : "/barang/edit-barang",
                element : <AuthGuard requiredRoles={["Operator"]}><EditBarangPage/></AuthGuard>
            },

            {
                path : "/jenis",
                element : <AuthGuard requiredRoles={["Operator"]}><JenisPage/></AuthGuard>
            },
            {
                path : "/ruang",
                element : <AuthGuard requiredRoles={["Operator"]}><RuangPage/></AuthGuard>
            },
            {
                path : "/daftar-pengguna",
                element : <AuthGuard requiredRoles={["Admin"]}><DaftarPenggunaPage/></AuthGuard>
            },
            {
                path : "/pengaturan",
                element : <AuthGuard requiredRoles={["Admin", "Operator"]}><PengaturanPage/></AuthGuard>
            },
            {
                path : "/laporan-barang",
                element : <AuthGuard requiredRoles={["Admin", "Operator"]}><LaporanBarangPage/></AuthGuard>
            },
            {
                path : "/laporan-transaksi",
                element : <AuthGuard requiredRoles={["Admin", "Operator"]}><LaporanTransaksiPage/></AuthGuard>
            },
            {
                path : "/pegawai",
                element : <AuthGuard requiredRoles={["Pegawai"]}><PegawaiHomePage /></AuthGuard>
            },
            {
                path : "/pegawai/barang",
                element : <AuthGuard requiredRoles={["Pegawai"]}><BarangPegawaiPage /></AuthGuard>
            },
            {
                path : "/pegawai/barang/form",
                element : <AuthGuard requiredRoles={["Pegawai"]}><PengajuanPeminjamanForm /></AuthGuard>
            },
            {
                path : "/pegawai/riwayat",
                element : <AuthGuard requiredRoles={["Pegawai"]}><RiwayatPegawaiPage /></AuthGuard>
            },
            {
                path : "/pegawai/riwayat-pengajuan",
                element : <AuthGuard requiredRoles={["Pegawai"]}><RiwayatPengajuanPage /></AuthGuard>
            },
            {
                path: "/pegawai/pengaturan",
                element: <AuthGuard requiredRoles={["Pegawai"]}><PengaturanPegawaiPage/></AuthGuard>
            },
            {
                path : "/unauthorized",
                element : <UnauthorizedPage/>
            },
        ]
    }
]);

export default AppRoutes;
