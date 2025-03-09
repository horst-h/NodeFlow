import { fetchData } from '../api/dataService.js';
import { adjustLinePosition, centerNode } from '../utils/graphUtils.js';

export function initGraph() {
  const ICON_RADIUS = 30;
  //let nodes = [];
  let links = [];

  const faIcons = [
    '\uf007',
    '\uf0c0',
    '\uf19c',
    '\uf233',
    '\uf2bb',
    '\uf3c5',
    '\uf6d9',
  ];
  function randomIcon() {
    return faIcons[Math.floor(Math.random() * faIcons.length)];
  }

  let nodes = d3.range(10).map((i) => ({
    id: `Node ${i}`,
    icon: randomIcon(),
    type: 'Server',
    created: '2023-05-12',
    owner: 'Admin',
  }));

  const infoBox = document.getElementById('info-box');
  const svg = d3
    .select('#graph')
    .attr('width', 900)
    .attr('height', 600)
    .call(d3.zoom().on('zoom', zoomed))
    .append('g');

  const linkLayer = svg.append('g');
  const nodeLayer = svg.append('g');

  const simulation = d3
    .forceSimulation()
    .force(
      'link',
      d3
        .forceLink()
        .id((d) => d.id)
        .distance(120)
    )
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(450, 300));

  function updateGraph() {
    const link = linkLayer
      .selectAll('.link')
      .data(links, (d) => `${d.source.id}-${d.target.id}`);
    link.enter().append('line').attr('class', 'link').merge(link);
    link.exit().remove();

    const node = nodeLayer.selectAll('.node').data(nodes);
    const nodeEnter = node
      .enter()
      .append('g')
      .attr('class', 'node')
      .on('click', expandNode)
      .on('mouseover', showInfo)
      .on('mouseout', resetInfoBox);

    nodeEnter
      .append('text')
      .attr('class', 'icon')
      .attr('text-anchor', 'middle')
      .attr('font-family', 'FontAwesome')
      .attr('font-size', '24px')
      .text((d) => d.icon);

    nodeEnter.merge(node);
    node.exit().remove();

    simulation.nodes(nodes).on('tick', () => {
      linkLayer
        .selectAll('.link')
        .attr(
          'x1',
          (d) => adjustLinePosition(d.source, d.target, ICON_RADIUS).x1
        )
        .attr(
          'y1',
          (d) => adjustLinePosition(d.source, d.target, ICON_RADIUS).y1
        )
        .attr(
          'x2',
          (d) => adjustLinePosition(d.source, d.target, ICON_RADIUS).x2
        )
        .attr(
          'y2',
          (d) => adjustLinePosition(d.source, d.target, ICON_RADIUS).y2
        );
      nodeLayer
        .selectAll('.node')
        .attr('transform', (d) => `translate(${d.x}, ${d.y})`);
    });

    simulation.force('link').links(links);
    simulation.alpha(1).restart();
  }

  function showInfo(event, d) {
    infoBox.innerHTML = `<h3>${d.id}</h3>
                         <p><strong>Type:</strong> ${d.type}</p>
                         <p><strong>Created:</strong> ${d.created}</p>
                         <p><strong>Owner:</strong> ${d.owner}</p>`;
  }

  function expandNode(event, clickedNode) {
    // highlight the selected node
    d3.selectAll('.node').classed('selected', false);
    d3.select(event.currentTarget).classed('selected', true);

    // Transition selected node to the center
    centerNode(clickedNode, svg, zoom);

    setTimeout(() => {
      const newNodes = d3.range(5).map((i) => ({
        id: `${clickedNode.id}.${i}`,
        icon: randomIcon(),
        type: 'Database',
        created: '2024-01-01',
        owner: 'User',
      }));
      nodes.push(...newNodes);
      newNodes.forEach((n) => links.push({ source: clickedNode, target: n }));
      updateGraph();
    }, 200);
  }

  function resetInfoBox() {
    infoBox.innerHTML = `<i class="fas fa-question-circle placeholder-icon"></i>
                         <h3>No object selected</h3>
                         <p>Hover over a node to see details</p>`;
  }

  function showInfo(event, d) {
    infoBox.innerHTML = `<h3>${d.id}</h3>
                         <p><strong>Type:</strong> ${d.type}</p>
                         <p><strong>Created:</strong> ${d.created}</p>
                         <p><strong>Owner:</strong> ${d.owner}</p>`;
  }
  function zoomed({ transform }) {
    svg.attr('transform', transform);
  }

  fetchData().then((data) => {
    nodes = data;
    updateGraph();
  });

  const zoom = d3
    .zoom()
    .scaleExtent([0.5, 3]) // Min and max zoom levels
    .on('zoom', (event) => {
      svg.attr('transform', event.transform);
    });

  d3.select('#graph').call(zoom);
}
