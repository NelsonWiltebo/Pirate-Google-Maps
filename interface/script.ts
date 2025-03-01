const main: HTMLElement = document.getElementById("main")!;

const path: Array<number> = [0, 1, 5];

function color_path(path: Array<number>): void {
    const embedElement = main.querySelector<HTMLObjectElement>('#map')!;

    // Ensure the embed is loaded before accessing its content
    embedElement.addEventListener("load", () => {
        
        const svgDoc = embedElement.getSVGDocument();
        const svg = svgDoc !== null
            ? svgDoc.querySelector('svg')
            : null;
        
        const all_roads: NodeListOf<HTMLElement> | null | undefined = svg !== null 
            ? svg.querySelectorAll('.road') 
            : null;

        for(let i = 1; i < path.length; i++) {
            all_roads?.forEach(x => {
                if(x.dataset.from && x.dataset.to) {
                    if((parseInt(x.dataset.from) === path[i - 1] || parseInt(x.dataset.from) === path[i]) 
                        && (parseInt(x.dataset.to) === path[i - 1] || parseInt(x.dataset.to) === path[i])) {
                        x.setAttribute('stroke', "lime");
                    }
                }
            });
        }
    });
}

color_path(path);