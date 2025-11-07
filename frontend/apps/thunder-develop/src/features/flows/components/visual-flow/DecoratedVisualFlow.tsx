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

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {move} from '@dnd-kit/helpers';
import {DragDropProvider, type DragDropEventHandlers} from '@dnd-kit/react';
import {
  type Connection,
  type Edge,
  MarkerType,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type OnNodesDelete,
  type XYPosition,
  addEdge,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  useReactFlow,
  useUpdateNodeInternals,
} from '@xyflow/react';
import type {UpdateNodeInternals} from '@xyflow/system';
import cloneDeep from 'lodash-es/cloneDeep';
import {type Dispatch, useCallback, type ReactElement, type SetStateAction} from 'react';
import {Box} from '@wso2/oxygen-ui';
import classNames from 'classnames';
import VisualFlow, {type VisualFlowPropsInterface} from './VisualFlow';
import type {Element} from '../../models/elements';
import {type Resource, type Resources, ResourceTypes} from '../../models/resources';
import type {Step, StepData} from '../../models/steps';
import {type Template} from '../../models/templates';
import type {Widget} from '../../models/widget';
import type {DragSourceData, DragTargetData} from '../../models/drag-drop';
import PluginRegistry from '../../plugins/PluginRegistry';
import useFlowBuilderCore from '../../hooks/useFlowBuilderCore';
import generateResourceId from '../../utils/generateResourceId';
import autoAssignConnections from '../../utils/autoAssignConnections';
import useGenerateStepElement from '../../hooks/useGenerateStepElement';
import useDeleteExecutionResource from '../../hooks/useDeleteExecutionResource';
import useStaticContentField from '../../hooks/useStaticContentField';
import useConfirmPasswordField from '../../hooks/useConfirmPasswordField';
import VisualFlowConstants from '../../constants/VisualFlowConstants';
import ResourcePanel from '../resource-panel/ResourcePanel';
import HeaderPanel from '../header-panel/HeaderPanel';
import FlowEventTypes from '../../models/extension';
import ValidationPanel from '../validation-panel/ValidationPanel';
import ResourcePropertyPanel from '../resource-property-panel/ResourcePropertyPanel';
import useComponentDelete from '../../hooks/useComponentDelete';
import applyAutoLayout from '../../utils/applyAutoLayout';

/**
 * Props interface of {@link DecoratedVisualFlow}
 */
export interface DecoratedVisualFlowPropsInterface extends VisualFlowPropsInterface {
  /**
   * Flow resources.
   */
  resources: Resources;
  /**
   * Callback to be fired when an edge is resolved.
   * @param connection - Connection object.
   * @returns Edge object.
   */
  onEdgeResolve?: (connection: Connection, nodes: Node[]) => Edge;
  /**
   * Initial nodes and edges to be rendered.
   */
  initialNodes?: Node[];
  /**
   * Initial nodes and edges to be rendered.
   */
  initialEdges?: Edge[];
  /**
   * Current nodes in the flow.
   */
  nodes: Node[];
  /**
   * Current edges in the flow.
   */
  edges: Edge[];
  mutateComponents: (components: Element[]) => Element[];
  onTemplateLoad: (template: Template) => [Node[], Edge[], Resource?, string?];
  onWidgetLoad: (
    widget: Widget,
    targetResource: Resource,
    currentNodes: Node[],
    edges: Edge[],
  ) => [Node[], Edge[], Resource | null, string | null];
  onStepLoad: (step: Step) => Step;
  onResourceAdd: (resource: Resource) => void;
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  /**
   * Flag to control header panel visibility.
   */
  isHeaderPanelOpen?: boolean;
  /**
   * Content to display in the header panel.
   */
  headerPanelContent?: ReactElement | null;
  /**
   * Callback to be triggered when back button is clicked.
   */
  onBack?: () => void;
  /**
   * Title for the flow builder.
   */
  flowTitle?: string;
}

/**
 * Component to decorate the visual flow editor with the necessary providers.
 *
 * @param props - Props injected to the component.
 * @returns Decorated visual flow component.
 */
