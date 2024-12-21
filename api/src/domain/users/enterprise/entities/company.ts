import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { User } from './user'

export interface CompanyProps {
  cnpj: string
  name: string
  createdAt: Date
  users: User[]
}

export class Company extends AggregateRoot<CompanyProps> {
  get cnpj() {
    return this.props.cnpj
  }

  get name() {
    return this.props.name
  }

  get createdAt() {
    return this.props.createdAt
  }

  get users() {
    return this.props.users
  }

  set users(users: User[]) {
    this.props.users = users
  }

  static create(
    props: Optional<CompanyProps, 'createdAt' | 'users'>,
    id?: UniqueEntityID,
  ) {
    const company = new Company(
      {
        ...props,
        createdAt: new Date(),
        users: props.users ?? [],
      },
      id,
    )

    return company
  }
}
