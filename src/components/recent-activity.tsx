import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type RecentActivityProps = {
  activities: Array<{
    id: number;
    nama_peminjam: string;
    jenis_barang: string;
    nama_barang: string;
    jumlah_barang: number;
    ruang: string;
    tanggal_peminjaman: string;
    status: string;
  }>
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-2xl">Aktivitas Terbaru</CardTitle>
      </CardHeader>
      <CardContent className="mt-4">
        <Table>
          <TableCaption>Daftar aktivitas peminjaman terbaru.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal Peminjaman</TableHead>
              <TableHead>Nama Barang</TableHead>
              <TableHead>Nama Peminjam</TableHead>
              <TableHead>Aktivitas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">{activity.tanggal_peminjaman}</TableCell>
                <TableCell>{activity.nama_barang}</TableCell>
                <TableCell>{activity.nama_peminjam}</TableCell>
                <TableCell>{activity.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
