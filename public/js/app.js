(() => {
  const strings = window.AnafuxaStrings;
  const settingsStore = window.AnafuxaSettings;
  const lastProjectStore = window.AnafuxaLastProject;

  const state = {
    currentFile: null,
    jsonText: '',
    jsonData: null,
    jsonParseError: null,
    appliedReferenceSearch: '',
    referenceMatchCount: 0,
    settings: loadSettings(),
  };

  const navButtons = Array.from(document.querySelectorAll('.nav-button'));
  const views = Array.from(document.querySelectorAll('.view'));
  const fileInput = document.getElementById('project-file');
  const topbarFileMeta = document.getElementById('topbar-file-meta');
  const languageSelect = document.getElementById('language-select');
  const readmeInput = document.getElementById('readme-input');
  const toonOutput = document.getElementById('toon-output');
  const referenceSearchInput = document.getElementById('reference-search');
  const applyReferenceSearchButton = document.getElementById('ApplyReferenceSearchText');
  const referenceSearchCurrent = document.getElementById('reference-search-current');
  const referenceStatus = document.getElementById('reference-status');
  const referenceTree = document.getElementById('reference-tree');
  const disabledButtons = Array.from(document.querySelectorAll('button[disabled]'));

  function loadSettings() {
    const loadedSettings = settingsStore.load();
    if (!strings.isSupportedLanguage(loadedSettings.language)) {
      return {
        ...settingsStore.defaultSettings,
        language: settingsStore.defaultSettings.language,
      };
    }

    return loadedSettings;
  }

  function applyTranslations() {
    Object.entries(strings.textBindings).forEach(([elementId, translationKey]) => {
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = strings.translate(translationKey, state.settings.language);
      }
    });

    if (languageSelect) {
      languageSelect.value = state.settings.language;
    }

    document.documentElement.lang = state.settings.language;

    if (readmeInput) {
      readmeInput.placeholder = strings.translate('ReadmePlaceholderText', state.settings.language);
    }

    if (toonOutput) {
      toonOutput.placeholder = strings.translate('ToonOutputPlaceholderText', state.settings.language);
    }

    if (referenceSearchInput) {
      referenceSearchInput.placeholder = strings.translate('ReferenceSearchPlaceholderText', state.settings.language);
    }

    disabledButtons.forEach((button) => {
      button.title = strings.translate('NotImplementedTitleText', state.settings.language );
    });

    renderTopbarFileMeta();
    renderReferenceStatus();
    renderReferenceSearchCurrent();
    renderReferenceTree();
  }

  function saveCurrentProject() {
    if (!state.currentFile || !state.jsonText) {
      lastProjectStore.update(null);
      return;
    }

    lastProjectStore.update({
      name: state.currentFile.name,
      size: state.currentFile.size,
      type: state.currentFile.type || 'application/json',
      text: state.jsonText,
    });
  }

  function setLoadedProject(fileLike, text) {
    state.currentFile = fileLike;
    state.jsonText = text;
    state.jsonData = null;
    state.jsonParseError = null;

    if (!fileLike) {
      saveCurrentProject();
      renderTopbarFileMeta();
      renderReferenceStatus();
      renderReferenceSearchCurrent();
      renderReferenceTree();
      return;
    }

    try {
      state.jsonData = JSON.parse(text);
    } catch (error) {
      state.jsonParseError = error instanceof Error ? error.message : String(error);
    }

    saveCurrentProject();
    renderTopbarFileMeta();
    renderReferenceStatus();
    renderReferenceTree();
    renderReferenceSearchCurrent();
  }

  function renderTopbarFileMeta() {
    if (!topbarFileMeta) {
      return;
    }

    if (!state.currentFile) {
      topbarFileMeta.textContent = 'No file loaded';
      topbarFileMeta.classList.add('topbar-file-meta--warning');
      return;
    }

    if (state.jsonParseError) {
      topbarFileMeta.textContent = `Invalid JSON: ${state.currentFile.name}`;
      topbarFileMeta.classList.add('topbar-file-meta--warning');
      return;
    }

    const file = state.currentFile;
    const sizeKb = (file.size / 1024).toFixed(2);
    topbarFileMeta.textContent = `${file.name} | ${sizeKb} KB`;
    topbarFileMeta.classList.remove('topbar-file-meta--warning');
  }

  function renderReferenceStatus() {
    if (!referenceStatus) {
      return;
    }

    const language = state.settings.language;
    const referenceStrings = strings.referenceStatusTranslations;

    if (!state.currentFile) {
      referenceStatus.innerHTML = `
        <strong>${referenceStrings.noFileTitle[language]}</strong>
        <div class="status-details">${referenceStrings.noFileBody[language]}</div>
      `;
      return;
    }

    if (state.jsonParseError) {
      let errStr = String(state.jsonParseError)
      errStr = errStr.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
      referenceStatus.innerHTML = `
        <strong>${referenceStrings.invalidTitle[language]}</strong>
        <div class="status-details">${referenceStrings.invalidBody[language]}</div>
        <div class="status-details">${errStr}</div>
      `;
      return;
    }

    referenceStatus.innerHTML = `
      <strong>${referenceStrings.readyTitle[language]}</strong>
      <div class="status-details">${referenceStrings.readyBody[language]}</div>
    `;
  }

  function renderReferenceSearchCurrent() {
    if (!referenceSearchCurrent) {
      return;
    }

    const currentSearch = state.appliedReferenceSearch.trim();
    referenceSearchCurrent.textContent = currentSearch
      ? `Applied search: ${currentSearch} (Found: ${state.referenceMatchCount})`
      : 'Applied search: (none)';
    referenceSearchCurrent.classList.toggle('reference-search-current--active', Boolean(currentSearch));
  }

  function renderReferenceTree() {
    if (!referenceTree) {
      return;
    }

    referenceTree.innerHTML = '';
    state.referenceMatchCount = 0;

    if (!state.currentFile || state.jsonParseError || state.jsonData === null) {
      return;
    }

    const searchText = state.appliedReferenceSearch.trim().toLowerCase();
    const treeRoot = buildJsonNode(state.jsonData, {
      key: null,
      depth: 0,
      path: '$',
      searchText,
      isTopLevel: true,
    });

    referenceTree.appendChild(treeRoot.element);
  }

  function buildJsonNode(value, context) {
    const { key, depth, path, searchText, isTopLevel } = context;
    const nodeType = getValueType(value);
    const nodeElement = document.createElement('div');
    nodeElement.className = 'json-node';

    const header = document.createElement('div');
    header.className = 'json-node__header';

    const line = document.createElement('div');
    line.className = 'json-node__line';

    const childrenContainer = document.createElement('div');
    childrenContainer.className = 'json-node__children';

    let nodeMatches = false;
    let subtreeMatches = false;

    if (nodeType === 'object' || nodeType === 'array') {
      const toggleButton = document.createElement('button');
      toggleButton.type = 'button';
      toggleButton.className = 'json-toggle';

      const childEntries = nodeType === 'object'
        ? Object.entries(value).map(([childKey, childValue]) => ({ childKey, childValue, childPath: `${path}.${childKey}` }))
        : value.map((childValue, index) => ({ childKey: index, childValue, childPath: `${path}[${index}]` }));

      const childResults = childEntries.map(({ childKey, childValue, childPath }) => {
        return buildJsonNode(childValue, {
          key: childKey,
          depth: depth + 1,
          path: childPath,
          searchText,
          isTopLevel: false,
        });
      });

      childResults.forEach((childResult) => {
        if (childResult.subtreeMatches) {
          subtreeMatches = true;
        }
        childrenContainer.appendChild(childResult.element);
      });

      nodeMatches = matchesSearch(key, value, nodeType, searchText);
      subtreeMatches = subtreeMatches || nodeMatches;

      if (subtreeMatches && searchText) {
        nodeElement.classList.add('json-node--subtree-match');
      }

      if (nodeMatches && searchText) {
        line.classList.add('json-line--match');
        state.referenceMatchCount += 1;
      }

      const expandedInitially = shouldStartExpanded(value, depth, isTopLevel) || (Boolean(searchText) && subtreeMatches);
      toggleButton.textContent = expandedInitially ? '−' : '+';
      childrenContainer.hidden = !expandedInitially;

      toggleButton.addEventListener('click', () => {
        const isHidden = childrenContainer.hidden;
        childrenContainer.hidden = !isHidden;
        toggleButton.textContent = isHidden ? '−' : '+';
      });

      line.appendChild(toggleButton);
      appendKeyLabel(line, key, value);
      appendTypeSummary(line, nodeType, childEntries.length);
      header.appendChild(line);
      nodeElement.appendChild(header);
      nodeElement.appendChild(childrenContainer);

      return {
        element: nodeElement,
        subtreeMatches,
      };
    }

    const spacer = document.createElement('span');
    spacer.className = 'json-toggle json-toggle--spacer';
    spacer.textContent = ' ';
    line.appendChild(spacer);

    nodeMatches = matchesSearch(key, value, nodeType, searchText);
    subtreeMatches = nodeMatches;

    if (nodeMatches && searchText) {
      line.classList.add('json-line--match');
      nodeElement.classList.add('json-node--subtree-match');
      state.referenceMatchCount += 1;
    }

    appendKeyLabel(line, key, value);
    appendPrimitiveValue(line, value, nodeType);
    header.appendChild(line);
    nodeElement.appendChild(header);

    return {
      element: nodeElement,
      subtreeMatches,
    };
  }

  function shouldStartExpanded(value, depth, isTopLevel) {
    if (!isTopLevel) {
      return false;
    }

    if (getValueType(value) !== 'object') {
      return false;
    }

    const topLevelValues = Object.values(value);
    return topLevelValues.some((entry) => typeof entry === 'string');
  }

  function matchesSearch(key, value, nodeType, searchText) {
    if (!searchText) {
      return false;
    }

    const normalizedSearch = searchText.toLowerCase();
    const keyText = key === null || key === undefined ? '' : String(key).toLowerCase();
    if (keyText.includes(normalizedSearch)) {
      return true;
    }

    if (nodeType === 'object' || nodeType === 'array') {
      return false;
    }

    const valueText = value === null ? 'null' : String(value).toLowerCase();
    return valueText.includes(normalizedSearch);
  }

  function appendKeyLabel(line, key, value) {
    if (key === null || key === undefined) {
      const rootLabel = document.createElement('span');
      rootLabel.className = 'json-key';
      rootLabel.textContent = '$';
      line.appendChild(rootLabel);
      return;
    }

    const keyLabel = document.createElement('span');
    keyLabel.className = 'json-key';
    keyLabel.textContent = `${String(key)}`;
    line.appendChild(keyLabel);

    const nameHint = getObjectNameHint(value);
    if (nameHint) {
      const nameHintLabel = document.createElement('span');
      nameHintLabel.className = 'json-name-hint';
      nameHintLabel.textContent = ` <${nameHint}>`;
      line.appendChild(nameHintLabel);
    }

    const separator = document.createElement('span');
    separator.textContent = ': ';
    line.appendChild(separator);
  }

  function getObjectNameHint(value) {
    if (!value || Array.isArray(value) || typeof value !== 'object') {
      return '';
    }

    if (!Object.prototype.hasOwnProperty.call(value, 'name')) {
      return '';
    }

    return typeof value.name === 'string' ? value.name : '';
  }

  function appendTypeSummary(line, nodeType, count) {
    const valueLabel = document.createElement('span');
    valueLabel.className = 'json-type';

    const lp = nodeType === 'object' ? '{' : '[';
    const rp = nodeType === 'object' ? '}' : ']';
    valueLabel.textContent = lp + `${count} ${count === 1 ? 'item' : 'items'}` + rp;

    line.appendChild(valueLabel);
  }

  function appendPrimitiveValue(line, value, nodeType) {
    if (nodeType === 'string') {
      appendStringValue(line, value);
      return;
    }

    const valueLabel = document.createElement('span');
    valueLabel.className = `json-value json-value--${nodeType}`;

    if (nodeType === 'null') {
      valueLabel.textContent = 'null';
    } else {
      valueLabel.textContent = String(value);
    }

    line.appendChild(valueLabel);
  }

  function appendStringValue(line, value) {
    const newlineCount = (value.match(/\n/g) || []).length;
    const isLongMultiline = newlineCount > 4;

    const valueLabel = document.createElement('span');
    valueLabel.className = 'json-value json-value--string';

    if (!isLongMultiline) {
      valueLabel.textContent = `"${value}"`;
      line.appendChild(valueLabel);
      return;
    }

    let isExpanded = false;
    valueLabel.textContent = `"${truncateStringByNewlines(value, 4)}"`;
    line.appendChild(valueLabel);

    const toggleButton = document.createElement('button');
    toggleButton.type = 'button';
    toggleButton.className = 'json-inline-toggle';
    toggleButton.textContent = '...';
    toggleButton.addEventListener('click', () => {
      isExpanded = !isExpanded;
      valueLabel.textContent = isExpanded ? `"${value}"`
        : `"${truncateStringByNewlines(value, 4)}"`;
      toggleButton.textContent = isExpanded ? '<<<' : '...';
    });

    line.appendChild(toggleButton);
  }

  function truncateStringByNewlines(value, maxNewlines) {
    let newlineSeen = 0;
    let cutIndex = value.length;

    for (let index = 0; index < value.length; index += 1) {
      if (value[index] !== '\n') continue
      if (++newlineSeen <= maxNewlines) continue
      cutIndex = index;
      break;
    }

    return cutIndex < value.length ? value.slice(0, cutIndex) : value;
  }

  function getValueType(value) {
    if (Array.isArray(value)) return 'array';
    if (value === null) return 'null';
    return typeof value;
  }

  function setActiveView(viewName) {
    navButtons.forEach((button) => {
      const isActive = button.dataset.view === viewName;
      button.classList.toggle('is-active', isActive);
    });

    views.forEach((view) => {
      const isActive = view.id === `view-${viewName}`;
      view.classList.toggle('is-active', isActive);
      view.hidden = !isActive;
    });
  }

  navButtons.forEach((button) => {
    button.addEventListener('click', () => setActiveView(button.dataset.view));
  });

  if (languageSelect) {
    languageSelect.addEventListener('change', (event) => {
      const nextLanguage = event.target.value;
      if (!strings.isSupportedLanguage(nextLanguage)) {
        return;
      }

      state.settings = settingsStore.update(state.settings, 'language', nextLanguage);
      applyTranslations();
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', async (event) => {
      const [file] = event.target.files || [];

      if (!file) {
        setLoadedProject(null, '');
        return;
      }

      try {
        const text = await file.text();
        setLoadedProject(file, text);
      } catch (error) {
        const fallbackText = '';
        state.currentFile = file;
        state.jsonText = fallbackText;
        state.jsonData = null;
        state.jsonParseError = error instanceof Error ? error.message : String(error);
        saveCurrentProject();
        renderTopbarFileMeta();
        renderReferenceStatus();
        renderReferenceSearchCurrent();
        renderReferenceTree();
      }
    });
  }

  function applyReferenceSearch() {
    state.appliedReferenceSearch = referenceSearchInput ? referenceSearchInput.value : '';
    renderReferenceTree();
    renderReferenceSearchCurrent();
  }

  if (referenceSearchInput) {
    referenceSearchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        applyReferenceSearch();
      }
    });
  }

  if (applyReferenceSearchButton) {
    applyReferenceSearchButton.addEventListener('click', () => {
      applyReferenceSearch();
    });
  }

  function initialize() {
    const lastProject = lastProjectStore.load();
    if (lastProject) {
      const restoredFile = {
        name: lastProject.name,
        size: lastProject.size,
        type: lastProject.type,
      };
      setLoadedProject(restoredFile, lastProject.text);
    }

    if (languageSelect) {
      languageSelect.value = state.settings.language;
    }

    applyTranslations();
  }

  initialize();
})();
