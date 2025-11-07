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

import {Box, Stack, Button} from '@wso2/oxygen-ui';
import {addEdge, applyEdgeChanges, applyNodeChanges, Background, Controls, MiniMap, ReactFlow} from '@xyflow/react';
import {ArrowLeft} from 'lucide-react';
import {useCallback, useState} from 'react';
import {useNavigate} from 'react-router';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {id: 'n1', position: {x: 0, y: 0}, data: {label: 'Node 1'}},
  {id: 'n2', position: {x: 0, y: 100}, data: {label: 'Node 2'}},
];
const initialEdges = [{id: 'n1-n2', source: 'n1', target: 'n2'}];

/**
 * Flow Builder Page - Visual designer for login flows
 */
export default function FlowBuilderPage() {
  const navigate = useNavigate();

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback((params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)), []);

  const handleBack = () => {
    const handler = async () => {
      await navigate('/flows');
    };

    handler().catch(() => {
      // TODO: Handle navigation errors
    });
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        height: '90vh',
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode="dark"
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </Box>
  );
}
