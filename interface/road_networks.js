import { add_intersection, add_road, empty_road_network, make_intersection, make_road } from "../backend/main.mjs";

export const all_road_networks = [];

function add_road_network(_road_network, _width, _height) {
  all_road_networks.push({
    road_network: _road_network,
    width: _width,
    height: _height
  });
}

// Road-network 1

const road_network_1 = empty_road_network();

const intersections_1 = [
  make_intersection(0, 300, 30),
  make_intersection(1, 150, 120),
  make_intersection(2, 450, 120),
  make_intersection(3, 90, 240),
  make_intersection(4, 210, 240),
  make_intersection(5, 390, 240),
  make_intersection(6, 510, 240),
  make_intersection(7, 30, 360),
  make_intersection(8, 120, 360),
  make_intersection(9, 180, 360),
  make_intersection(10, 360, 360),
  make_intersection(11, 480, 360)
];

intersections_1.forEach(intersection => add_intersection(road_network_1, intersection));

const roads_1 = [
  make_road(0, 1, "0-1", 60, 60, 60),
  make_road(0, 2, "0-2", 60, 60, 60),
  make_road(1, 3, "1-3", 60, 60, 60),
  make_road(1, 4, "1-4", 60, 60, 60),
  make_road(2, 5, "2-5", 60, 60, 60),
  make_road(2, 6, "2-6", 60, 60, 60),
  make_road(3, 7, "3-7", 60, 60, 60),
  make_road(3, 8, "3-8", 60, 60, 60),
  make_road(4, 8, "4-8", 60, 60, 60),
  make_road(4, 9, "4-9", 60, 60, 60),
  make_road(5, 9, "5-9", 60, 60, 60),
  make_road(5, 10, "5-10", 60, 60, 60),
  make_road(6, 10, "6-10", 60, 60, 60),
  make_road(6, 11, "6-11", 60, 60, 60),
  make_road(7, 8, "7-8", 60, 60, 60),
  make_road(8, 9, "7-9", 60, 60, 60),
  make_road(9, 10, "9-10", 60, 60, 60),
  make_road(10, 11, "10-11", 60, 60, 60)
];

roads_1.forEach(road => add_road(road_network_1, road));

add_road_network(road_network_1, 600, 400);

// Road-network 2

const road_network_2 = empty_road_network();

const intersections_2 = [
  make_intersection(0, 150, 120), make_intersection(1, 480, 80), make_intersection(2, 620, 250), make_intersection(3, 870, 160), make_intersection(4, 1050, 300), make_intersection(5, 1220, 100),
  make_intersection(6, 90, 350), make_intersection(7, 370, 400), make_intersection(8, 530, 320), make_intersection(9, 710, 500), make_intersection(10, 920, 420), make_intersection(11, 1100, 580),
  make_intersection(12, 200, 640), make_intersection(13, 450, 700), make_intersection(14, 590, 620), make_intersection(15, 800, 720), make_intersection(16, 1020, 700), make_intersection(17, 1200, 750)
];

intersections_2.forEach(intersection => add_intersection(road_network_2, intersection));

const roads_2 = [
  make_road(0, 1, "0-1", 40, 10, 35), make_road(1, 2, "1-2", 50, 8, 45), make_road(2, 3, "2-3", 60, 7, 55), make_road(3, 4, "3-4", 70, 6, 65), make_road(4, 5, "4-5", 80, 5, 75),
  make_road(6, 7, "6-7", 50, 9, 45), make_road(7, 8, "7-8", 60, 7, 55), make_road(8, 9, "8-9", 70, 6, 65), make_road(9, 10, "9-10", 90, 5, 85), make_road(10, 11, "10-11", 100, 4, 95),
  make_road(12, 13, "12-13", 60, 8, 55), make_road(13, 14, "13-14", 70, 7, 65), make_road(14, 15, "14-15", 80, 6, 75), make_road(15, 16, "15-16", 90, 5, 85), make_road(16, 17, "16-17", 100, 4, 95),
  make_road(0, 6, "0-6", 90, 5, 85), make_road(6, 12, "6-12", 100, 4, 95), make_road(12, 7, "12-7", 110, 3, 105),
  make_road(1, 7, "1-7", 60, 8, 55), make_road(7, 13, "7-13", 70, 7, 65), make_road(13, 9, "13-9", 80, 6, 75),
  make_road(2, 8, "2-8", 50, 9, 45), make_road(8, 14, "8-14", 60, 8, 55), make_road(14, 10, "14-10", 70, 7, 65),
  make_road(3, 9, "3-9", 90, 5, 85), make_road(9, 15, "9-15", 100, 4, 95), make_road(15, 11, "15-11", 110, 3, 105),
  make_road(4, 10, "4-10", 80, 6, 75), make_road(10, 16, "10-16", 90, 5, 85), make_road(16, 17, "16-17", 100, 4, 95),
  make_road(5, 11, "5-11", 70, 7, 65), make_road(11, 17, "11-17", 80, 6, 75), make_road(17, 13, "17-13", 90, 5, 85)
];

