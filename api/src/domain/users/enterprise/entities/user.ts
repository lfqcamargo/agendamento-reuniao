import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export enum UserRole {
  Admin = 1,
  Member = 2,
}

export interface UserProps {
  companyId: UniqueEntityID
  email: string
  name: string
  nickname: string
  password: string
  role: UserRole
  active: boolean
  profilePhoto?: Buffer | null
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

  get profilePhoto() {
    if (this.props.profilePhoto) {
      return this.props.profilePhoto
    }
    return null
  }

  get createdAt() {
    return this.props.createdAt
  }

  get lastLogin() {
    if (this.props.lastLogin) {
      return this.props.lastLogin
    }
    return null
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

  set role(role: UserRole) {
    this.props.role = role
  }

  set active(active: boolean) {
    this.props.active = active
  }

  set profilePhoto(profilePhoto: Buffer | null) {
    this.props.profilePhoto = profilePhoto
  }

  set lastLogin(data: Date | null) {
    this.props.lastLogin = data
  }

  isAdmin() {
    return this.role === UserRole.Admin
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
