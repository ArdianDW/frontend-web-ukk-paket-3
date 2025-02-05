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

const recentActivities = [
  {
    dateBorrowed: "01/01/2023",
    itemName: "Laptop",
    borrowerName: "Ady",
    activity: "Meminjam",
  },
  {
    dateBorrowed: "02/01/2023",
    itemName: "Proyektor",
    borrowerName: "Joko",
    activity: "Mengembalikan",
  },
  {
    dateBorrowed: "03/01/2023",
    itemName: "Kamera",
    borrowerName: "Reza",
    activity: "Meminjam",
  },
  {
    dateBorrowed: "04/01/2023",
    itemName: "Tablet",
    borrowerName: "Rafi",
    activity: "Mengembalikan",
  },
  {
    dateBorrowed: "05/01/2023",
    itemName: "Printer",
    borrowerName: "Eko",
    activity: "Meminjam",
  },
]

export function RecentActivity() {
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
              <TableHead className="w-[150px]">Tanggal Dipinjam</TableHead>
              <TableHead>Nama Barang</TableHead>
              <TableHead>Nama Peminjam</TableHead>
              <TableHead>Aktivitas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivities.map((activity, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{activity.dateBorrowed}</TableCell>
                <TableCell>{activity.itemName}</TableCell>
                <TableCell>{activity.borrowerName}</TableCell>
                <TableCell>{activity.activity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