roads_2.forEach(road => add_road(road_network_2, road));

add_road_network(road_network_2, 1300, 800)

// Road-network 3

const road_network_large = empty_road_network();

const intersections_large = [
  make_intersection(0, 100, 150), make_intersection(1, 280, 90), make_intersection(2, 450, 200), make_intersection(3, 670, 130), make_intersection(4, 900, 250), make_intersection(5, 1150, 180), make_intersection(6, 1350, 300),
  make_intersection(7, 120, 400), make_intersection(8, 350, 450), make_intersection(9, 550, 380), make_intersection(10, 720, 500), make_intersection(11, 950, 420), make_intersection(12, 1120, 530), make_intersection(13, 1300, 600),
  make_intersection(14, 150, 650), make_intersection(15, 390, 680), make_intersection(16, 580, 720), make_intersection(17, 790, 650), make_intersection(18, 1020, 730), make_intersection(19, 1200, 800), make_intersection(20, 1380, 750),
  make_intersection(21, 200, 900), make_intersection(22, 480, 950), make_intersection(23, 670, 880), make_intersection(24, 850, 1000), make_intersection(25, 1080, 950), make_intersection(26, 1250, 1020), make_intersection(27, 1400, 1100)
];

intersections_large.forEach(intersection => add_intersection(road_network_large, intersection));

const roads_large = [
  make_road(0, 1, "0-1", 60, 10, 55), make_road(1, 2, "1-2", 70, 9, 65), make_road(2, 3, "2-3", 80, 8, 75), make_road(3, 4, "3-4", 90, 7, 85), make_road(4, 5, "4-5", 100, 6, 95), make_road(5, 6, "5-6", 110, 5, 105),
  make_road(0, 7, "0-7", 90, 7, 85), make_road(7, 8, "7-8", 100, 6, 95), make_road(8, 9, "8-9", 110, 5, 105), make_road(9, 10, "9-10", 120, 4, 115), make_road(10, 11, "10-11", 130, 3, 125), make_road(11, 12, "11-12", 140, 2, 135), make_road(12, 13, "12-13", 150, 1, 145),
  make_road(7, 14, "7-14", 80, 8, 75), make_road(14, 15, "14-15", 90, 7, 85), make_road(15, 16, "15-16", 100, 6, 95), make_road(16, 17, "16-17", 110, 5, 105), make_road(17, 18, "17-18", 120, 4, 115), make_road(18, 19, "18-19", 130, 3, 125), make_road(19, 20, "19-20", 140, 2, 135),
  make_road(14, 21, "14-21", 70, 9, 65), make_road(21, 22, "21-22", 80, 8, 75), make_road(22, 23, "22-23", 90, 7, 85), make_road(23, 24, "23-24", 100, 6, 95), make_road(24, 25, "24-25", 110, 5, 105), make_road(25, 26, "25-26", 120, 4, 115), make_road(26, 27, "26-27", 130, 3, 125),
  make_road(1, 8, "1-8", 85, 6, 80), make_road(3, 9, "3-9", 90, 5, 85), make_road(5, 10, "5-10", 100, 4, 95), make_road(7, 15, "7-15", 110, 3, 105), make_road(9, 16, "9-16", 120, 2, 115), make_road(11, 17, "11-17", 130, 1, 125), make_road(13, 18, "13-18", 140, 1, 135),
  make_road(2, 14, "2-14", 95, 7, 90), make_road(4, 15, "4-15", 100, 6, 95), make_road(6, 16, "6-16", 110, 5, 105), make_road(8, 17, "8-17", 120, 4, 115), make_road(10, 18, "10-18", 130, 3, 125), make_road(12, 19, "12-19", 140, 2, 135), make_road(14, 20, "14-20", 150, 1, 145)
];

roads_large.forEach(road => add_road(road_network_large, road));

add_road_network(road_network_large, 1600, 1200);

