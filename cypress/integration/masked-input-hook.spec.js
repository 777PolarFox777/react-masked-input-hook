describe('MaskedInputHook', () => {
  before(() => {
    cy.visit('http://localhost:3000');
  });
  it('should allow to type a phone number', () => {
    cy.dataCy('phone-input')
      .type('9998887766')
      .should('have.value', '+7 (999) 888-77-66')
      .dataCy('phone-reset')
      .click()
      .dataCy('phone-input')
      .should('have.value', '')
      .focus()
      .should('have.value', '+7 (___) ___-__-__')
      .dataCy('phone-fill')
      .click()
      .dataCy('phone-input')
      .should('have.value', '+7 (988) 579-34-52');
  });
});
