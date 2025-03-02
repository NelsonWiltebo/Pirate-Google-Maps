import { add_road, empty_road_network, fastest_path, make_road, Path, Road, RoadNetwork } from '../backend/main.mjs'

window.onload = () => {
    setup_listeners();
};

const road_0_1: Road = make_road(0, 1, "0-1", 80, 60, 70);
const road_0_2: Road = make_road(0, 2, "0-2", 80, 30, 80);
const road_0_5: Road = make_road(0, 5, "0-5", 120, 150, 40);
const road_1_3: Road = make_road(1, 3, "1-3", 70, 20, 50);
const road_1_5: Road = make_road(1, 5, "1-5", 100, 120, 0);
const road_2_3: Road = make_road(2, 3, "2-3", 50, 10, 40);
const road_2_4: Road = make_road(2, 4, "2-4", 80, 50, 80);
const road_4_5: Road = make_road(4, 5, "4-5", 80, 45, 80);

const _roads0: RoadNetwork = empty_road_network();
add_road(_roads0, road_0_1);
add_road(_roads0, road_0_2);
add_road(_roads0, road_0_5);
add_road(_roads0, road_1_3);
add_road(_roads0, road_1_5);
add_road(_roads0, road_2_3);
add_road(_roads0, road_2_4);
add_road(_roads0, road_4_5);

let road_network: RoadNetwork = _roads0;

function color_path(path: Array<number>): void {
    const main: HTMLElement = document.getElementById("main")!;
    const embedElement: HTMLObjectElement = main.querySelector<HTMLObjectElement>('#map')!;

    const svgDoc: Document = embedElement.getSVGDocument() as Document;
    const svg: SVGSVGElement | null = svgDoc !== null
        ? svgDoc.querySelector('svg')
        : null;
    
    const all_roads: NodeListOf<HTMLElement> | null | undefined = svg !== null 
        ? svg.querySelectorAll('.road') 
        : null;

    for(let i = 1; i < path.length; i++) {
        all_roads?.forEach(x => {
            if(x.dataset.from && x.dataset.to) {
                if((parseInt(x.dataset.from) === path[i - 1] || 
                        parseInt(x.dataset.from) === path[i]) && 
                        (parseInt(x.dataset.to) === path[i - 1] || 
                        parseInt(x.dataset.to) === path[i])) {
                    x.setAttribute('stroke', "lime");
                }
            }
        });
    }
}

function setup_listeners(): void {
    const starting_point_input: HTMLElement = document.getElementById('starting_point_input')!;
    const destination_input: HTMLElement = document.getElementById('destination_input')!;

    let starting_point: number | null = null;
    let destination_point: number | null = null;
    
    function updatePath() {
        if (starting_point !== null && destination_point !== null) {
            const directions: Path = fastest_path(road_network, starting_point, destination_point);
            color_path(directions.path);
        }
    }
    
    starting_point_input.addEventListener('input', (e: Event) => {
        const target: HTMLInputElement = e.target as HTMLInputElement;
        starting_point = parseInt(target.value);
        updatePath();
    });
    destination_input.addEventListener('input', (e: Event) => {
        const target: HTMLInputElement = e.target as HTMLInputElement;
        destination_point = parseInt(target.value);
        updatePath();
    });
}