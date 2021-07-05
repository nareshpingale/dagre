const data1 = {
  nodes: [
    {
      id: "0",
      width: 20,
      height: 20,
    },
    {
      id: "1",
      width: 20,
      height: 20,
    },
    {
      id: "2",
      width: 20,
      height: 20,
    },
    {
      id: "3",
      width: 20,
      height: 20,
    },
    {
      id: "4",
      width: 20,
      height: 20,
    },
    {
      id: "5",
      width: 20,
      height: 20,
    },
    {
      id: "6",
      width: 20,
      height: 20,
    },
  ],
  edges: [
    {
      source: "0",
      target: "1",
    },
    {
      source: "0",
      target: "2",
    },
    {
      source: "0",
      target: "3",
    },
    {
      source: "1",
      target: "4",
    },
    {
      source: "2",
      target: "5",
    },
    {
      source: "3",
      target: "6",
    },
  ],
};

const data2 = {
  nodes: [
    {
      id: "7",
      width: 20,
      height: 20,
    },
  ],
  edges: [
    {
      source: "0",
      target: "7",
    },
    {
      source: "7",
      target: "4",
    },
    {
      source: "7",
      target: "6",
    },
  ],
};

const g0 = createGraph({
  nodes: [...data1.nodes, ...data2.nodes],
  edges: [...data1.edges, ...data2.edges],
});

g0.setGraph({
  rankdir: "LR",
});

dagre.layout(g0, {
  edgeLabelSpace: false,
});

{
  const div = document.createElement("div");
  document.body.appendChild(div);
  drawGraph(g0, div);
}

const originGraph = createGraph(data1);
const g2 = createGraph({
  nodes: [...data1.nodes, ...data2.nodes],
  edges: [...data1.edges, ...data2.edges],
});

originGraph.setGraph({
  rankdir: "LR",
});

g2.setGraph({
  rankdir: "LR",
});

dagre.layout(originGraph, {
  edgeLabelSpace: false,
});

{
  const div = document.createElement("div");
  document.body.appendChild(div);
  drawGraph(originGraph, div);
}

dagre.layout(
  g2,
  {
    edgeLabelSpace: false,
  },
  originGraph
);

{
  const div = document.createElement("div");
  document.body.appendChild(div);
  drawGraph(g2, div);
}

function createGraph(data) {
  // Create a new directed graph
  const g = new dagre.graphlib.Graph();

  // Set an object for the graph label
  g.setGraph({
    // ranker: "longest-path",
    ranker: "tight-tree",
    // ranker: "network-complex",
  });

  // Default to assigning a new object as a label for each new edge.
  g.setDefaultEdgeLabel(function () {
    return {};
  });

  // Add nodes to the graph. The first argument is the node id. The second is
  // metadata about the node. In this case we're going to add labels to each of
  // our nodes.
  data.nodes.forEach((n) => {
    g.setNode(n.id, n);
  });

  // Add edges to the graph.
  data.edges.forEach((e) => {
    g.setEdge(e.source, e.target);
  });

  return g;
}

function drawGraph(g, container) {
  const svg = d3
    .select(container)
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);
  const nodes = g.nodes().map((n) => g.node(n));
  const edges = g.edges().map((e) => {
    const res = g.edge(e);
    res.source = g.node(e.v);
    res.target = g.node(e.w);
    return res;
  });

  const link = svg
    .selectAll(".edge")
    .data(edges)
    .enter()
    .append("polyline")
    .attr("class", "edge")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("points", (d) => {
      return `${d.source.x}, ${d.source.y} ${d.points
        .map((p) => `${p.x},${p.y}`)
        .join(" ")} ${d.target.x}, ${d.target.y}`;
    });

  const node = svg
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("rect")
    .style("fill", "#aaaaaa")
    .attr("class", "node")
    .attr("x", (d) => d.x - (d.width ?? 20) / 2)
    .attr("y", (d) => d.y - (d.height ?? 20) / 2)
    .attr("width", (d) => d.width ?? 20)
    .attr("height", (d) => d.height ?? 20);

  node.append("title").text((d) => d.id);
}
