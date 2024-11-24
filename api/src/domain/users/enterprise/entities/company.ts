import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface CompanyProps {
  cnpj: string
  name: string
  createdAt: Date
}

export class Company extends Entity<CompanyProps> {
  get cnpj() {
    return this.props.cnpj
  }

  get name() {
    return this.props.name
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<CompanyProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const company = new Company(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return company
  }
}
