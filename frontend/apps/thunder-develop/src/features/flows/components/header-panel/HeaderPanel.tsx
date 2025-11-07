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

import {type HTMLAttributes, type ReactElement} from 'react';
import {useNavigate} from 'react-router';
import {
  Box,
  Button,
  Card,
  type CardProps,
  ColorSchemeToggle,
  IconButton,
  Stack,
  Typography,
  Tooltip,
} from '@wso2/oxygen-ui';
import {
  ArrowLeftIcon,
  CircleHelpIcon,
  HistoryIcon,
  InfoIcon,
  MoreVerticalIcon,
  SaveIcon,
  LayoutTemplate,
} from '@wso2/oxygen-ui-icons-react';
import ValidationStatusLabels from '../validation-panel/ValidationStatusLabels';

/**
 * Props interface of {@link HeaderPanel}
 */
export interface HeaderPanelPropsInterface extends Omit<CardProps, 'open' | 'title'>, HTMLAttributes<HTMLDivElement> {
  /**
   * Title to display in the header.
   */
  title?: string;
  /**
   * Callback to be triggered when back button is clicked.
   */
  onBack?: () => void;
  /**
   * Callback to be triggered when save button is clicked.
   */
  onSave?: () => void;
  /**
   * Callback to be triggered when auto-layout button is clicked.
   */
  onAutoLayout?: () => void;
}

/**
 * Flow builder header panel that appears at the top.
 *
 * @param props - Props injected to the component.
 * @returns The HeaderPanel component.
 */
function HeaderPanel({
  children,
  title = 'Login Flow',
  onBack = undefined,
  onSave = undefined,
  onAutoLayout = undefined,
  ...rest
}: HeaderPanelPropsInterface): ReactElement {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBack) {
      onBack();
      return;
    }

    // Go back to the flows list
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    navigate('/flows');
  };

  return (
    <Box width="100%" height="100%" position="absolute" {...rest}>
      {children}
      <Card
        elevation={1}
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          right: 8,
          zIndex: 1,
          borderRadius: 0.5,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          px: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} width="100%">
          {/* Left section - Back button and title */}
          <Stack direction="row" alignItems="center">
            <Button onClick={handleBackClick} startIcon={<ArrowLeftIcon size={20} />}>
              Go back to Flows
            </Button>
          </Stack>

          <Typography variant="h4">{title}</Typography>

          {/* Right section - Action buttons */}
          <Stack direction="row" alignItems="center" spacing={1} ml="auto">
            <ValidationStatusLabels />
            <Tooltip title="History">
              <IconButton size="small">
                <HistoryIcon size={20} />
              </IconButton>
            </Tooltip>
            {onAutoLayout && (
              <Tooltip title="Auto Layout">
                <IconButton size="small" onClick={onAutoLayout}>
                  <LayoutTemplate size={20} />
                </IconButton>
              </Tooltip>
            )}
            <ColorSchemeToggle data-testid="theme-toggle" />
            <Button variant="contained" startIcon={<SaveIcon size={20} />} onClick={onSave}>
              Save
            </Button>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}

export default HeaderPanel;
