(function () {
  'use strict';

  const sources = [
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.112.0/dist/umd/supabase.js',
    'https://unpkg.com/@supabase/supabase-js@2.112.0/dist/umd/supabase.js'
  ];
  const LOAD_TIMEOUT_MS = 6000;
  const runtimeConfig = window.SCHOOL_WEBSITE_RUNTIME_CONFIG;

  if (!runtimeConfig || runtimeConfig.configured !== true) {
    window.SCHOOL_WEBSITE_DEPENDENCIES_READY = Promise.resolve(false);
    return;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      let settled = false;
      const finish = (error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);
        script.onload = null;
        script.onerror = null;
        if (error) {
          script.remove();
          reject(error);
        } else {
          resolve(script);
        }
      };
      const timeoutId = setTimeout(() => finish(new Error('Dependency source timed out')), LOAD_TIMEOUT_MS);
      script.src = src;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.referrerPolicy = 'no-referrer';
      script.onload = () => finish(null);
      script.onerror = () => finish(new Error('Dependency source unavailable'));
      document.head.appendChild(script);
    });
  }

  window.SCHOOL_WEBSITE_DEPENDENCIES_READY = (async () => {
    if (window.supabase && typeof window.supabase.createClient === 'function') return true;
    for (const src of sources) {
      try {
        const loadedScript = await loadScript(src);
        if (window.supabase && typeof window.supabase.createClient === 'function') return true;
        loadedScript.remove();
      } catch (error) {
        // Try the next exact-version source.
      }
    }
    return false;
  })();
})();