function DecoratedVisualFlow({
  resources,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialNodes = [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initialEdges = [],
  setNodes,
  setEdges,
  edges,
  nodes,
  onNodesChange,
  onEdgesChange,
  onEdgeResolve = undefined,
  mutateComponents,
  onTemplateLoad,
  onWidgetLoad,
  onStepLoad,
  onResourceAdd,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  headerPanelContent = null,
  ...rest
}: DecoratedVisualFlowPropsInterface): ReactElement {
  // Event handlers for ON_NODE_DELETE event.
  useDeleteExecutionResource();

  // Event handlers for ON_PROPERTY_PANEL_OPEN event.
  useConfirmPasswordField();

  // Event handlers for static content in execution steps.
  useStaticContentField();

  const {screenToFlowPosition, updateNodeData} = useReactFlow();
  const {generateStepElement} = useGenerateStepElement();
  const updateNodeInternals: UpdateNodeInternals = useUpdateNodeInternals();
  const {deleteComponent} = useComponentDelete();

  const {isResourcePanelOpen, isResourcePropertiesPanelOpen, onResourceDropOnCanvas, isFlowMetadataLoading, metadata} =
    useFlowBuilderCore();

  const addCanvasNode = (
    event: Parameters<DragDropEventHandlers['onDragEnd']>[0],
    sourceData: DragSourceData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _targetData: DragTargetData,
  ): void => {
    const sourceResource: Resource | undefined = cloneDeep(sourceData.dragged);

    if (!sourceResource || !event.nativeEvent) {
      return;
    }

    // Type guard to ensure nativeEvent is a MouseEvent
    const {nativeEvent} = event;
    if (!('clientX' in nativeEvent) || !('clientY' in nativeEvent)) {
      return;
    }

    const {clientX, clientY} = nativeEvent as MouseEvent;

    const position: XYPosition = screenToFlowPosition({
      x: clientX,
      y: clientY,
    });

    let generatedStep: Step = {
      ...sourceResource,
      data: {
        components: [],
        ...(sourceResource?.data ?? {}),
      },
      deletable: true,
      id: generateResourceId(sourceResource.type.toLowerCase()),
      position,
    } as Step;

    // Decorate the step with any additional information
    generatedStep = onStepLoad(generatedStep);

    setNodes((prevNodes: Node[]) => [...prevNodes, generatedStep]);

    onResourceDropOnCanvas(generatedStep, '');
  };

  const addToView = (
    event: Parameters<DragDropEventHandlers['onDragEnd']>[0],
    sourceData: DragSourceData,
    targetData: DragTargetData,
  ): void => {
    const {dragged: sourceResource} = sourceData;
    const {stepId: targetStepId, droppedOn: targetResource} = targetData;

    if (sourceResource?.resourceType === ResourceTypes.Widget && nodes && edges && targetResource) {
      const [newNodes, newEdges, defaultPropertySelector, defaultPropertySectorStepId] = onWidgetLoad(
        sourceResource as Widget,
        targetResource,
        nodes,
        edges,
      );

      // Auto-assign connections for execution steps.
      if (metadata?.executorConnections) {
        autoAssignConnections(newNodes, metadata.executorConnections);
      }

      setNodes(() => newNodes);
      setEdges(() => newEdges);

      onResourceDropOnCanvas(
        defaultPropertySelector ?? sourceResource,
        defaultPropertySectorStepId ?? targetStepId ?? '',
      );

      return;
    }

    if (sourceResource && targetStepId) {
      const generatedElement: Element = generateStepElement(sourceResource);

      updateNodeData(targetStepId, (node: Node) => {
        const nodeData = node?.data as StepData | undefined;
        const updatedComponents: Element[] = move([...(cloneDeep(nodeData?.components) ?? [])], event);

        return {
          components: mutateComponents([...updatedComponents, generatedElement]),
        };
      });

      onResourceDropOnCanvas(generatedElement, targetStepId);
    }
  };

  const addToForm = (
    event: Parameters<DragDropEventHandlers['onDragEnd']>[0],
    sourceData: DragSourceData,
    targetData: DragTargetData,
  ): void => {
    const {dragged: sourceResource} = sourceData;
    const {stepId: targetStepId, droppedOn: targetResource} = targetData;

    if (sourceResource && targetStepId && targetResource) {
      const generatedElement: Element = generateStepElement(sourceResource);

      updateNodeData(targetStepId, (node: Node) => {
        const nodeData = node?.data as StepData | undefined;
        const updatedComponents: Element[] =
          cloneDeep(nodeData?.components)?.map((component: Element) =>
            component.id === targetResource.id
              ? {
                  ...component,
                  components: move([...(component.components ?? [])], event).concat(generatedElement),
                }
              : component,
          ) ?? [];

        return {
          components: mutateComponents(updatedComponents),
        };
      });

      onResourceDropOnCanvas(generatedElement, targetStepId);
    }
  };

  const handleDragEnd: DragDropEventHandlers['onDragEnd'] = (event): void => {
    const {source, target} = event.operation;

    if (event.canceled || !source || !target) {
      return;
    }

    const sourceData: DragSourceData = source.data as DragSourceData;
    const targetData: DragTargetData = target.data as DragTargetData;

    if (sourceData.isReordering) {
      if (!sourceData.stepId) {
        return;
      }

      updateNodeData(sourceData.stepId, (node: Node) => {
        const unorderedComponents: Element[] = cloneDeep((node?.data as StepData)?.components ?? []);

        const reorderedNested = unorderedComponents.map((component: Element) => {
          if (component?.components) {
            return {
              ...component,
              components: move(component.components, event),
            };
          }

          return component;
        });

        // Update node internals to fix handle positions after reordering
        updateNodeInternals(sourceData.stepId!);

        return {
          components: move(reorderedNested, event),
        };
      });
    } else if (typeof target?.id === 'string' && target.id.startsWith(VisualFlowConstants.FLOW_BUILDER_CANVAS_ID)) {
      addCanvasNode(event, sourceData, targetData);
    } else if (typeof target?.id === 'string' && target.id.startsWith(VisualFlowConstants.FLOW_BUILDER_VIEW_ID)) {
      addToView(event, sourceData, targetData);
    } else if (typeof target?.id === 'string' && target.id.startsWith(VisualFlowConstants.FLOW_BUILDER_FORM_ID)) {
      addToForm(event, sourceData, targetData);
    }
  };

  const handleDragOver: DragDropEventHandlers['onDragOver'] = useCallback(
    (event) => {
      const {source, target} = event.operation;

      if (!source || !target) {
        return;
      }

      // If not a reordering operation, return.
      if (!source.data.isReordering) {
        return;
      }

      const {data: sourceData} = source;
      const stepId = (sourceData as DragSourceData)?.stepId;

      if (!stepId) {
        return;
      }

      requestAnimationFrame(() => {
        updateNodeData(stepId, (node: Node) => {
          const nodeData = node?.data as StepData | undefined;
          const unorderedComponents: Element[] = cloneDeep(nodeData?.components) ?? [];

          const reorderedNested = unorderedComponents.map((component: Element) => {
            if (component?.components) {
              return {
                ...component,
                components: move(component.components, event),
              };
            }

            return component;
          });

          return {
            components: move(reorderedNested, event),
          };
        });
      });
    },
    [updateNodeData],
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      let edge: Edge | null = onEdgeResolve && nodes ? onEdgeResolve(connection, nodes) : null;

      edge ??= {
        ...connection,
        id: `${connection.source}-${connection.target}`,
        markerEnd: {
          type: MarkerType.Arrow,
        },
        type: 'base-edge',
      };

      setEdges((prevEdges: Edge[]) => addEdge(edge, prevEdges));
    },
    [onEdgeResolve, nodes, setEdges],
  );

  const onNodesDelete: OnNodesDelete<Node> = useCallback(
    (deleted: Node[]) => {
      // Execute plugins for ON_NODE_DELETE event asynchronously (fire and forget)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      PluginRegistry.getInstance().executeAsync(FlowEventTypes.ON_NODE_DELETE, deleted);

      if (!nodes || !edges) {
        return;
      }

      const currentEdges: Edge[] = edges;
      const currentNodes: Node[] = nodes;

      setEdges(
        deleted.reduce((acc: Edge[], node: Node) => {
          const incomers: Node[] = getIncomers(node, currentNodes, currentEdges);
          const outgoers: Node[] = getOutgoers(node, currentNodes, currentEdges);
          const connectedEdges: Edge[] = getConnectedEdges([node], currentEdges);

          const remainingEdges: Edge[] = acc.filter((edge: Edge) => !connectedEdges.includes(edge));

          const createdEdges: Edge[] = incomers.flatMap(({id: source}: {id: string}) =>
            outgoers
              .map(({id: target}: {id: string}) => {
                // Find the edge from incomer to the node being deleted
                const edge: Edge | undefined = connectedEdges.find(
                  (e: Edge) => e.source === source && e.target === node.id,
                );

                if (!edge) {
                  return null;
                }

                return {
                  id: `${edge.source}->${target}`,
                  source,
                  sourceHandle: edge?.sourceHandle,
                  target,
                  type: edge?.type,
                } as Edge;
              })
              .filter((edge: Edge | null) => edge !== null),
          );

          return [...remainingEdges, ...createdEdges];
        }, currentEdges),
      );
    },
    [setEdges, edges, nodes],
  );

  /**
   * Handles the deletion of edges.
   *
   * @param deleted - Array of deleted edges.
   */
  const onEdgesDelete: (deleted: Edge[]) => void = useCallback((deleted: Edge[]) => {
    // Execute plugins for ON_EDGE_DELETE event asynchronously (fire and forget)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    PluginRegistry.getInstance().executeAsync(FlowEventTypes.ON_EDGE_DELETE, deleted);
  }, []);

  const handleOnAdd = (resource: Resource): void => {
    // Currently we only let templates to be added to the canvas via a click.
    if (resource.resourceType !== ResourceTypes.Template) {
      return;
    }

    const template = cloneDeep(resource) as Template;

    /**
     * Execute plugins for ON_TEMPLATE_LOAD event.
     */
    PluginRegistry.getInstance().executeSync(FlowEventTypes.ON_TEMPLATE_LOAD, template);

    const [newNodes, newEdges, defaultPropertySelector, defaultPropertySectorStepId] = onTemplateLoad(template);

    // Auto-assign connections for execution steps.
    if (metadata?.executorConnections) {
      autoAssignConnections(newNodes, metadata.executorConnections);
    }

    // TODO: Figure-out a better way to handle this debounce.
    // Tracker: https://github.com/xyflow/xyflow/issues/2405
    setTimeout(() => {
      // Letting React Flow know of the programmatic updates to node for re-drawing edges.
      setNodes(() => {
        newNodes.forEach((node: Node) => {
          updateNodeInternals(node.id);

          if (node.data?.components) {
            (node.data.components as Element[]).forEach((component: Element) => {
              updateNodeInternals(component.id);

              if (component?.components) {
                component.components.forEach((nestedComponent: Element) => {
                  updateNodeInternals(nestedComponent.id);
                });
              }
            });
          }
        });

        return newNodes;
      });

      setEdges(() => [...newEdges]);
    }, 500);

    onResourceDropOnCanvas(defaultPropertySelector ?? resource, defaultPropertySectorStepId ?? '');
  };

  const handleSave = (): void => {
    // TODO: Implement save functionality
  };

  const handleAutoLayout = useCallback((): void => {
    const layoutedNodes = applyAutoLayout(nodes, edges, {
      direction: 'LR',
      nodeSpacing: 120, // Optimal spacing for clean horizontal layout
      rankSpacing: 180, // Balanced spacing between levels
    });

    setNodes(layoutedNodes);
  }, [nodes, edges, setNodes]);

  return (
    <Box className={classNames('decorated-visual-flow', 'react-flow-container')} sx={{height: '100%'}}>
      <HeaderPanel onSave={handleSave} onAutoLayout={handleAutoLayout} />
      <DragDropProvider onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
        <ResourcePanel
          resources={resources}
          open={isResourcePanelOpen}
          onAdd={handleOnAdd}
          disabled={isFlowMetadataLoading}
        >
          <ResourcePropertyPanel open={isResourcePropertiesPanelOpen} onComponentDelete={deleteComponent}>
            {/* <VersionHistoryPanel open={isVersionHistoryPanelOpen}> */}
            <VisualFlow
              nodes={nodes}
              onNodesChange={onNodesChange}
              edges={edges}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodesDelete={onNodesDelete}
              onEdgesDelete={onEdgesDelete}
              {...rest}
            />
            {/* </VersionHistoryPanel> */}
          </ResourcePropertyPanel>
          <ValidationPanel />
        </ResourcePanel>
      </DragDropProvider>
    </Box>
  );
}

export default DecoratedVisualFlow;
