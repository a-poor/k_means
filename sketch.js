let n_points = 15000;
let k = 10;

let points = [];
let means;
let cluster_colors = [];

function setup() {
  createCanvas(600,600);
  frameRate(24);

  initialize();
}
function draw() {
  colorMode(RGB, 255);
  background(0);
  point_clusters = [];
  for (let i = 0; i < k; i++) point_clusters.push([]);

  // Iterate through the points
  strokeWeight(5);
  for (let p of points) {
    // Find the mean they're closest to
    let d = [];
    let best_d;
    let best_i;
    for (let i = 0; i < means.length; i++) {
      let mean_distance = p.dist(means[i]);
      d.push(mean_distance);
      if (best_d == undefined || mean_distance < best_d) {
        best_d = mean_distance;
        best_i = i;
      }
    }
    // Draw them in that color
    stroke(cluster_colors[best_i]);
    point(p.x, p.y);
    // Add them to the correct cluster array
    point_clusters[best_i].push(p);
  }

  // Draw the mean points bigger
  strokeWeight(10);
  stroke(255);
  for (let i = 0; i < means.length; i++) {
    point(means[i].x,means[i].y);
  }

  // Find the new mean for each cluster
  let new_means = [];
  for (let i = 0; i < point_clusters.length; i++) {
    new_means.push(createVector());
    for (let p of point_clusters[i]) {
      new_means[i].add(p);
    }
    new_means[i].div(point_clusters[i].length);
  }
  means = new_means;
}


function initialize() {
  // Create the points
  points = [];
  for (let i = 0; i < n_points; i++) {
    points.push(createVector(random(width), random(height)));
  }
  // Find the initial means
  means = forgy(k);
  // Create the random color scheme
  for (i = 0; i < k; i++) {
    cluster_colors.push(random_hsl());
  }
}


function forgy(n) {
  let select_points = [];
  while (select_points.length < n &&
    select_points.length < points.length) {
    let p = points[floor(random(points.length))];
    let already_contains = false;
    for (let other of select_points) {
      if (p.dist(other) == 0) {
        already_contains = true;
        break;
      }
    }
    if (!already_contains) {
      select_points.push(p);
    }
  }
  return select_points;
}

function random_rgb() {
  colorMode(RGB, 255);
  return color(
    50 * floor(random(4)) + 50,
    50 * floor(random(4)) + 50,
    50 * floor(random(4)) + 50
  );
}
function random_hsl() {
  colorMode(HSL, 360, 100, 100);
  return color(
    floor(random(40)) * 9,
    80 + random(20),
    30 + random(40)
  );
}
