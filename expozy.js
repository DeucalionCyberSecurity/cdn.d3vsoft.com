class Expozy extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'closed' });

        // Проверява URL за параметъра ?p=име_на_проект
        const urlParams = new URLSearchParams(window.location.search);
        const projectName = urlParams.get('p');

        if (projectName) {
            // Зарежда js.json и css.json от съответната папка
            Promise.all([
                fetch(`${projectName}/js.json`).then(response => response.json()),
                fetch(`${projectName}/css.json`).then(response => response.json())
            ]).then(([jsFiles, cssFiles]) => {
                const wrapper = document.createElement('div');

                // Вгражда CSS файловете от css.json
                cssFiles.forEach(cssFile => {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = cssFile;
                    wrapper.appendChild(link);
                });

                // Вгражда JS файловете от js.json
                jsFiles.forEach(jsFile => {
                    const script = document.createElement('script');
                    script.src = jsFile;
                    script.defer = true;
                    wrapper.appendChild(script);
                });

                shadow.appendChild(wrapper);
            }).catch(error => {
                console.error('Грешка при зареждане на JSON файловете:', error);
            });
        } else {
            console.warn("Не е зададен проектен параметър 'p' в URL адреса.");
        }
    }
}

// Регистриране на Web Component-а като expozy
customElements.define('expozy', Expozy);
