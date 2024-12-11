import {
  Controller,
  FieldError,
  FieldErrors,
  UseFormRegister,
} from 'react-hook-form'

import { ErrorField } from './error-field'
import { Checkbox } from './ui/checkbox'
import { Input } from './ui/input'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

interface GenericFormProps {
  fields: string[]
  register: UseFormRegister<any>
  errors: FieldErrors
  control: any
}

export function GenericForm({
  fields,
  register,
  errors,
  control,
}: GenericFormProps) {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {fields.map((field) => {
        switch (field) {
          case 'companyName':
            return (
              <div key={field} className="flex flex-col w-full">
                <Label className="p-2" htmlFor="companyName">
                  Nome da Empresa
                </Label>
                <Input
                  id={field}
                  placeholder="Digite nome da empresa..."
                  {...register(field)}
                />
                <ErrorField error={errors[field] as FieldError} />
              </div>
            )

          case 'cnpj':
            return (
              <div key={field} className="flex flex-col w-full">
                <Label className="p-2" htmlFor="cnpj">
                  CNPJ
                </Label>
                <Input
                  id={field}
                  placeholder="Digite o cnpj..."
                  {...register(field)}
                />
                <ErrorField error={errors[field] as FieldError} />
              </div>
            )

          case 'email':
            return (
              <div key={field} className="flex flex-col w-full">
                <Label className="p-2" htmlFor="email">
                  Email
                </Label>
                <Input
                  id={field}
                  placeholder="Digite seu email..."
                  {...register(field)}
                />
                <ErrorField error={errors[field] as FieldError} />
              </div>
            )

          case 'userName':
            return (
              <div key={field} className="flex flex-col w-full">
                <Label className="p-2" htmlFor="userName">
                  Nome Completo do Usuário
                </Label>
                <Input
                  id={field}
                  placeholder="Digite o nome completo..."
                  {...register(field)}
                />
                <ErrorField error={errors[field] as FieldError} />
              </div>
            )

          case 'nickname':
            return (
              <div key={field} className="flex flex-col w-full">
                <Label className="p-2" htmlFor="nickname">
                  Nome de usuário
                </Label>
                <Input
                  id={field}
                  placeholder="Digite um apelido..."
                  {...register(field)}
                />
                <ErrorField error={errors[field] as FieldError} />
              </div>
            )

          case 'password':
            return (
              <div key={field} className="flex flex-col w-full">
                <Label className="p-2" htmlFor="password">
                  Senha
                </Label>
                <Input
                  id={field}
                  type="password"
                  placeholder="Digite uma senha..."
                  {...register(field)}
                />
                <ErrorField error={errors[field] as FieldError} />
              </div>
            )

          case 'repeatPassword':
            return (
              <div key={field} className="flex flex-col w-full">
                <Label className="p-2" htmlFor="repeatPassword">
                  Repita a Senha
                </Label>
                <Input
                  id={field}
                  type="password"
                  placeholder="Repita a senha..."
                  {...register(field)}
                />
                <ErrorField error={errors[field] as FieldError} />
              </div>
            )

          case 'role':
            return (
              <div key={field} className="flex flex-col w-full">
                <Label className="p-2" htmlFor="role">
                  Tipo de Usuário
                </Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Admin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="1">Admin</SelectItem>
                          <SelectItem value="2">Usuário</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <ErrorField error={errors[field] as FieldError} />
              </div>
            )

          case 'active':
            return (
              <div key={field} className="flex w-full justify-end items-center">
                <Controller
                  name="active"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="active"
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  )}
                />
                <Label className="p-2" htmlFor="active">
                  Usuário Ativo
                </Label>
              </div>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
