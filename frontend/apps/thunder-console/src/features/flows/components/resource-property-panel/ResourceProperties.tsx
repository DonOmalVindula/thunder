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

import {Stack, Typography} from '@wso2/oxygen-ui';
import {useReactFlow, type Node as FlowNode} from '@xyflow/react';
import cloneDeep from 'lodash-es/cloneDeep';
import isEmpty from 'lodash-es/isEmpty';
import merge from 'lodash-es/merge';
import set from 'lodash-es/set';
import {useRef, useEffect, useMemo, useCallback, memo, type ReactElement} from 'react';
import ResourcePropertyPanelConstants from '../../constants/ResourcePropertyPanelConstants';
import useFlowConfig from '../../hooks/useFlowConfig';
import useInteractionState from '../../hooks/useInteractionState';
import type {Properties} from '../../models/base';
import type {Element} from '../../models/elements';
import {ElementTypes} from '../../models/elements';
import FlowEventTypes from '../../models/extension';
import type {Resource} from '../../models/resources';
import type {StepData} from '../../models/steps';
import PluginRegistry from '../../plugins/PluginRegistry';

/**
 * Props interface of {@link ResourceProperties}
 */
export interface CommonResourcePropertiesPropsInterface {
  properties?: Properties;
  /**
   * The resource associated with the property.
   */
  resource: Resource;
  /**
   * The event handler for the property change.
   * @param propertyKey - The key of the property.
   * @param newValue - The new value of the property.
   * @param resource - The element associated with the property.
   */
  onChange: (propertyKey: string, newValue: unknown, resource: Resource) => void;
  /**
   * The event handler for the variant change.
   * @param variant - The variant of the element.
   * @param resource - Partial resource properties to override.
   */
  onVariantChange?: (variant: string, resource?: Partial<Resource>) => void;
}

/**
 * Recursively updates a property on a specific element within a component tree.
 */
function updateComponentProperty(
  components: Element[],
  elementId: string,
  propertyKey: string,
  newValue: string | boolean | object,
): Element[] {
  return components.map((component: Element) => {
    if (component.id === elementId) {
      const updated = {...component};

      set(updated, propertyKey, newValue);

      return updated;
    }

    if (component.components) {
      return {
        ...component,
        components: updateComponentProperty(component.components, elementId, propertyKey, newValue),
      };
    }

    return component;
  });
}

/**
 * Component to generate the properties panel for the selected resource.
 *
 * @param props - Props injected to the component.
 * @returns The ResourceProperties component.
 */
