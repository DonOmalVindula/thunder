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
  Autocomplete,
  FormHelperText,
  FormLabel,
  Stack,
  TextField,
  type AutocompleteRenderInputParams,
} from '@wso2/oxygen-ui';
import {useMemo, type ReactNode, type SyntheticEvent} from 'react';
import {useTranslation} from 'react-i18next';
import type {CommonResourcePropertiesPropsInterface} from '@/features/flows/components/resource-property-panel/ResourceProperties';
import useValidationStatus from '@/features/flows/hooks/useValidationStatus';
import {ElementTypes, type Element} from '@/features/flows/models/elements';

/**
 * Props interface of {@link FieldExtendedProperties}
 */
export type FieldExtendedPropertiesPropsInterface = CommonResourcePropertiesPropsInterface;

/**
 * Extended properties for the field elements.
 *
 * @param props - Props injected to the component.
 * @returns The FieldExtendedProperties component.
 */
function FieldExtendedProperties({resource, onChange}: FieldExtendedPropertiesPropsInterface): ReactNode {
  const {t} = useTranslation();
  const {selectedNotification} = useValidationStatus();

  const attributes: string[] = useMemo(() => ['email', 'username', 'given_name'], []);
  const credentialAttributes: string[] = useMemo(() => ['password', 'pin', 'secret'], []);

  const resourceRef = (resource as Element & {ref?: string})?.ref ?? null;

  /**
   * Get the error message for the ref field.
   */
  const errorMessage: string = useMemo(() => {
    const key = `${resource?.id}_ref`;

    if (selectedNotification?.hasResourceFieldNotification(key)) {
      return selectedNotification?.getResourceFieldNotification(key);
    }

    return '';
  }, [resource, selectedNotification]);

  return (
    <Stack>
      <Autocomplete
        freeSolo={resource.type !== ElementTypes.PasswordInput}
        disablePortal
        key={resource.id}
        options={(resource.type === ElementTypes.PasswordInput ? credentialAttributes : attributes) ?? []}
        getOptionLabel={(attribute: string) => attribute}
        sx={{width: '100%'}}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <>
            <FormLabel htmlFor="attribute-select">{t('flows:core.fieldExtendedProperties.attribute')}</FormLabel>
            <TextField
              {...params}
              id="attribute-select"
              placeholder={t('flows:core.fieldExtendedProperties.selectAttribute')}
              error={!!errorMessage}
            />
          </>
        )}
        value={resourceRef}
        onChange={(_: SyntheticEvent, attribute: string | null) => {
          onChange('ref', attribute ?? '', resource);
        }}
        onInputChange={(_: SyntheticEvent, value: string, reason: string) => {
          if (reason === 'input') {
            onChange('ref', value, resource);
          }
        }}
      />
      {errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
    </Stack>
  );
}

export default FieldExtendedProperties;
