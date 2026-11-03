(() => {
  const filters = [...document.querySelectorAll('[data-filter]')];
  const groups = [...document.querySelectorAll('#results-table tbody')];
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    groups.forEach(group => { group.hidden = button.dataset.filter !== 'all' && group.dataset.group !== button.dataset.filter; });
  }));
  const tabs = [...document.querySelectorAll('[data-panel]')];
  function selectAnalysis(button) {
    tabs.forEach(item => {
      const selected = item === button;
      item.setAttribute('aria-pressed', String(selected));
      document.getElementById(item.dataset.panel).hidden = !selected;
    });
  }
  tabs.forEach(button => {
    button.setAttribute('aria-controls', button.dataset.panel);
    button.addEventListener('click', () => selectAnalysis(button));
  });
  selectAnalysis(tabs[0]);
  const viewer = document.getElementById('viewer');
  const enlarged = document.getElementById('view-img');
  document.querySelectorAll('[data-zoom]').forEach(link => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !viewer.showModal) return;
    event.preventDefault();
    const source = link.querySelector('img');
    enlarged.src = link.href;
    enlarged.alt = source ? source.alt : link.dataset.description;
    document.getElementById('viewer-title').textContent = enlarged.alt;
    viewer.showModal();
    document.querySelector('.viewer-content').scrollTo(0, 0);
  }));
  document.getElementById('close-view').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  const copy = document.getElementById('copy');
  const status = document.getElementById('copy-status');
  copy.addEventListener('click', async () => {
    const citation = document.getElementById('bib');
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(citation.textContent.trim());
    } catch {
      const range = document.createRange();
      range.selectNodeContents(citation);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      if (!document.execCommand('copy')) {
        status.textContent = 'Citation selected. Use your copy shortcut.';
        copy.textContent = 'Text selected';
        return;
      }
    }
    copy.textContent = 'Copied ✓';
    status.textContent = 'Citation copied.';
    window.setTimeout(() => { copy.textContent = 'Copy citation'; }, 1800);
  });
})();
