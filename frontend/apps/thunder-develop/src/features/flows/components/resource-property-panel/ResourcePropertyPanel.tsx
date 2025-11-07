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

import type {HTMLAttributes, ReactElement} from 'react';
import {Box, Button, Drawer, IconButton, type DrawerProps} from '@wso2/oxygen-ui';
import {useReactFlow} from '@xyflow/react';
import classNames from 'classnames';
import {ChevronsRight, TrashIcon} from '@wso2/oxygen-ui-icons-react';
import useFlowBuilderCore from '../../hooks/useFlowBuilderCore';
import ResourceProperties from './ResourceProperties';
import {ResourceTypes} from '../../models/resources';
import {type Element} from '../../models/elements';
import './ResourcePropertyPanel.scss';

/**
 * Props interface of {@link ResourcePropertyPanel}
 */
export interface ResourcePropertyPanelPropsInterface extends DrawerProps, HTMLAttributes<HTMLDivElement> {
  onComponentDelete: (stepId: string, component: Element) => void;
}

/**
 * Component to render the resource property panel.
 *
 * @param props - Props injected to the component.
 * @returns The ResourcePropertyPanel component.
 */
function ResourcePropertyPanel({
  children,
  open,
  anchor = 'right',
  onComponentDelete,
  className,
  ...rest
}: ResourcePropertyPanelPropsInterface): ReactElement {
  const {deleteElements} = useReactFlow();

  const {
    resourcePropertiesPanelHeading,
    setIsOpenResourcePropertiesPanel,
    lastInteractedStepId,
    lastInteractedResource,
  } = useFlowBuilderCore();

  return (
    <Box width="100%" height="100%" id="drawer-container" position="relative" bgcolor="white" component="div" {...rest}>
      {children}
      <Drawer
        open={open}
        anchor={anchor}
        onClose={() => {}}
        elevation={5}
        slotProps={{
          paper: {
            className: classNames(
              'flow-builder-right-panel base',
              open ? 'flow-builder-right-panel open' : 'flow-builder-right-panel close',
              className,
            ),
            style: {position: 'absolute'},
          },
          backdrop: {
            style: {position: 'absolute'},
          },
          transition: {
            onExiting: (node: HTMLElement) => {
              const {style} = node;
              style.transform = 'scaleX(0)';
              style.transformOrigin = 'top left ';
            },
          },
        }}
        ModalProps={{
          container: document.getElementById('drawer-container'),
          keepMounted: true,
          style: {position: 'absolute', pointerEvents: open ? 'auto' : 'none'},
        }}
        sx={{
          pointerEvents: open ? 'auto' : 'none',
        }}
        hideBackdrop
        className={classNames(open ? 'flow-builder-right-panel open' : 'flow-builder-right-panel close')}
        variant="permanent"
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" className="flow-builder-right-panel">
          {resourcePropertiesPanelHeading}
          <IconButton onClick={() => setIsOpenResourcePropertiesPanel(false)}>
            <ChevronsRight height={16} width={16} />
          </IconButton>
        </Box>
        <div className="flow-builder-right-panel content full-height">
          <ResourceProperties />
        </div>
        {lastInteractedResource?.deletable ||
          (lastInteractedResource?.deletable === undefined && (
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="right"
              className="flow-builder-right-panel footer"
            >
              {lastInteractedResource?.deletable ||
                (lastInteractedResource?.deletable === undefined && (
                  <Button
                    variant="outlined"
                    onClick={() => {
                      if (lastInteractedResource.resourceType === ResourceTypes.Step) {
                        // eslint-disable-next-line @typescript-eslint/no-floating-promises
                        deleteElements({nodes: [{id: lastInteractedResource.id}]});
                      } else {
                        onComponentDelete(lastInteractedStepId, lastInteractedResource);
                      }

                      setIsOpenResourcePropertiesPanel(false);
                    }}
                    className="flow-builder-right-panel footer-secondary-action icon-button"
                    color="error"
                  >
                    <TrashIcon size={14} />
                  </Button>
                ))}
            </Box>
          ))}
      </Drawer>
    </Box>
  );
}

export default ResourcePropertyPanel;
