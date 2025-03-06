import { head, pair, Pair, tail } from '../backend/lib/list.mjs';
import { empty, enqueue, Queue, head as qhead, dequeue, is_empty, display_queue } from '../backend/lib/queue_array.mjs';
import { add_road, empty_road_network, fastest_path, make_road, Path, Road, RoadNetwork } from '../backend/main.mjs'

window.onload = () => {
    setup();
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

function get_svg(): SVGSVGElement | null {
    const main: HTMLElement = document.getElementById("main")!;
    const embedElement: HTMLObjectElement = main.querySelector<HTMLObjectElement>('#map')!;

    const svgDoc: Document = embedElement.getSVGDocument() as Document;
    const svg: SVGSVGElement | null = svgDoc !== null
        ? svgDoc.querySelector('svg')
        : null;

    return svg;
}

function color_path(path: Array<number>): void {
    const all_roads: NodeListOf<HTMLElement> | undefined = get_svg()?.querySelectorAll('.road');

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

function getPathPoints(path: SVGPathElement): {start: DOMPoint, end: DOMPoint} {
    const totalLength: number = path.getTotalLength();
    return {
        start: path.getPointAtLength(0),
        end: path.getPointAtLength(totalLength)
    };
}

function getDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

let is_selecting_starting_point: boolean = false;
let is_selecting_destination_point: boolean = false;

type Point = {x: number, y: number};

let starting_point: Point | undefined = undefined;
let destination_point: Point | undefined = undefined;

function get_closes_node_from_point(point: Point): SVGCircleElement | undefined {
    const mapBBox: DOMRect = document!.getElementById('map')!.getBoundingClientRect();

    let closest_node: SVGCircleElement | undefined = undefined;
    let shortest_distance: number = Infinity;
    const all_nodes: NodeListOf<SVGCircleElement> | undefined = get_svg()?.querySelectorAll('.node');
    if(all_nodes) {
        all_nodes.forEach(node => {
            const nodeBBox = node.getBBox();
            const node_point: Point = {
                x: nodeBBox.x + mapBBox.x,
                y: nodeBBox.y + mapBBox.y
            };
            const node_distance: number = getDistance(point.x, point.y, node_point.x, node_point.y)
            if(node_distance < shortest_distance) {
                closest_node = node;
                shortest_distance = node_distance;
            }
        });
    }
    //console.log(closest_node!.getBBox())
    return closest_node;
}

function setup(): void {
    const map_area: HTMLElement = document.getElementById("map_area")!;
    
    const starting_point_button: HTMLElement = document.getElementById('starting_point_button')!;
    const destination_point_button: HTMLElement = document.getElementById('destination_point_button')!;
    
    const starting_point_input: HTMLElement = document.getElementById('starting_point_input')!;
    const destination_input: HTMLElement = document.getElementById('destination_input')!;

    let starting_node: number | undefined = undefined;
    let destination_node: number | undefined = undefined;
    
    function updatePath() {
        if (starting_node !== undefined && destination_node !== undefined) {
            const directions: Path = fastest_path(road_network, starting_node, destination_node);
            color_path(directions.path);
            console.log(starting_node, destination_node);
            console.log(directions.path);
        }
    }

    starting_point_button.addEventListener('click', () => {
        is_selecting_destination_point = false;
        is_selecting_starting_point = !is_selecting_starting_point;
    });
    destination_point_button.addEventListener('click', () => {
        is_selecting_starting_point = false;
        is_selecting_destination_point = !is_selecting_destination_point;
    });
    
    map_area.addEventListener('click', (e: MouseEvent) => {
        if(is_selecting_starting_point) {
            starting_point = {x: e.x, y: e.y};
            const closest_node: SVGCircleElement = get_closes_node_from_point(starting_point)!;
            starting_node = parseInt(closest_node.id);
            is_selecting_destination_point = false;
            updatePath();
        } else if(is_selecting_destination_point) {
            destination_point = {x: e.x, y: e.y};
            const closest_node: SVGCircleElement = get_closes_node_from_point(destination_point)!;
            destination_node = parseInt(closest_node.id);
            is_selecting_destination_point = false;
            updatePath();
        } else { }
    });
    
    // starting_point_input.addEventListener('input', (e: Event) => {
    //     const target: HTMLInputElement = e.target as HTMLInputElement;
    //     starting_node = parseInt(target.value);
    //     updatePath();
    // });
    // destination_input.addEventListener('input', (e: Event) => {
    //     const target: HTMLInputElement = e.target as HTMLInputElement;
    //     starting_node = parseInt(target.value);
    //     updatePath();
    // });
}