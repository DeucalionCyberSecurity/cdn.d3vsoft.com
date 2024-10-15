// Взимаме базовия URL динамично от `scriptSrc`
const scriptSrc = document.currentScript.src;
const baseUrl = new URL(scriptSrc).origin;

// Извличане на параметъра 'p' от URL на скрипта
const urlParams = new URL(scriptSrc).searchParams;
const projectName = urlParams.get('p');

if (projectName) {
    // Използваме Promise.all за зареждане на import.json файловете за CSS и JS
    Promise.all([
        fetch(`${baseUrl}/${projectName}/js/import.json`).then(response => response.json()),
        fetch(`${baseUrl}/${projectName}/css/import.json`).then(response => response.json())
    ]).then(([jsFiles, cssFiles]) => {
        
        // Вграждане на CSS файловете, като добавяме <link> към <head>
        cssFiles.forEach(cssFile => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `${baseUrl}/${projectName}/css/${cssFile}`;
            document.head.appendChild(link);
        });

        // Вграждане на JS файловете, като добавяме <script> към <body>
        jsFiles.forEach(jsFile => {
            const script = document.createElement('script');
            script.src = `${baseUrl}/${projectName}/js/${jsFile}`;
            script.defer = true; // Използваме defer за по-бързо зареждане
            document.body.appendChild(script);
        });

    }).catch(error => {
        console.error('Грешка при зареждане на файловете:', error);
    });
} else {
    console.warn("Не е зададен проектен параметър 'p' в URL адреса на скрипта.");
}