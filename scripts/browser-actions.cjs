async function findApplicationFrame(browser, pathname) {
  for (const page of await browser.pages()) {
    const frame = page.frames().find((candidate) => {
      try { return new URL(candidate.url()).pathname === pathname; }
      catch { return false; }
    });
    if (frame) return { page, frame };
  }
  throw new Error(`Contexto da aplicação não encontrado: ${pathname}`);
}

async function dragSortableItem(browser, { pathname, selector, from, to, placement }) {
  const { page, frame } = await findApplicationFrame(browser, pathname);
  const items = await frame.$$(selector);
  const labels = await Promise.all(items.map((item) => item.evaluate((el) => el.textContent.trim())));
  const source = items[labels.indexOf(from)];
  const target = items[labels.indexOf(to)];
  if (!source || !target) throw new Error(`Itens de arraste não encontrados: ${from} → ${to}`);

  // Cypress escala o iframe da aplicação. Coordenadas nativas usam a página inteira.
  const host = await frame.frameElement();
  const hostRect = await host.evaluate((el) => el.getBoundingClientRect().toJSON());
  const viewport = await frame.evaluate(() => ({ width: innerWidth, height: innerHeight }));
  const start = await source.evaluate((el) => el.getBoundingClientRect().toJSON());
  const end = await target.evaluate((el) => el.getBoundingClientRect().toJSON());
  const point = (rect, fraction) => ({
    x: hostRect.x + (rect.x + rect.width / 2) * hostRect.width / viewport.width,
    y: hostRect.y + (rect.y + rect.height * fraction) * hostRect.height / viewport.height,
  });
  const first = point(start, 0.5);
  const last = point(end, placement === 'after' ? 0.8 : 0.2);
  // Observação apenas: não alterar itens, eventos ou estado da aplicação.
  await frame.evaluate(() => {
    window.__qaNativeDrag = [];
    window.__qaDragListener = (event) => window.__qaNativeDrag.push({ type: event.type, trusted: event.isTrusted });
    ['dragstart', 'drop'].forEach((type) => document.addEventListener(type, window.__qaDragListener, true));
  });
  let events;
  await page.setDragInterception(true);
  try {
    await page.mouse.dragAndDrop(first, last);
  } finally {
    await page.mouse.reset();
    await page.setDragInterception(false);
    events = await frame.evaluate(() => {
      const events = window.__qaNativeDrag;
      ['dragstart', 'drop'].forEach((type) => document.removeEventListener(type, window.__qaDragListener, true));
      delete window.__qaNativeDrag; delete window.__qaDragListener;
      return events;
    });
    await Promise.all([...items, host].map((item) => item.dispose()));
  }
  return { nativeDrag: events.some((event) => event.type === 'dragstart' && event.trusted),
    nativeDrop: events.some((event) => event.type === 'drop' && event.trusted) };
}

module.exports = { dragSortableItem, findApplicationFrame };
