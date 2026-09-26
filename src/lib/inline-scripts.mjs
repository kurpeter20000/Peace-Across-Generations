// Scripts that must run in <head> before first paint. They are inlined
// verbatim, and astro.config.mjs hashes them for the Content Security Policy.
// Keep them tiny.

// Low-data mode: read the saved choice, or follow the browser's Save-Data
// signal, and flag <html> before any image or embed starts to load.
export const lowDataInit = `(function(){var d=document.documentElement,v=null;d.classList.add('js');try{v=localStorage.getItem('pag-lowdata')}catch(e){}var s=navigator.connection&&navigator.connection.saveData;if(v==='on'||(v===null&&s)){d.setAttribute('data-lowdata','on')}})();`;
