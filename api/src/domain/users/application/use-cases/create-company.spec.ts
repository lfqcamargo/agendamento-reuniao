import { makeCompany } from 'test/factories/make-company'
import { InMemoryCompanyRepository } from 'test/repositories/in-memory-company-repository'

import { CreateCompanyUseCase } from './create-company'
import { AlreadyExistsCnpjError } from './errors/already-exists-cnpj-error'

let inMemoryCompanyRepository: InMemoryCompanyRepository
let sut: CreateCompanyUseCase

describe('CreateCompanyUseCase', () => {
  beforeEach(() => {
    inMemoryCompanyRepository = new InMemoryCompanyRepository()
    sut = new CreateCompanyUseCase(inMemoryCompanyRepository)
  })

  it('should be able to create a new company', async () => {
    const company = makeCompany()

    const result = await sut.execute({
      cnpj: company.cnpj,
      name: company.name,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCompanyRepository.items.length).toBe(1)
    expect(inMemoryCompanyRepository.items[0].cnpj).toEqual(company.cnpj)
    expect(inMemoryCompanyRepository.items[0].name).toEqual(company.name)
  })

  it('should not be able to create a new company with an existing CNPJ', async () => {
    const company = makeCompany()
    inMemoryCompanyRepository.items.push(company)

    const result = await sut.execute({
      cnpj: company.cnpj,
      name: company.name,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsCnpjError)
  })
})
