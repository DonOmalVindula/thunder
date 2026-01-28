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

import {useState, useMemo, type JSX, type FormEvent, type ChangeEvent} from 'react';
import {useNavigate} from 'react-router';
import {
  Box,
  Stack,
  Typography,
  Button,
  TextField,
  Alert,
  IconButton,
  LinearProgress,
  FormControl,
  FormLabel,
  Chip,
  useTheme,
  Autocomplete,
} from '@wso2/oxygen-ui';
import {X, Lightbulb} from '@wso2/oxygen-ui-icons-react';
import {useTranslation} from 'react-i18next';
import {useLogger} from '@thunder/logger/react';
import useCreateOrganizationUnit from '../api/useCreateOrganizationUnit';
import useGetOrganizationUnits from '../api/useGetOrganizationUnits';
import type {CreateOrganizationUnitRequest, OrganizationUnit} from '../types/organization-units';
import generateOUNameSuggestions from '../utils/generateOUNameSuggestions';

export default function CreateOrganizationUnitPage(): JSX.Element {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const theme = useTheme();
  const logger = useLogger('CreateOrganizationUnitPage');
  const createOrganizationUnit = useCreateOrganizationUnit();
  const {data: organizationUnitsData} = useGetOrganizationUnits();

  const [handle, setHandle] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [parentOU, setParentOU] = useState<OrganizationUnit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHandleManuallyEdited, setIsHandleManuallyEdited] = useState<boolean>(false);

  const nameSuggestions: string[] = useMemo((): string[] => generateOUNameSuggestions(), []);
  const availableParentOUs: OrganizationUnit[] = useMemo(
    () => organizationUnitsData?.organizationUnits ?? [],
    [organizationUnitsData],
  );

  /**
   * Generates a handle from the name by lowercasing and replacing spaces with hyphens.
   */
  const generateHandleFromName = (nameValue: string): string =>
    nameValue.toLowerCase().replace(/\s+/g, '-');

  const handleClose = (): void => {
    (async (): Promise<void> => {
      await navigate('/organization-units');
    })().catch((_error: unknown) => {
      logger.error('Failed to navigate back to organization units list', {error: _error});
    });
  };

  const handleNameChange = (newName: string): void => {
    setName(newName);
    // Auto-generate handle if user hasn't manually edited it
    if (!isHandleManuallyEdited) {
      setHandle(generateHandleFromName(newName));
    }
  };

  const handleHandleChange = (newHandle: string): void => {
    setHandle(newHandle);
    setIsHandleManuallyEdited(true);
  };

  const handleNameSuggestionClick = (suggestion: string): void => {
    setName(suggestion);
    // Auto-generate handle from suggestion if user hasn't manually edited it
    if (!isHandleManuallyEdited) {
      setHandle(generateHandleFromName(suggestion));
    }
  };

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    setError(null);

    const data: CreateOrganizationUnitRequest = {
      handle: handle.trim(),
      name: name.trim(),
      description: description.trim() || null,
      parent: parentOU?.id ?? null,
    };

    createOrganizationUnit.mutate(data, {
      onSuccess: () => {
        (async (): Promise<void> => {
          await navigate('/organization-units');
        })().catch((_error: unknown) => {
          logger.error('Failed to navigate after creating organization unit', {error: _error});
        });
      },
      onError: (err: Error) => {
        setError(err.message ?? t('organizationUnits:create.error'));
      },
    });
  };

  const isFormValid = handle.trim() && name.trim();

  return (
    <Box sx={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      {/* Progress bar at the very top - single step so 100% */}
      <LinearProgress variant="determinate" value={100} sx={{height: 6}} />

      <Box sx={{flex: 1, display: 'flex', flexDirection: 'row'}}>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header with close button */}
          <Box sx={{p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <IconButton
                onClick={handleClose}
                sx={{
                  bgcolor: 'background.paper',
                  '&:hover': {bgcolor: 'action.hover'},
                  boxShadow: 1,
                }}
              >
                <X size={24} />
              </IconButton>
              <Typography variant="h5">{t('organizationUnits:create.title')}</Typography>
            </Stack>
          </Box>

          {/* Main content */}
          <Box sx={{flex: 1, display: 'flex', minHeight: 0}}>
            {/* Left side - Form content */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                py: 8,
                px: 20,
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  maxWidth: 800,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Error Alert */}
                {error && (
                  <Alert severity="error" sx={{my: 3}} onClose={() => setError(null)}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Stack direction="column" spacing={4}>
                    {/* Large heading - matching application create style */}
                    <Typography variant="h1" gutterBottom>
                      {t('organizationUnits:create.heading')}
                    </Typography>

                    {/* Name field first */}
                    <FormControl fullWidth required>
                      <FormLabel htmlFor="ou-name-input">{t('organizationUnits:form.name')}</FormLabel>
                      <TextField
                        fullWidth
                        id="ou-name-input"
                        value={name}
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => handleNameChange(e.target.value)}
                        placeholder={t('organizationUnits:form.namePlaceholder')}
                      />
                    </FormControl>

                    {/* Name suggestions */}
                    <Stack direction="column" spacing={2}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Lightbulb size={20} color={theme.vars?.palette.warning.main} />
                        <Typography variant="body2" color="text.secondary">
                          {t('organizationUnits:create.suggestions.label')}
                        </Typography>
                      </Stack>
                      <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                        {nameSuggestions.map(
                          (suggestion: string): JSX.Element => (
                            <Chip
                              key={suggestion}
                              label={suggestion}
                              onClick={(): void => handleNameSuggestionClick(suggestion)}
                              variant="outlined"
                              clickable
                              sx={{
                                '&:hover': {
                                  bgcolor: 'primary.main',
                                  color: 'primary.contrastText',
                                  borderColor: 'primary.main',
                                },
                              }}
                            />
                          ),
                        )}
                      </Box>
                    </Stack>

                    {/* Handle field */}
                    <FormControl fullWidth required>
                      <FormLabel htmlFor="ou-handle-input">{t('organizationUnits:form.handle')}</FormLabel>
                      <TextField
                        fullWidth
                        id="ou-handle-input"
                        value={handle}
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => handleHandleChange(e.target.value)}
                        placeholder={t('organizationUnits:form.handlePlaceholder')}
                        helperText={t('organizationUnits:form.handleHelperText')}
                      />
                    </FormControl>

                    {/* Description field */}
                    <FormControl fullWidth>
                      <FormLabel htmlFor="ou-description-input">{t('organizationUnits:form.description')}</FormLabel>
                      <TextField
                        fullWidth
                        id="ou-description-input"
                        value={description}
                        onChange={(e: ChangeEvent<HTMLInputElement>): void => setDescription(e.target.value)}
                        placeholder={t('organizationUnits:form.descriptionPlaceholder')}
                        multiline
                        rows={3}
                      />
                    </FormControl>

                    {/* Parent OU field */}
                    <FormControl fullWidth>
                      <FormLabel htmlFor="ou-parent-input">{t('organizationUnits:form.parent')}</FormLabel>
                      <Autocomplete
                        id="ou-parent-input"
                        options={availableParentOUs}
                        getOptionLabel={(option: OrganizationUnit) => option.name}
                        value={parentOU}
                        onChange={(_event, newValue: OrganizationUnit | null) => setParentOU(newValue)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t('organizationUnits:form.parentPlaceholder')}
                            helperText={t('organizationUnits:form.parentHelperText')}
                          />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                      />
                    </FormControl>

                    {/* Navigation buttons */}
                    <Box
                      sx={{
                        mt: 4,
                        display: 'flex',
                        justifyContent: 'flex-start',
                        gap: 2,
                      }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={createOrganizationUnit.isPending || !isFormValid}
                        sx={{minWidth: 100}}
                      >
                        {createOrganizationUnit.isPending ? t('common:status.saving') : t('common:actions.create')}
                      </Button>
                    </Box>
                  </Stack>
                </form>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
