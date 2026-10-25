import demoQaPage from '../../pages/DemoQaPage';
import progressBarPage from '../../pages/ProgressBarPage';

const intervalMs = 100; // Intervalo observado no componente real do DemoQA.

function advanceProgress(from, to) {
  for (let percent = from + 1; percent <= to; percent += 1) {
    cy.tick(intervalMs, { log: false });
    // Deixar o React renderizar cada atualização antes do próximo callback.
    progressBarPage.bar().should('have.attr', 'aria-valuenow', String(percent));
  }
}

function startAndPause() {
  progressBarPage.start();
  progressBarPage.startStopButton().should('have.text', 'Stop');
  advanceProgress(0, 20);
  progressBarPage.stop();
  progressBarPage.startStopButton().should('have.text', 'Start');
  return progressBarPage.bar().invoke('attr', 'aria-valuenow').then(Number);
}

describe('DemoQA | Progress Bar', () => {
  beforeEach(() => {
    demoQaPage.visitHome();
    demoQaPage.openProgressBar();
    cy.location('pathname').should('eq', '/progress-bar');
    progressBarPage.heading().should('be.visible').and('have.text', 'Progress Bar');
    progressBarPage.bar().should('have.attr', 'aria-valuenow', '0').and('have.text', '0%');
    progressBarPage.startStopButton().should('have.text', 'Start');
    progressBarPage.resetButton().should('not.exist');

    // Controlar apenas o timer do progresso, preservando Date e os demais timers.
    cy.clock(Date.now(), ['setInterval', 'clearInterval']);
  });

  it('TC-PB-001 - interrompe antes de 25% e confirma que o progresso permanece parado', () => {
    startAndPause().then((pausedAt) => {
      expect(pausedAt, 'progresso avançou e parou antes de 25%')
        .to.be.greaterThan(0).and.be.lessThan(25);

      // Vinte intervalos seriam suficientes para avançar se Stop não funcionasse.
      cy.tick(20 * intervalMs);
      progressBarPage.bar().should('have.attr', 'aria-valuenow', String(pausedAt))
        .and('have.text', `${pausedAt}%`);
      progressBarPage.startStopButton().should('have.text', 'Start');
      progressBarPage.container().screenshot('TC-PB-001-progresso-interrompido');
    });
  });

  it('TC-PB-002 - retoma o progresso, conclui em 100% e reseta ao estado inicial', () => {
    // Pré-condição criada neste teste, sem reutilizar o estado do TC-PB-001.
    startAndPause().then((pausedAt) => {
      expect(pausedAt, 'pré-condição: progresso interrompido antes de 25%')
        .to.be.greaterThan(0).and.be.lessThan(25);
      cy.tick(20 * intervalMs);
      progressBarPage.bar().should('have.attr', 'aria-valuenow', String(pausedAt));

      progressBarPage.start();
      progressBarPage.startStopButton().should('have.text', 'Stop');
      advanceProgress(pausedAt, 100);

      // O componente limpa o intervalo no callback seguinte e mantém 100% na UI.
      cy.tick(intervalMs);
      progressBarPage.bar().should('have.attr', 'aria-valuenow', '100')
        .and('have.text', '100%');
      progressBarPage.startStopButton().should('not.exist');
      progressBarPage.resetButton().should('be.visible').and('have.text', 'Reset');
      progressBarPage.container().screenshot('TC-PB-002-progresso-concluido');

      progressBarPage.reset();
      progressBarPage.bar().should('have.attr', 'aria-valuenow', '0').and('have.text', '0%');
      progressBarPage.startStopButton().should('be.visible').and('have.text', 'Start');
      progressBarPage.resetButton().should('not.exist');
      cy.tick(20 * intervalMs);
      progressBarPage.bar().should('have.attr', 'aria-valuenow', '0').and('have.text', '0%');
      progressBarPage.container().screenshot('TC-PB-002-progresso-resetado');
    });
  });
});
