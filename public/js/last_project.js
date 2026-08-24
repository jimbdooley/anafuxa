window.AnafuxaLastProject = (() => {
  const LAST_PROJECT_STORAGE_KEY = 'anafuxa.lastProject';

  function load() {
    try {
      const raw = window.localStorage.getItem(LAST_PROJECT_STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') {
        return null;
      }

      if (typeof parsed.name !== 'string' || typeof parsed.text !== 'string') {
        return null;
      }

      return {
        name: parsed.name,
        size: typeof parsed.size === 'number' ? parsed.size : parsed.text.length,
        type: typeof parsed.type === 'string' ? parsed.type : 'application/json',
        text: parsed.text,
      };
    } catch (error) {
      console.warn('Failed to load last project from localStorage.', error);
      return null;
    }
  }

  function update(project) {
    try {
      if (!project || typeof project.name !== 'string' || typeof project.text !== 'string') {
        window.localStorage.removeItem(LAST_PROJECT_STORAGE_KEY);
        return null;
      }

      const payload = {
        name: project.name,
        size: typeof project.size === 'number' ? project.size : project.text.length,
        type: typeof project.type === 'string' ? project.type : 'application/json',
        text: project.text,
      };

      window.localStorage.setItem(LAST_PROJECT_STORAGE_KEY, JSON.stringify(payload));
      return payload;
    } catch (error) {
      console.warn('Failed to save last project to localStorage.', error);
      return null;
    }
  }

  return {
    load,
    update,
  };
})();
