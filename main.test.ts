import { list, pair } from '../lib/list';
import { Road, make_road, RoadNetwork, empty_road_network, add_road, fastest_path } from './main';

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

test('make_road correctly makes a road', () => {
    const road_0_1_full_depth: Road = {
        connection: pair(0, 1),
        name: "0-1",
        speed_limit: 80,
        travel_time: 60,
        average_speed: 70,
        one_way: false
    }

    expect(road_0_1).toStrictEqual(road_0_1_full_depth);
});

test('add_road correctly adds a road to a road network', () => {
    const road_0_1: Road = make_road(0, 1, "0-1", 80, 60, 70);
    const road_0_2: Road = make_road(0, 2, "0-2", 80, 30, 80);
    
    const road_network_test = empty_road_network();
    add_road(road_network_test, road_0_1);
    add_road(road_network_test, road_0_2);

    const road_network_test_full = {
        adj: [
            list(2, 1),
            list(0),
            list(0)
        ],
        edges: [
            [, road_0_1, road_0_2],
            [road_0_1],
            [road_0_2],
        ],
        size: 3
    }

    expect(road_network_test).toStrictEqual(road_network_test_full);
});

test('fastest_path produces fastest path from 3 to 5', () => {
    expect(fastest_path(_roads0, 3, 5)[2]).toStrictEqual(list(3, 2, 4, 5));
});