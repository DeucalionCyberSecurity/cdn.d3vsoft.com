class ExpozyElement extends HTMLElement {
    constructor() {
        super();

        // Взимаме базовия URL динамично от `scriptSrc`
        const scriptSrc = document.currentScript.src;
        const baseUrl = new URL(scriptSrc).origin;

        // Извличане на параметъра 'p' от URL на скрипта
        const urlParams = new URL(scriptSrc).searchParams;
        const projectName = urlParams.get('p');

        if (projectName) {
            Promise.all([
                fetch(`${baseUrl}/${projectName}/js/import.json`).then(response => response.json()),
                fetch(`${baseUrl}/${projectName}/css/import.json`).then(response => response.json())
            ]).then(([jsFiles, cssFiles]) => {
                cssFiles.forEach(cssFile => {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = `${baseUrl}/${projectName}/css/${cssFile}`;
                    document.head.appendChild(link); // Добавяме в <head>, за да влияе на глобалните стилове
                });

                jsFiles.forEach(jsFile => {
                    const script = document.createElement('script');
                    script.src = `${baseUrl}/${projectName}/js/${jsFile}`;
                    script.defer = true;
                    document.body.appendChild(script); // Добавяме скриптовете в <body>
                });
            }).catch(error => {
                // console.error('Грешка при зареждане на файловете:', error);
            });
        } else {
            // console.warn("Не е зададен проектен параметър 'p' в URL адреса на скрипта.");
        }
    }
}

// Регистриране на Web Component-а като expozy-element
customElements.define('expozy-element', ExpozyElement);
