import { CalendarIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { TableCellRooms } from '../auth/components/table-cell-rooms'

const items = [
  {
    id: 1,
    title: 'Sala 01',
    segunda: 'disponivel',
    terça: 'disponivel',
    quarta: 'parcialmente',
    quinta: 'disponivel',
    sexta: 'indisponivel',
  },
  {
    id: 2,
    title: 'Sala 02',
    segunda: 'indisponivel',
    terça: 'parcialmente',
    quarta: 'disponivel',
    quinta: 'parcialmente',
    sexta: 'indisponivel',
  },
  {
    id: 3,
    title: 'Sala 03',
    segunda: 'parcialmente',
    terça: 'disponivel',
    quarta: 'indisponivel',
    quinta: 'disponivel',
    sexta: 'parcialmente',
  },
  {
    id: 4,
    title: 'Sala 04',
    segunda: 'disponivel',
    terça: 'indisponivel',
    quarta: 'parcialmente',
    quinta: 'indisponivel',
    sexta: 'disponivel',
  },
  {
    id: 5,
    title: 'Sala 05',
    segunda: 'parcialmente',
    terça: 'parcialmente',
    quarta: 'disponivel',
    quinta: 'disponivel',
    sexta: 'indisponivel',
  },
  {
    id: 6,
    title: 'Sala 06',
    segunda: 'indisponivel',
    terça: 'disponivel',
    quarta: 'parcialmente',
    quinta: 'disponivel',
    sexta: 'parcialmente',
  },
]

export function Home() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  function handleDate(selectedDate: Date | undefined) {
    if (isDialogOpen) {
      setIsDialogOpen(false)
    }
    console.log(selectedDate)
  }

  return (
    <>
      <div className="w-full">
        <div className="w-full mx-auto flex flex-col items-center mt-8">
          <Label
            className="w-full flex justify-center p-2"
            htmlFor="chosenDate"
          >
            Escolha uma data
          </Label>
          <div className="w-full flex justify-center items-center">
            <div className="w-1/3">
              <Input
                value={date?.toISOString().split('T')[0]}
                onChange={(e) => handleDate(new Date(e.target.value))}
                className="w-full"
                type="date"
                id="chosenDate"
              />
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <CalendarIcon />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Escolha uma data</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="w-2/3 m-auto">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border shadow justify-center align-middle"
                  />
                </div>
                <DialogFooter className="w-2/3 m-auto">
                  <Button onClick={() => handleDate(date)}>Escolher</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Segunda</TableHead>
              <TableHead>Terça</TableHead>
              <TableHead>Quarta</TableHead>
              <TableHead>Quinta</TableHead>
              <TableHead>Sexta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.title}</TableCell>
                <TableCellRooms item={item.segunda} />
                <TableCellRooms item={item.terça} />
                <TableCellRooms item={item.quarta} />
                <TableCellRooms item={item.quinta} />
                <TableCellRooms item={item.sexta} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
