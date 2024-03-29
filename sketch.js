let n_points = 10000;
let k = 20;
let convergence_tollerence = 0.01;

let points = [];
let means = [];
let cluster_colors = [];
let convergence_reached;

let k_slider;
let p_slider;

function setup() {
  // Create the canvas and add it to the #sketch div
  let c = createCanvas(600,600);
  c.parent("sketch");
  // c.center("horizontal");
  // Set a low-ish frame rate
  frameRate(6);

  // Initialize the points and starting means
  initialize();

  // Attach event listeners to the sliders for updating k-value and n-points
  k_slider = document.getElementById("k-value-slider");
  k_slider.addEventListener('input', () => {
    let raw_k = k_slider.value;
    let new_k = parseInt(raw_k);
    document.getElementById("k-value").innerHTML = formatNumber(new_k);
  });
  k_slider.addEventListener('mouseup', () => {
    let raw_k = k_slider.value;
    let new_k = parseInt(raw_k);
    document.getElementById("k-value").innerHTML = formatNumber(new_k);
    k = new_k;
    initialize();
  });

  p_slider = document.getElementById("p-value-slider");
  p_slider.addEventListener('input', () => {
    let raw_p = p_slider.value;
    let new_p = parseInt(raw_p);
    document.getElementById("p-value").innerHTML = formatNumber(new_p);
  });
  p_slider.addEventListener('mouseup', () => {
    let raw_p = p_slider.value;
    let new_p = parseInt(raw_p);
    document.getElementById("p-value").innerHTML = formatNumber(new_p);
    n_points = new_p;
    initialize();
  });

}

function draw() {
  if (convergence_reached) {
    noFill();
    stroke(100,200,100);
    strokeWeight(10);
    rect(0,0,width,height);
  } else {
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
    // Check to see if convergence has been reached
    let means_changed = false;
    for (let i = 0; i < means.length; i++) {
      if (means[i].dist(new_means[i]) > convergence_tollerence) {
        means_changed = true;
        break;
      }
    }
    if (means_changed) {
      means = new_means;
    } else {
      console.log("Convergence reached. Stopping.");
      convergence_reached = true;
    }
    // Draw red box around canvas
    noFill();
    stroke(250,100,100);
    strokeWeight(10);
    rect(0,0,width,height);
  }
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
  colorMode(HSL, 360, 100, 100);
  for (i = 0; i < k; i++) {
    cluster_colors.push(color(
      floor(360/k) * i,
      70 + random(30),
      40 + random(40)
    ));
  }
  // Reset convergence_reached
  convergence_reached = false;
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

//Format number with commas for displaying
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
