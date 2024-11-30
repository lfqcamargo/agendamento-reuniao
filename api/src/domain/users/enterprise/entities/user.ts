import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface UserProps {
  companyId: UniqueEntityID
  email: string
  name: string
  nickname: string
  password: string
  role: number
  active: boolean
  createdAt: Date
  lastLogin?: Date | null
}

export class User extends Entity<UserProps> {
  get companyId() {
    return this.props.companyId
  }

  get email() {
    return this.props.email
  }

  get name() {
    return this.props.name
  }

  get nickname() {
    return this.props.nickname
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
  }

  get active() {
    return this.props.active
  }

  get createdAt() {
    return this.props.createdAt
  }

  get lastLogin() {
    return this.props.lastLogin
  }

  set name(name: string) {
    this.props.name = name
  }

  set nickname(nickname: string) {
    this.props.nickname = nickname
  }

  set password(password: string) {
    this.props.password = password
  }

  set role(role: number) {
    this.props.role = role
  }

  set active(active: boolean) {
    this.props.active = active
  }

  static create(props: Optional<UserProps, 'createdAt'>, id?: UniqueEntityID) {
    const user = new User(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return user
  }
}
