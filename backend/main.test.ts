import { list, pair, head, tail } from '../lib/list';
import { Road, Intersection, make_road, RoadNetwork, empty_road_network, add_road, fastest_path, road_name, road_speed_limit, road_going_from, road_going_to, is_one_way, base_travel_time, current_travel_time, add_intersection, make_intersection } from './main';

// Test make_road with one-way and two-way roads
test('make_road correctly makes a two-way road', () => {
    const road = make_road(0, 1, "0-1", 80, 60, 70);
    expect(road).toStrictEqual({
        connection: pair(0, 1),
        name: "0-1",
        speed_limit: 80,
        travel_time: 60,
        average_speed: 70,
        one_way: false
    });
});

test('make_road correctly makes a one-way road', () => {
    const road = make_road(0, 1, "0-1", 80, 60, 70, true);
    expect(road).toStrictEqual({
        connection: pair(0, 1),
        name: "0-1",
        speed_limit: 80,
        travel_time: 60,
        average_speed: 70,
        one_way: true
    });
});

// Test road_name, road_speed_limit, road_going_from, road_going_to, is_one_way, base_travel_time, and current_travel_time
const test_road = make_road(0, 1, "0-1", 80, 60, 40, true);

test('road_name correctly gets the name of the road', () => {
    expect(road_name(test_road)).toBe("0-1");
});

// Test empty_road_network
test('empty_road_network initializes an empty network', () => {
    const network = empty_road_network();
    expect(network).toStrictEqual({
        intersections: [],
        adj: [],
        edges: [[]],
        size: 0
    });
});

const intersection_0: Intersection = make_intersection(0, 0, 0);
const intersection_1: Intersection = make_intersection(1, 0, 0);
const intersection_2: Intersection = make_intersection(2, 0, 0);

// Test add_road with both one-way and two-way roads
const road_0_1 = make_road(0, 1, "0-1", 80, 60, 70);
const road_0_2 = make_road(0, 2, "0-2", 80, 30, 80);
const road_1_2 = make_road(1, 2, "1-2", 70, 45, 50, true);

test('add_road adds a two-way road', () => {
    const road_network = empty_road_network();
    add_intersection(road_network, make_intersection(0, 0, 0));
    add_intersection(road_network, make_intersection(1, 0, 0));

    add_road(road_network, road_0_1);

    expect(road_network.adj[0]).toStrictEqual(list(1));
    expect(road_network.adj[1]).toStrictEqual(list(0));
    expect(road_network.edges[0][1]).toBe(road_0_1);
    expect(road_network.edges[1][0]).toBe(road_0_1);
});

test('add_road adds a one-way road', () => {
    const road_network = empty_road_network();
    add_intersection(road_network, make_intersection(0, 0, 0));
    add_intersection(road_network, make_intersection(1, 0, 0));
    add_intersection(road_network, make_intersection(2, 0, 0));

    add_road(road_network, road_1_2);

    expect(road_network.adj[1]).toStrictEqual(list(2));
    expect(road_network.adj[2]).toBeUndefined();
    expect(road_network.edges[1][2]).toBe(road_1_2);
    expect(road_network.edges[2]).toBeUndefined();
});

// Test fastest_path for different scenarios
const road_network = empty_road_network();

add_intersection(road_network, intersection_0);
add_intersection(road_network, intersection_1);
add_intersection(road_network, intersection_2);

add_road(road_network, road_0_1);
add_road(road_network, road_0_2);
add_road(road_network, road_1_2);

test('fastest_path finds the shortest path from 0 to 2', () => {
    const result = fastest_path(road_network, 0, 2);
    expect(result.path).toStrictEqual([0, 2]);
});

test('fastest_path finds no path if disconnected', () => {
    const isolated_network = empty_road_network();

    add_intersection(isolated_network, make_intersection(0, 0, 0));
    add_intersection(isolated_network, make_intersection(1, 0, 0));
    add_intersection(isolated_network, make_intersection(2, 0, 0));
    add_intersection(isolated_network, make_intersection(3, 0, 0));

    add_road(isolated_network, make_road(0, 1, "0-1", 80, 60, 70));
    add_road(isolated_network, make_road(2, 3, "2-3", 80, 60, 70));

    const result = fastest_path(isolated_network, 0, 3);
    expect(result.path).toStrictEqual([]);
});

test('fastest_path handles loops without infinite loops', () => {
    const loop_network = empty_road_network();
    add_intersection(loop_network, make_intersection(0, 0, 0));
    add_intersection(loop_network, make_intersection(1, 0, 0));
    
    add_road(loop_network, make_road(0, 1, "0-1", 80, 60, 70));
    add_road(loop_network, make_road(1, 0, "1-0", 80, 60, 70));

    const result = fastest_path(loop_network, 0, 1);
    expect(result.path).toStrictEqual([0, 1]);
});
