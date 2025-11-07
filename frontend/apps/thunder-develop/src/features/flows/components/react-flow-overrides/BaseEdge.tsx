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

import {
  BaseEdge as XYFlowBaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';
import {useEffect, useState, type ReactElement, type SyntheticEvent} from 'react';
import {Trash} from '@wso2/oxygen-ui-icons-react';

/**
 * Props interface of {@link VisualFlow}
 */
export type BaseEdgePropsInterface = EdgeProps;

/**
 * A customized version of the BaseEdge component.
 *
 * @param props - Props injected to the component.
 * @returns BaseEdge component.
 */
function BaseEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  style,
  selected,
  deletable,
  // Destructure these to prevent them from being passed to DOM elements
  animated: _animated,
  selectable: _selectable,
  sourceHandleId: _sourceHandleId,
  targetHandleId: _targetHandleId,
  pathOptions: _pathOptions,
  ...rest
}: BaseEdgePropsInterface): ReactElement {
  const {deleteElements} = useReactFlow();
  const [isEdgeSelected, setIsEdgeSelected] = useState<boolean>(false);

  useEffect(() => {
    setIsEdgeSelected(selected ?? false);
  }, [selected]);

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent): void => {
      const target: HTMLElement = event.target as HTMLElement;

      if (!target.closest(`[id="${id}"]`) && !target.closest('.edge-label-renderer__deletable-edge')) {
        setIsEdgeSelected(false);
      }
    };

    if (isEdgeSelected) {
      document.addEventListener('click', handleGlobalClick);

      return () => document.removeEventListener('click', handleGlobalClick);
    }

    return undefined;
  }, [isEdgeSelected, id]);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourcePosition,
    sourceX,
    sourceY,
    targetPosition,
    targetX,
    targetY,
    curvature: 0.1, // Very low curvature for nearly straight lines
  });

  const handleDelete = (event: SyntheticEvent) => {
    event.stopPropagation();
    deleteElements({edges: [{id}]}).catch(() => {});
  };

  const handleDeleteKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      deleteElements({edges: [{id}]}).catch(() => {});
    }
  };

  const handleEdgeClick = (event: SyntheticEvent) => {
    event.stopPropagation();
    setIsEdgeSelected(!isEdgeSelected);
  };

  return (
    <>
      <g onClick={handleEdgeClick}>
        <XYFlowBaseEdge
          id={id}
          path={edgePath}
          style={{
            ...style,
            pointerEvents: 'all',
          }}
          {...rest}
        />
      </g>
      <EdgeLabelRenderer>
        <div
          style={{
            pointerEvents: 'all',
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
          className="edge-label-renderer__deletable-edge nodrag nopan"
        >
          {label}
          {isEdgeSelected && deletable && (
            <div
              className="edge-delete-button"
              onClick={handleDelete}
              onKeyDown={handleDeleteKeyDown}
              role="button"
              tabIndex={0}
              style={{
                pointerEvents: 'all',
              }}
            >
              <Trash size={14} />
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default BaseEdge;
