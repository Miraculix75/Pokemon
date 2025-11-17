export function setupTabFunctionality(container) {
  const tabButtons = container.querySelectorAll('.tab-btn');
  const tabContents = container.querySelectorAll('.tab-content');
  
  // Initial den Stats-Tab aktivieren
  if (tabContents.length > 0) {
    tabContents[0].classList.add('active');
    if (tabButtons.length > 0) {
      tabButtons[0].classList.add('active');
    }
  }
  
  // Event-Handler für Tab-Klicks
  tabButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); // Verhindert, dass der Klick die Karte schließt
      
      // Alle Tabs deaktivieren
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => {
        content.classList.remove('active');
        content.classList.add('hidden');
      });
      
      // Angeklickten Tab aktivieren
      button.classList.add('active');
      const tabName = button.getAttribute('data-tab');
      const activeContent = container.querySelector(`.tab-content.tab-${tabName}`);
      
      if (activeContent) {
        activeContent.classList.add('active');
        activeContent.classList.remove('hidden');
      }
    });
  });
}

function deactivateAllTabs(container) {
  const tabButtons = container.querySelectorAll('.tab-btn');
  const tabContents = container.querySelectorAll('.tab-content');
  tabButtons.forEach(btn => btn.classList.remove('active'));
  tabContents.forEach(content => {
    content.classList.remove('active');
    content.classList.add('hidden');
  });
}

function activateStatsTab(container) {
  const statsTabButton = container.querySelector('.tab-btn[data-tab="stats"]');
  const statsTabContent = container.querySelector('.tab-content.tab-stats');
  if (statsTabButton) statsTabButton.classList.add('active');
  if (statsTabContent) {
    statsTabContent.classList.add('active');
    statsTabContent.classList.remove('hidden');
  }
}

export function resetTabsToStats(container) {
  deactivateAllTabs(container);
  activateStatsTab(container);
}