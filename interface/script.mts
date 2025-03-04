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

function findNearbyPaths(referencePath: SVGPathElement, check_end: boolean = false, threshold: number = 10): Array<SVGPathElement> {
    const allPaths: NodeListOf<SVGPathElement> | undefined = get_svg()?.querySelectorAll("path");
    const refPoints: {start: DOMPoint, end: DOMPoint} = getPathPoints(referencePath);
    let nearbyPaths: Array<SVGPathElement> = [];

    allPaths?.forEach((path: SVGPathElement) => {
        const points: {start: DOMPoint, end: DOMPoint} = getPathPoints(path);

        // Check if any start or end point is within the threshold distance
        if (
            !check_end && getDistance(refPoints.start.x, refPoints.start.y, points.start.x, points.start.y) < threshold ||
            getDistance(refPoints.start.x, refPoints.start.y, points.end.x, points.end.y) < threshold
        ) {
            nearbyPaths.push(path);
        } else if(
            check_end && getDistance(refPoints.end.x, refPoints.end.y, points.start.x, points.start.y) < threshold ||
            getDistance(refPoints.end.x, refPoints.end.y, points.end.x, points.end.y) < threshold
        ) {
            nearbyPaths.push(path);
        } else { }
    });

    return nearbyPaths;
}

function make_road_type_path(path: SVGPathElement, from: number, to: number): void {
    path.classList.add("road");
    path.dataset.from = String(from);
    path.dataset.to = String(to);
}

function is_road_type_path(path: SVGPathElement): boolean {
    return path.classList.contains("road");
}

function make_road_network_from_svg_paths(): void {
    let pending: Queue<SVGPathElement> = empty();
    let order: Queue<SVGPathElement> = empty();
    const all_paths: NodeListOf<SVGPathElement> | undefined = get_svg()?.querySelectorAll('path');
    if(all_paths === undefined) {
        return;
    }

    let from_node = 0;
    let to_node = 1;

    let first_path: SVGPathElement = all_paths[0];
    
    function visit_path(path: SVGPathElement, from: number, to: number) {
        path.dataset.to = String(to);
        const all_nearyby_paths: Array<SVGPathElement> = findNearbyPaths(path, true);
        const undiscovered_nearby_paths: Array<SVGPathElement> = all_nearyby_paths.filter(path => !is_road_type_path(path));
        undiscovered_nearby_paths.forEach(adjacent_path => {
            adjacent_path.classList.add("road");
            adjacent_path.dataset.from = String(from);
            enqueue(adjacent_path, pending);
        });
    }

    findNearbyPaths(first_path, false).forEach(path => {
        enqueue(path, pending);
        path.dataset.from = String(from_node);
    });

    //visit_path(first_path, from_node);
    while(!is_empty(pending)) {
        const path = qhead(pending);
        dequeue(pending);
        visit_path(path, from_node, to_node);
    }

    console.log(order);

    //visit_path(all_paths[0], from_node, to_node);

    // let node_index: number = 0;
    // all_paths?.forEach(path => {
    //     const all_nearyby_paths: Array<SVGPathElement> = findNearbyPaths(path);
    //     const undiscovered_nearby_paths = all_nearyby_paths.filter(path => !path.classList.contains("road"));
    //     console.log(node_index, undiscovered_nearby_paths);

    //     let nearyby_nodes_index: number = node_index + 1;
    //     undiscovered_nearby_paths.forEach(nearyby_path => {
    //         make_road_type_path(nearyby_path, node_index, nearyby_nodes_index);
    //         nearyby_nodes_index++;
    //     })
    //     node_index++;
    // });
}

function setup(): void {
    make_road_network_from_svg_paths();

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