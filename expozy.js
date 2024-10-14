class ExpozyElement extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });

        // Взимаме базовия URL динамично от `scriptSrc`
        const scriptSrc = document.currentScript.src;
        const baseUrl = new URL(scriptSrc).origin;

        // Извличане на параметъра 'p' от URL на скрипта
        const urlParams = new URL(scriptSrc).searchParams;
        const projectName = urlParams.get('p');

        if (projectName) {
            // Зарежда js.json и css.json от съответната папка
            Promise.all([
                fetch(`${baseUrl}/${projectName}/js/import.json`).then(response => response.json()),
                fetch(`${baseUrl}/${projectName}/css/import.json`).then(response => response.json())
            ]).then(([jsFiles, cssFiles]) => {
                const wrapper = document.createElement('div');

                // Вгражда CSS файловете от css.json
                const cssPromises = cssFiles.map(cssFile => {
                    return new Promise((resolve, reject) => {
                        const link = document.createElement('link');
                        link.rel = 'stylesheet';
                        link.href = `${baseUrl}/${projectName}/css/${cssFile}`;
                        link.onload = resolve;
                        link.onerror = reject;
                        shadow.appendChild(link);
                    });
                });

                // Вгражда JS файловете от js.json
                const jsPromises = jsFiles.map(jsFile => {
                    return new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = `${baseUrl}/${projectName}/js/${jsFile}`;
                        script.defer = true;
                        script.onload = resolve;
                        script.onerror = reject;
                        shadow.appendChild(script);
                    });
                });

                // Изчакване на CSS и JS да се заредят
                return Promise.all([...cssPromises, ...jsPromises]);
            }).then(() => {
                // Всичко е заредено успешно
                console.log('Всички стилове и скриптове са заредени.');
            }).catch(error => {
                console.error('Грешка при зареждане на файловете:', error);
            });
        } else {
            console.warn("Не е зададен проектен параметър 'p' в URL адреса на скрипта.");
        }
    }
}

// Регистриране на Web Component-а като expozy-element
customElements.define('expozy-element', ExpozyElement);
