import {
    make_road, road_name, road_speed_limit, road_going_from, road_going_to,
    is_one_way, base_travel_time, current_travel_time, empty_road_network,
    make_intersection, add_intersection, add_road, fastest_path, Road,
    Intersection, RoadNetwork
} from "./main.js";

// Jest setup

describe("Road Network Functions", () => {
    test("Create valid roads", () => {
        const road: Road = make_road(1, 2, "Highway", 80, 10, 60, true);
        expect(road.name).toBe("Highway");
        expect(road.speed_limit).toBe(80);
        expect(road.travel_time).toBe(10);
        expect(road.average_speed).toBe(60);
        expect(road.one_way).toBe(true);
    });

    test("Retrieve road properties", () => {
        const road = make_road(2, 3, "Main Street", 50, 15, 40, false);
        expect(road_name(road)).toBe("Main Street");
        expect(road_speed_limit(road)).toBe(50);
        expect(road_going_from(road)).toBe(2);
        expect(road_going_to(road)).toBe(3);
        expect(is_one_way(road)).toBe(false);
    });

    test("Calculate travel times", () => {
        const road = make_road(1, 2, "Slow Road", 30, 20, 15, false);
        expect(base_travel_time(road)).toBe(20);
        expect(current_travel_time(road)).toBeGreaterThan(20);
    });

    test("Create an empty road network", () => {
        const network: RoadNetwork = empty_road_network();
        expect(network.size).toBe(0);
        expect(network.intersections.length).toBe(0);
        expect(network.adj.length).toBe(0);
    });

    test("Add valid intersections", () => {
        const network = empty_road_network();
        add_intersection(network, make_intersection(1, 10, 20));
        expect(network.size).toBe(1);
        expect(network.intersections[1].id).toBe(1);
    });

    test("Add valid roads", () => {
        const network = empty_road_network();
        add_intersection(network, make_intersection(1, 10, 10));
        add_intersection(network, make_intersection(2, 20, 20));
        add_road(network, make_road(1, 2, "Connector", 60, 10, 50, false));
        expect(network.edges[1][2]).toBeDefined();
    });

    test("Reject roads with missing intersections", () => {
        const network = empty_road_network();
        console.log = jest.fn(); // Suppress console output
        add_road(network, make_road(1, 2, "Missing Road", 60, 10, 50));
        expect(console.log).toHaveBeenCalledWith("The intersections the road is either going from or to doesn't exist");
    });

    test("Reject duplicate intersection ID", () => {
        const network = empty_road_network();
        add_intersection(network, make_intersection(1, 10, 10));
        console.log = jest.fn(); // Mock console.log
        add_intersection(network, make_intersection(1, 15, 15));
        expect(console.log).toHaveBeenCalledWith("Intersection ID already exists");
    });

    test("Find the fastest path", () => {
        const network = empty_road_network();
        add_intersection(network, make_intersection(0, 0, 0));
        add_intersection(network, make_intersection(1, 10, 10));
        add_intersection(network, make_intersection(2, 20, 20));
        add_road(network, make_road(0, 1, "Road A", 60, 10, 50));
        add_road(network, make_road(1, 2, "Road B", 60, 10, 50));
        const path = fastest_path(network, 0, 2);
        expect(path.path).toStrictEqual([0, 1, 2]);
        expect(path.time).toBeGreaterThan(0);
    });

    test("Handle unreachable destinations", () => {
        const network = empty_road_network();
        add_intersection(network, make_intersection(1, 0, 0));
        add_intersection(network, make_intersection(2, 10, 10));
        const path = fastest_path(network, 1, 2);
        expect(path.path).toEqual([]);
        expect(path.time).toBe(0);
    }); 

    test("Handle same start and end intersections", () => {
        const network = empty_road_network();
        add_intersection(network, make_intersection(1, 0, 0));
        const path = fastest_path(network, 1, 1);
        expect(path.path).toEqual([]);
        expect(path.time).toBe(0);
    });
});
