const itemsSelector = '#demo-tabpane-list .list-group-item';

class SortablePage {
  container() { return cy.get('#sortableContainer'); }
  heading() { return this.container().find('h1'); }
  items() { return cy.get(itemsSelector); }
  selectList() { return cy.get('#demo-tab-list').click(); }

  dragItem(from, to, placement) {
    this.container().scrollIntoView();
    return cy.puppeteer('dragSortableItem', {
      pathname: '/sortable', selector: itemsSelector, from, to, placement,
    });
  }
}

export default new SortablePage();
