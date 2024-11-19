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

const items = [
  { title: 'Sala 01' },
  { title: 'Sala 02' },
  { title: 'Sala 03' },
  { title: 'Sala 04' },
  { title: 'Sala 05' },
  { title: 'Sala 06' },
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

        <div>
          {items.map((item) => (
            <div key={item.title}>{item.title}</div>
          ))}
        </div>
      </div>
    </>
  )
}
