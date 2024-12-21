import { makeCompany } from 'test/factories/make-company'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-company-repository'

import { CreateCompanyUseCase } from './create-company'
import { AlreadyExistsCnpjError } from './errors/already-exists-cnpj-error'

let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let sut: CreateCompanyUseCase

describe('CreateCompanyUseCase', () => {
  beforeEach(() => {
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
    sut = new CreateCompanyUseCase(inMemoryCompaniesRepository)
  })

  it('should be able to create a new company', async () => {
    const company = makeCompany()

    const result = await sut.execute({
      cnpj: company.cnpj,
      name: company.name,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryCompaniesRepository.items.length).toBe(1)
    expect(inMemoryCompaniesRepository.items[0].cnpj).toEqual(company.cnpj)
    expect(inMemoryCompaniesRepository.items[0].name).toEqual(company.name)
  })

  it('should not be able to create a new company with an existing CNPJ', async () => {
    const company = makeCompany()
    inMemoryCompaniesRepository.items.push(company)

    const result = await sut.execute({
      cnpj: company.cnpj,
      name: company.name,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AlreadyExistsCnpjError)
  })
})
