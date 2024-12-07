import { FieldError } from 'react-hook-form'

interface ErrorFieldsType {
  error?: FieldError
}

export function ErrorField({ error }: ErrorFieldsType) {
  return (
    <div className="h-2 text-right">
      {error && <p className="text-destructive">{error.message}</p>}
    </div>
  )
}
