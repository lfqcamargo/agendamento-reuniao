import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { TableCell } from '@/components/ui/table'

const getColor = (status: string) => {
  switch (status) {
    case 'disponivel':
      return 'bg-green-500'
    case 'parcialmente':
      return 'bg-yellow-500'
    case 'indisponivel':
      return 'bg-red-500'
    default:
      return 'bg-gray-300'
  }
}

export function TableCellRooms({ item }) {
  return (
    <TableCell>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className={`inline-block w-4 h-4 rounded-full ${getColor(item)}`}
          ></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Escolha o horário</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="w-2/3 m-auto">07:00</div>
          <DialogFooter className="w-2/3 m-auto">
            <Button>Escolher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TableCell>
  )
}
