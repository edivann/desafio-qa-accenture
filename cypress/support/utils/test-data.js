export function generateTableRecord(options) {
  return {
    firstName: Cypress._.sample(options.firstNames),
    lastName: Cypress._.sample(options.lastNames),
    email: `registro.${crypto.randomUUID()}@example.com`,
    age: Cypress._.random(18, 60),
    salary: Cypress._.random(1000, 20000),
    department: Cypress._.sample(options.departments),
  };
}

export function updateTableRecord(record) {
  return {
    firstName: record.firstName === 'Ana' ? 'Bruno' : 'Ana',
    lastName: record.lastName === 'Silva' ? 'Costa' : 'Silva',
    email: `editado.${crypto.randomUUID()}@example.com`,
    age: record.age + 1,
    salary: record.salary + 1000,
    department: 'Automacao',
  };
}
