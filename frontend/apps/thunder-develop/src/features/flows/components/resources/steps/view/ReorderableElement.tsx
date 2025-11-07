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

import {Box, type BoxProps} from '@wso2/oxygen-ui';
import {useRef, type ReactElement} from 'react';
import PluginRegistry from '@/features/flows/plugins/PluginRegistry';
import FlowEventTypes from '@/features/flows/models/extension';
import VisualFlowConstants from '@/features/flows/constants/VisualFlowConstants';
import classNames from 'classnames';
import {GripVertical, PencilLineIcon, Trash2Icon} from '@wso2/oxygen-ui-icons-react';
import useComponentDelete from '@/features/flows/hooks/useComponentDelete';
import useValidationStatus from '@/features/flows/hooks/useValidationStatus';
import {useNodeId} from '@xyflow/react';
import useFlowBuilderCore from '@/features/flows/hooks/useFlowBuilderCore';
import type {Resource} from '@/features/flows/models/resources';
import Handle from '../../../dnd/handle';
import Sortable from '../../../dnd/sortable';
import type {SortableProps} from '../../../dnd/sortable';
import ValidationErrorBoundary from '../../../validation-panel/ValidationErrorBoundary';

/**
 * Props interface of {@link ReorderableElement}
 */
export interface ReorderableComponentPropsInterface
  extends Omit<SortableProps, 'element'>,
    Omit<BoxProps, 'children' | 'id'> {
  /**
   * The element to be rendered.
   */
  element: Resource;
}

/**
 * Re-orderable component inside a step node.
 *
 * @param props - Props injected to the component.
 * @returns ReorderableElement component.
 */
export function ReorderableElement({
  id,
  element,
  className,
  ...rest
}: ReorderableComponentPropsInterface): ReactElement {
  const handleRef = useRef<HTMLButtonElement>(null);
  const stepId: string | null = useNodeId();
  const {deleteComponent} = useComponentDelete();
  const {ElementFactory, setLastInteractedResource, setLastInteractedStepId, setIsOpenResourcePropertiesPanel} =
    useFlowBuilderCore();
  const {setOpenValidationPanel, setSelectedNotification} = useValidationStatus();

  /**
   * Handles the opening of the property panel for the resource.
   *
   * @param event - React MouseEvent triggered on element interaction.
   */
  const handlePropertyPanelOpen = (event: React.MouseEvent<HTMLElement>): void => {
    event.stopPropagation();
    setOpenValidationPanel?.(false);
    setSelectedNotification?.(null);
    if (stepId) {
      setLastInteractedStepId(stepId);
    }
    setLastInteractedResource(element);
  };

  /**
   * Handles the deletion of the element.
   */
  const handleElementDelete = (): void => {
    /**
     * Execute plugins for ON_NODE_ELEMENT_DELETE event and handle deletion.
     */
    PluginRegistry.getInstance()
      .executeAsync(FlowEventTypes.ON_NODE_ELEMENT_DELETE, stepId, element)
      .then(() => {
        if (stepId) {
          deleteComponent(stepId, element);
        }
        setIsOpenResourcePropertiesPanel(false);
      })
      .catch((error: Error) => {
        // TODO: Handle error with proper error notification
        throw error;
      });
  };

  return (
    <Sortable
      id={id}
      handleRef={handleRef}
      data={{isReordering: true, resource: element, stepId}}
      type={VisualFlowConstants.FLOW_BUILDER_DRAGGABLE_ID}
      accept={[VisualFlowConstants.FLOW_BUILDER_DRAGGABLE_ID]}
      {...rest}
    >
      <ValidationErrorBoundary resource={element} key={element.id}>
        <Box
          display="flex"
          alignItems="center"
          className={classNames('reorderable-component', className)}
          onDoubleClick={handlePropertyPanelOpen}
        >
          <Box className="flow-builder-dnd-actions">
            <Handle label="Drag" cursor="grab" ref={handleRef}>
              <GripVertical size={16} color="white" />
            </Handle>
            <Handle label="Edit" onClick={handlePropertyPanelOpen}>
              <PencilLineIcon size={16} color="white" />
            </Handle>
            <Handle label="Delete" onClick={handleElementDelete}>
              <Trash2Icon size={16} color="white" />
            </Handle>
          </Box>
          <div className="flow-builder-step-content-form-field-content">
            <ElementFactory stepId={stepId ?? ''} resource={element} />
          </div>
        </Box>
      </ValidationErrorBoundary>
    </Sortable>
  );
}

export default ReorderableElement;
