class ProgressBarPage {
  container() {
    return cy.get('#progressBarContainer');
  }

  heading() {
    return this.container().find('h1');
  }

  bar() {
    return cy.get('#progressBar [role="progressbar"]');
  }

  startStopButton() {
    return cy.get('#startStopButton');
  }

  resetButton() {
    return cy.get('#resetButton');
  }

  start() {
    return this.startStopButton().click();
  }

  stop() {
    return this.startStopButton().click();
  }

  reset() {
    return this.resetButton().click();
  }
}

export default new ProgressBarPage();
