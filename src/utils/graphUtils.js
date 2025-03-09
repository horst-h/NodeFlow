export function adjustLinePosition(source, target, ICON_RADIUS) {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const offsetX = (dx / distance) * ICON_RADIUS;
    const offsetY = (dy / distance) * ICON_RADIUS;

    return {
        x1: source.x + offsetX,
        y1: source.y + offsetY,
        x2: target.x - offsetX,
        y2: target.y - offsetY
    };
}

export function centerNode(d, svg, zoom) {
    if (!svg) {
        console.error("SVG element is undefined in centerNode()");
        return;
    }

    const svgContainer = d3.select("#graph");
    const width = +svgContainer.attr("width");
    const height = +svgContainer.attr("height");

    // Calculate translation to center the selected node
    const transform = d3.zoomIdentity
        .translate(width / 2 - d.x, height / 2 - d.y)
        .scale(1.5);  // Optional zoom

    // Apply the transition correctly
    svg.transition()
        .duration(800)
        .call(zoom.transform, transform);
}