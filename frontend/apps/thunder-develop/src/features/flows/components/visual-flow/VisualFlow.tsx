/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import {
  Background,
  Controls,
  type Edge,
  type EdgeTypes,
  type NodeTypes,
  ReactFlow,
  type ReactFlowProps,
} from '@xyflow/react';
import {useColorScheme} from '@wso2/oxygen-ui';
import isEmpty from 'lodash-es/isEmpty';
import {type ReactElement, useEffect, useMemo} from 'react';
import '@xyflow/react/dist/style.css';
import Droppable from '../dnd/droppable';
import generateResourceId from '../../utils/generateResourceId';
import VisualFlowConstants from '../../constants/VisualFlowConstants';
import useFlowBuilderCore from '../../hooks/useFlowBuilderCore';
import getKnownEdgeTypes from '../../utils/getKnownEdgeTypes';
import BaseEdge from '../react-flow-overrides/BaseEdge';
import './VisualFlow.scss';

/**
 * Props interface of {@link VisualFlow}
 */
export interface VisualFlowPropsInterface extends ReactFlowProps {
  /**
   * Custom edges to be rendered.
   */
  customEdgeTypes?: Record<string, Edge>;
  /**
   * Node types to be rendered.
   */
  nodeTypes?: NodeTypes;
}

/**
 * Wrapper component for React Flow used in the Visual Editor.
 *
 * @param props - Props injected to the component.
 * @returns Visual editor flow component.
 */
function VisualFlow({
  customEdgeTypes = {},
  nodeTypes = {},
  nodes,
  onNodesChange,
  edges,
  onEdgesChange,
  onConnect,
  onNodesDelete,
  onEdgesDelete,
}: VisualFlowPropsInterface): ReactElement {
  const {setFlowNodeTypes, flowNodeTypes, setFlowEdgeTypes, flowEdgeTypes} = useFlowBuilderCore();
  const {mode} = useColorScheme();

  const edgeTypes: EdgeTypes = useMemo(
    () => ({
      'base-edge': BaseEdge,
      ...getKnownEdgeTypes(),
      ...customEdgeTypes,
    }),
    [customEdgeTypes],
  );

  useEffect(() => {
    if (!isEmpty(flowNodeTypes)) {
      return;
    }

    setFlowNodeTypes(nodeTypes ?? {});
  }, [nodeTypes, flowNodeTypes, setFlowNodeTypes]);

  useEffect(() => {
    if (!isEmpty(flowEdgeTypes)) {
      return;
    }

    setFlowEdgeTypes(edgeTypes ?? {});
  }, [edgeTypes, flowEdgeTypes, setFlowEdgeTypes]);

  return (
    <Droppable
      id={generateResourceId(VisualFlowConstants.FLOW_BUILDER_CANVAS_ID)}
      type={VisualFlowConstants.FLOW_BUILDER_DROPPABLE_CANVAS_ID}
      accept={[...VisualFlowConstants.FLOW_BUILDER_CANVAS_ALLOWED_RESOURCE_TYPES]}
    >
      <ReactFlow
        fitView
        fitViewOptions={{
          maxZoom: 0.8,
        }}
        nodes={nodes}
        edges={edges}
        nodeTypes={useMemo(() => nodeTypes, [nodeTypes])}
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        proOptions={{hideAttribution: true}}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        colorMode={mode}
      >
        <Controls className="flow-controls" position="top-center" orientation="horizontal" />
        <Background />
      </ReactFlow>
    </Droppable>
  );
}

export default VisualFlow;
