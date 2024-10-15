class ExpozyElement extends HTMLElement {
    constructor() {
        super();

        // Взимаме базовия URL динамично от `scriptSrc`
        const scriptSrc = document.currentScript.src;
        const baseUrl = new URL(scriptSrc).origin;

        // Извличане на параметъра 'p' от URL на скрипта
        const urlParams = new URL(scriptSrc).searchParams;
        const projectName = urlParams.get('p');

        // Създаване на стил за бял фон
        const loadingStyle = document.createElement('style');
        loadingStyle.innerHTML = `
            body {
                visibility: hidden!important; /* Скрива съдържанието, докато не се заредят файловете */
            }
        `;
        document.head.appendChild(loadingStyle);

        if (projectName) {
            Promise.all([
                fetch(`${baseUrl}/${projectName}/js/import.json`).then(response => response.json()),
                fetch(`${baseUrl}/${projectName}/css/import.json`).then(response => response.json())
            ]).then(([jsFiles, cssFiles]) => {
                cssFiles.forEach(cssFile => {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = `${baseUrl}/${projectName}/css/${cssFile}`;
                    document.head.appendChild(link);
                });

                jsFiles.forEach(jsFile => {
                    const script = document.createElement('script');
                    script.src = `${baseUrl}/${projectName}/js/${jsFile}`;
                    script.defer = true;
                    document.body.appendChild(script);
                });

                // Премахване на временния стил след зареждане на файловете
                loadingStyle.remove();
                document.body.style.visibility = 'visible';
            }).catch(error => {
                console.error('Грешка при зареждане на файловете:', error);
                loadingStyle.remove();
                document.body.style.visibility = 'visible';
            });
        } else {
            console.warn("Не е зададен проектен параметър 'p' в URL адреса на скрипта.");
            loadingStyle.remove();
            document.body.style.visibility = 'visible';
        }
    }
}

// Регистриране на Web Component-а като expozy-element
customElements.define('expozy-element', ExpozyElement);
