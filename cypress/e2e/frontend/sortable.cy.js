import demoQaPage from '../../pages/DemoQaPage';
import sortablePage from '../../pages/SortablePage';

function expectOrder(expected) {
  sortablePage.items().should(($items) => {
    expect([...$items].map((item) => item.textContent.trim()), 'ordem visível dos seis itens')
      .to.deep.eq(expected);
  });
}

describe('DemoQA | Sortable', () => {
  beforeEach(() => {
    demoQaPage.visitHome();
    demoQaPage.openSortable();
    cy.location('pathname').should('eq', '/sortable');
    sortablePage.heading().should('be.visible').and('have.text', 'Sortable');
    sortablePage.selectList();
  });

  it('TC-SO-001 - modifica a lista por arraste nativo e ordena de One a Six', () => {
    const ascending = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
    expectOrder(ascending);
    sortablePage.dragItem('One', 'Two', 'after').should('deep.eq', { nativeDrag: true, nativeDrop: true });
    expectOrder(['Two', 'One', 'Three', 'Four', 'Five', 'Six']);
    sortablePage.dragItem('One', 'Two', 'before').should('deep.eq', { nativeDrag: true, nativeDrop: true });
    expectOrder(ascending);
    sortablePage.container().screenshot('TC-SO-001-ordem-crescente');
  });
});
