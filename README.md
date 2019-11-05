# k-Means Clustering Visualization

<p align="center">
  <img width="400" height="400" src="k_mean_vis_3.gif">
</p>

A visualization of the k-means clustering algorithm created in javascript, using P5.js, based on the method described in the [wikipedia](https://en.wikipedia.org/wiki/K-means_clustering) article. Steps are as follows:

1. Pick k random points from the pool to use as the inital means
2. Group the rest of the points by the mean they're closest to
3. Move each mean to the center of their clusters
4. Repeat steps 2 and 3 until the assignments have no longer changed


Points are randomly generated and the k-means are initialized using the [Forgy method](https://en.wikipedia.org/wiki/K-means_clustering#Initialization_methods), where k observations are selected from the dataset and used as the initial means.

Here's the link to the GitHub Pages site: https://a-poor.github.io/k_means/