function ResourceProperties(): ReactElement {
  const {updateNodeData} = useReactFlow();
  const {lastInteractedResource, setLastInteractedResource, lastInteractedStepId} = useInteractionState();
  const {ResourceProperties: ResourcePropertiesComponent} = useFlowConfig();

  // Use a ref to track the current resource ID for async property change handlers
  const lastInteractedResourceIdRef = useRef<string>(lastInteractedResource?.id);

  const lastInteractedResourceRef = useRef(lastInteractedResource);
  const lastInteractedStepIdRef = useRef(lastInteractedStepId);
  const setLastInteractedResourceRef = useRef(setLastInteractedResource);
  const updateNodeDataRef = useRef(updateNodeData);

  // Keep refs in sync
  useEffect(() => {
    lastInteractedResourceIdRef.current = lastInteractedResource?.id;
    lastInteractedResourceRef.current = lastInteractedResource;
    lastInteractedStepIdRef.current = lastInteractedStepId;
    setLastInteractedResourceRef.current = setLastInteractedResource;
    updateNodeDataRef.current = updateNodeData;
  });

  /**
   * Memoize filtered properties to avoid expensive operations on every render.
   * Only recomputes when lastInteractedResource or lastInteractedStepId changes.
   */
  const filteredProperties = useMemo((): Properties => {
    if (!lastInteractedResource) {
      return {} as Properties;
    }

    const accumulated: Properties = {} as Properties;

    // Extract top-level editable properties (new format)
    // Note: startIcon and endIcon are handled by ButtonExtendedProperties, not displayed here
    const topLevelEditableProps = [
      'label',
      'hint',
      'placeholder',
      'required',
      'src',
      'alt',
      'width',
      'height',
      'items',
      'direction',
      'gap',
      'align',
      'justify',
      'name',
      'size',
      'color',
    ];
    const resourceWithProps = lastInteractedResource as Resource & Record<string, unknown>;
    topLevelEditableProps.forEach((key) => {
      if (resourceWithProps[key] !== undefined && !ResourcePropertyPanelConstants.EXCLUDED_PROPERTIES.includes(key)) {
        (accumulated as Record<string, unknown>)[key] = resourceWithProps[key];
      }
    });

    // Ensure TEXT elements always expose `align` so the dropdown is visible
    // even for elements that were created before `align` was added as a default.
    if (
      lastInteractedResource.type === ElementTypes.Text &&
      (accumulated as Record<string, unknown>).align === undefined
    ) {
      (accumulated as Record<string, unknown>).align = 'left';
    }

    // Also extract from config for backwards compatibility
    if (lastInteractedResource.config) {
      Object.keys(lastInteractedResource.config).forEach((key: string) => {
        if (!ResourcePropertyPanelConstants.EXCLUDED_PROPERTIES.includes(key)) {
          (accumulated as Record<string, unknown>)[key] = (
            lastInteractedResource.config as unknown as Record<string, unknown>
          )[key];
        }
      });
    }

    PluginRegistry.getInstance().executeSync(
      FlowEventTypes.ON_PROPERTY_PANEL_OPEN,
      lastInteractedResource,
      accumulated,
      lastInteractedStepId,
    );

    return cloneDeep(accumulated);
  }, [lastInteractedResource, lastInteractedStepId]);

  const changeSelectedVariant = useCallback((selected: string, element?: Partial<Element>) => {
    const currentResource = lastInteractedResourceRef.current;
    const currentStepId = lastInteractedStepIdRef.current;

    if (!currentResource) return;

    let selectedVariant: Element | undefined = cloneDeep(
      currentResource.variants?.find((resource: Element) => resource.variant === selected),
    );

    if (!selectedVariant) {
      return;
    }

    if (element) {
      selectedVariant = merge(selectedVariant, element);
    }

    // Preserve user-modified properties when changing variants.
    // Variant definitions carry default values for these fields that would
    // overwrite the user's customizations via the merge below.
    const preserveKeys = ['label', 'eventType', 'action', 'startIcon', 'endIcon'] as const;
    for (const key of preserveKeys) {
      const currentValue = (currentResource as unknown as Record<string, unknown>)[key];
      if (currentValue !== undefined) {
        (selectedVariant as unknown as Record<string, unknown>)[key] = currentValue;
      }
    }

    // Preserve the current text value when changing variants
    const currentText = (currentResource.config as {text?: string})?.text;
    if (currentText && selectedVariant.config) {
      (selectedVariant.config as {text?: string}).text = currentText;
    }

    const updateComponent = (components: Element[]): Element[] =>
      components.map((component: Element) => {
        if (component.id === currentResource.id) {
          return merge(cloneDeep(component), selectedVariant);
        }

        if (component.components) {
          return {
            ...component,
            components: updateComponent(component.components),
          };
        }

        return component;
      });

    updateNodeDataRef.current(currentStepId, (node: FlowNode<StepData>) => {
      const components: Element[] = updateComponent(cloneDeep(node?.data?.components) ?? []);

      setLastInteractedResourceRef.current(merge(cloneDeep(currentResource), selectedVariant));

      return {
        components,
      };
    });
  }, []);

  const applyNodeUpdate = useCallback(
    (currentStepId: string, propertyKey: string, newValue: string | boolean | object, element: Element): void => {
      updateNodeDataRef.current(currentStepId, (node: FlowNode<StepData>) => {
        const data: StepData = node?.data ?? {};

        if (!isEmpty(node?.data?.components)) {
          data.components = updateComponentProperty(
            cloneDeep(node?.data?.components) ?? [],
            element.id,
            propertyKey,
            newValue,
          );
        } else if (propertyKey === 'data') {
          return {...(newValue as StepData)};
        } else {
          const actualKey = propertyKey.startsWith('data.') ? propertyKey.slice(5) : propertyKey;
          set(data as Record<string, unknown>, actualKey, newValue);
        }

        return {...data};
      });
    },
    [],
  );

  const applyResourceUpdate = useCallback(
    (propertyKey: string, newValue: string | boolean | object, element: Element): void => {
      const currentResource = lastInteractedResourceRef.current;

      if (propertyKey === 'action' || element.id !== lastInteractedResourceIdRef.current || !currentResource) {
        return;
      }

      const updatedResource: Resource = cloneDeep(currentResource);
      const topLevelEditableProps = [
        'label',
        'hint',
        'placeholder',
        'required',
        'src',
        'alt',
        'width',
        'height',
        'startIcon',
        'endIcon',
        'eventType',
        'items',
        'direction',
        'gap',
        'align',
        'justify',
        'name',
        'size',
        'color',
      ];

      if (propertyKey === 'data') {
        updatedResource.data = newValue as StepData;
      } else if (propertyKey === 'id' || topLevelEditableProps.includes(propertyKey)) {
        set(updatedResource as unknown as Record<string, unknown>, propertyKey, newValue);
      } else if (propertyKey.startsWith('config.') || propertyKey.startsWith('data.')) {
        set(updatedResource, propertyKey, newValue);
      } else {
        set(updatedResource.data as Record<string, unknown>, propertyKey, newValue);
      }

      setLastInteractedResourceRef.current(updatedResource);
    },
    [],
  );

  const handlePropertyChange = useCallback(
    (propertyKey: string, newValue: string | boolean | object, element: Element) => {
      const currentStepId = lastInteractedStepIdRef.current;

      // Apply node and resource updates immediately for responsive UI
      applyNodeUpdate(currentStepId, propertyKey, newValue, element);
      applyResourceUpdate(propertyKey, newValue, element);

      // Run plugins asynchronously — if a plugin intercepts (returns false),
      // it will apply its own modifications to the node data
      void PluginRegistry.getInstance()
        .executeAsync(FlowEventTypes.ON_PROPERTY_CHANGE, propertyKey, newValue, element, currentStepId)
        .then((pluginResult) => {
          if (!pluginResult) {
            // Plugin handled the change — refresh the resource to pick up plugin modifications
            const currentResource = lastInteractedResourceRef.current;
            if (element.id === lastInteractedResourceIdRef.current && currentResource) {
              const refreshedResource: Resource = cloneDeep(currentResource);
              set(refreshedResource as unknown as Record<string, unknown>, propertyKey, newValue);
              setLastInteractedResourceRef.current(refreshedResource);
            }
          }
        });
    },
    [applyNodeUpdate, applyResourceUpdate],
  );

  if (!lastInteractedResource) {
    return (
      <Typography variant="body2" color="textSecondary" sx={{padding: 2}}>
        No properties available.
      </Typography>
    );
  }

  return (
    <Stack gap={2}>
      <ResourcePropertiesComponent
        resource={lastInteractedResource}
        properties={filteredProperties as Record<string, unknown>}
        onChange={handlePropertyChange}
        onVariantChange={changeSelectedVariant}
      />
    </Stack>
  );
}

export default memo(ResourceProperties);
