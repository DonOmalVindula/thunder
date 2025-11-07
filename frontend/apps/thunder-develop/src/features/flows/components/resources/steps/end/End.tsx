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

import type {ReactElement} from 'react';
import useFlowBuilderCore from '@/features/flows/hooks/useFlowBuilderCore';
import {useNodeId} from '@xyflow/react';
import {useTranslation} from 'react-i18next';
import VisualFlowConstants from '@/features/flows/constants/VisualFlowConstants';
import {Avatar, Stack, Typography} from '@wso2/oxygen-ui';
import resolveStaticResourcePath from '@/features/flows/utils/resolveStaticResourcePath';
import type {StepData} from '@/features/flows/models/steps';
import type {CommonStepFactoryPropsInterface} from '../CommonStepFactory';
import View from '../view/View';
import './End.scss';

/**
 * Props interface of {@link End}
 */
export interface EndPropsInterface extends Pick<CommonStepFactoryPropsInterface, 'resources'> {
  /**
   * Custom data for the end node. Defaults to undefined.
   */
  data?: StepData;
  /**
   * Custom heading for the end node. Defaults to "End".
   */
  heading?: string;
  /**
   * Custom restricted component types that are not allowed in the end node.
   */
  restrictedComponentTypes?: string[];
}

/**
 * End Node component that composes with View and applies restrictions.
 * End nodes typically don't allow certain flow control components and don't have source handles.
 *
 * @param props - Props injected to the component.
 * @returns End node component.
 */
function End({
  heading = 'End',
  restrictedComponentTypes = [],
  data = undefined,
  resources,
}: EndPropsInterface): ReactElement {
  const {t} = useTranslation();
  const stepId: string | null = useNodeId();
  const {setLastInteractedResource, setLastInteractedStepId, setResourcePropertiesPanelHeading} = useFlowBuilderCore();

  /**
   * Get allowed types by filtering out restricted types from the default allowed types.
   *
   * @returns Array of allowed component types for the end node droppable area.
   */
  const getAllowedTypes = (): string[] => {
    const allowedTypes: string[] = VisualFlowConstants.FLOW_BUILDER_FLOW_COMPLETION_VIEW_ALLOWED_RESOURCE_TYPES;

    return allowedTypes.filter((type: string) => !restrictedComponentTypes.includes(type));
  };

  return (
    <View
      heading={heading}
      droppableAllowedTypes={getAllowedTypes()}
      enableSourceHandle={false}
      data={data}
      resources={resources}
      className="flow-builder-end-step"
      deletable={false}
      configurable
      onConfigure={(): void => {
        if (!resources || resources.length === 0 || !stepId) {
          return;
        }

        setLastInteractedStepId(stepId);

        setLastInteractedResource({
          ...resources[0],
          config: {
            ...(resources[0]?.config || {}),
            ...(typeof data?.config === 'object' && data?.config !== null ? data.config : {}),
          },
        });

        // Override the property panel heading.
        setResourcePropertiesPanelHeading(
          <Stack direction="row" className="sub-title" gap={1} alignItems="center">
            <Avatar src={resolveStaticResourcePath(resources[0]?.display?.image)} variant="square" />
            <Typography variant="h5">{t('flows:core.steps.end.flowCompletionProperties')}</Typography>
          </Stack>,
        );
      }}
    />
  );
}

export default End;
