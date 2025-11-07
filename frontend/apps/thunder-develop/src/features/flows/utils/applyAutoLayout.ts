/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import dagre from 'dagre';
import type {Edge, Node} from '@xyflow/react';

/**
 * Configuration options for auto-layout.
 */
export interface AutoLayoutOptions {
  /**
   * Direction of the layout.
   * @default 'TB' (top to bottom)
   */
  direction?: 'TB' | 'LR' | 'BT' | 'RL';
  /**
   * Spacing between nodes horizontally.
   * @default 100
   */
  nodeSpacing?: number;
  /**
   * Spacing between ranks (levels) vertically.
   * @default 150
   */
  rankSpacing?: number;
}

/**
 * Applies automatic layout to nodes using dagre to avoid edge intersections.
 *
 * @param nodes - Array of nodes to layout.
 * @param edges - Array of edges connecting the nodes.
 * @param options - Layout configuration options.
 * @returns Array of nodes with updated positions.
 */
export default function applyAutoLayout(
  nodes: Node[],
  edges: Edge[],
  options: AutoLayoutOptions = {},
): Node[] {
  const {direction = 'TB', nodeSpacing = 100, rankSpacing = 150} = options;

  // Create a new directed graph
  const dagreGraph = new dagre.graphlib.Graph();

  // Set graph options with edge separation to prevent intersections
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: nodeSpacing,
    ranksep: rankSpacing,
    edgesep: 40, // Moderate spacing between edges
    marginx: 50, // Moderate horizontal margin
    marginy: 50, // Moderate vertical margin
    ranker: 'network-simplex', // Use network-simplex for optimal layout
    align: 'UL', // Align nodes to upper-left for consistent positioning
  });

  // Add nodes to the graph with padding to prevent edge overlap
  nodes.forEach((node) => {
    // Use measured dimensions if available, otherwise use default
    const baseWidth = node.measured?.width ?? node.width ?? 250;
    const baseHeight = node.measured?.height ?? node.height ?? 100;

    // Add padding around nodes to create buffer zones for edges
    const padding = 25; // Reduced padding for tighter layout
    const width = baseWidth + padding * 2;
    const height = baseHeight + padding * 2;

    dagreGraph.setNode(node.id, {width, height});
  });

  // Add edges to the graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Calculate layout
  dagre.layout(dagreGraph);

  // Apply calculated positions to nodes
  const padding = 25; // Reduced padding for tighter layout
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    if (!nodeWithPosition) {
      return node;
    }

    // dagre positions are centered, so we need to adjust for React Flow
    // which uses top-left positioning
    // Also account for the padding we added to node dimensions
    const baseWidth = node.measured?.width ?? node.width ?? 250;
    const baseHeight = node.measured?.height ?? node.height ?? 100;
    const width = baseWidth + padding * 2;
    const height = baseHeight + padding * 2;

    return {
      ...node,
      position: {
        // Adjust position to account for padding buffer
        x: nodeWithPosition.x - width / 2 + padding,
        y: nodeWithPosition.y - height / 2 + padding,
      },
    };
  });

  return layoutedNodes;
}
