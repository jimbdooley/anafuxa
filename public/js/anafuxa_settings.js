window.AnafuxaSettings = (() => {
  const SETTINGS_STORAGE_KEY = 'anafuxa.settings';
  const defaultSettings = {
    language: 'en',
  };

  function load() {
    try {
      const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!raw) {
        return { ...defaultSettings };
      }

      const parsed = JSON.parse(raw);
      return {
        ...defaultSettings,
        ...parsed,
      };
    } catch (error) {
      console.warn('Failed to load settings from localStorage.', error);
      return { ...defaultSettings };
    }
  }

  function save(settings) {
    try {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save settings to localStorage.', error);
    }
  }

  function update(currentSettings, key, value) {
    const nextSettings = {
      ...currentSettings,
      [key]: value,
    };

    save(nextSettings);
    return nextSettings;
  }

  return {
    load,
    save,
    update,
    defaultSettings,
  };
})();
