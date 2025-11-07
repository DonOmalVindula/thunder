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

import CommonStepFactory, {
  type CommonStepFactoryPropsInterface,
} from '@/features/flows/components/resources/steps/CommonStepFactory';
import type {Node} from '@xyflow/react';
import type {ReactElement} from 'react';

/**
 * Props interface of {@link StepFactory}
 */
export type StepFactoryPropsInterface = CommonStepFactoryPropsInterface;

/**
 * Factory for creating steps.
 * Extends the {@link CommonStepFactory} component.
 *
 * @param props - Props injected to the component.
 * @returns The StepFactory component.
 */
function StepFactory({resourceId, resources, ...rest}: StepFactoryPropsInterface & Node): ReactElement {
  return <CommonStepFactory resourceId={resourceId} resources={resources} {...rest} />;
}

export default StepFactory;
