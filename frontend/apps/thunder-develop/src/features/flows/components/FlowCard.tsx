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
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
} from '@wso2/oxygen-ui';
import {MoreVertical, Edit, Trash2, Copy, Eye, Mail, Lock, Phone} from 'lucide-react';
import {useState} from 'react';
import {Google} from '@thunder/ui';
import type {LoginFlow} from '../types/login-flow';
import {LoginTemplateType} from '../types/login-flow';

interface FlowCardProps {
  flow: LoginFlow;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onPreview: (id: string) => void;
  onClick: (id: string) => void;
}

const templateColors: Record<
  LoginTemplateType,
  'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'
> = {
  [LoginTemplateType.SIMPLE_LOGIN]: 'default',
  [LoginTemplateType.SOCIAL_LOGIN]: 'info',
  [LoginTemplateType.ENTERPRISE_SSO]: 'secondary',
  [LoginTemplateType.MULTI_FACTOR]: 'warning',
  [LoginTemplateType.PASSWORDLESS]: 'success',
};

const templateLabels: Record<LoginTemplateType, string> = {
  [LoginTemplateType.SIMPLE_LOGIN]: 'Simple Login',
  [LoginTemplateType.SOCIAL_LOGIN]: 'Social Login',
  [LoginTemplateType.ENTERPRISE_SSO]: 'Enterprise SSO',
  [LoginTemplateType.MULTI_FACTOR]: 'Multi-Factor',
  [LoginTemplateType.PASSWORDLESS]: 'Passwordless',
};

/**
 * Renders a minified UI representation of the flow
 */
function FlowVisualization({template}: {template?: LoginTemplateType}) {
  switch (template) {
    case LoginTemplateType.SIMPLE_LOGIN:
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            py: 8,
            px: 6,
            bgcolor: 'background.default',
            borderRadius: 1,
            zoom: 0.7,
          }}
        >
          <TextField
            value="thor@thunder.com"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={16} />
                  </InputAdornment>
                ),
                readOnly: true,
              },
            }}
            fullWidth
          />
          <TextField
            value="********"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={16} />
                  </InputAdornment>
                ),
                readOnly: true,
              },
            }}
            fullWidth
          />
          <Button variant="contained" sx={{marginTop: 1, padding: 2.5}} fullWidth />
        </Box>
      );

    case LoginTemplateType.SOCIAL_LOGIN:
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            py: 8,
            px: 6,
            bgcolor: 'background.default',
            borderRadius: 1,
            zoom: 0.7,
          }}
        >
          <Button variant="outlined" fullWidth startIcon={<Google />} sx={{padding: 1}}>
            Continue with Google
          </Button>
          <Divider sx={{borderColor: 'grey.400'}}>
            <Typography variant="caption" fontSize={12} color="grey.400">
              OR
            </Typography>
          </Divider>
          <TextField
            value="thor@thunder.com"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={16} />
                  </InputAdornment>
                ),
                readOnly: true,
              },
            }}
            fullWidth
          />
          <TextField
            value="********"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={16} />
                  </InputAdornment>
                ),
                readOnly: true,
              },
            }}
            fullWidth
          />
          <Button variant="contained" sx={{marginTop: 1, padding: 2.5}} fullWidth />
        </Box>
      );

    case LoginTemplateType.MULTI_FACTOR:
      return (
        <>
          {/* Background Card - Email/Password */}
          <Box
            sx={{
              position: 'absolute',
              top: -30,
              left: 40,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              py: 8,
              px: 6,
              bgcolor: 'background.default',
              borderRadius: 1,
              opacity: 0.6,
              zoom: 0.7,
            }}
          >
            <TextField
              value="thor@thunder.com"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={16} />
                    </InputAdornment>
                  ),
                  readOnly: true,
                },
              }}
              fullWidth
            />
            <TextField
              value="********"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={16} />
                    </InputAdornment>
                  ),
                  readOnly: true,
                },
              }}
              fullWidth
            />
            <Button variant="contained" sx={{marginTop: 1, padding: 2.5}} fullWidth />
          </Box>

          {/* Foreground Card - OTP */}
          <Box
            sx={{
              position: 'absolute',
              top: 50,
              right: 40,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              py: 8,
              px: 6,
              bgcolor: 'background.default',
              borderRadius: 1,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              zoom: 0.7,
            }}
          >
            {/* 4 separate OTP input boxes */}
            <Typography variant="body2" color="text.secondary">
              Enter OTP
            </Typography>
            <Box sx={{display: 'flex', gap: 0.5, justifyContent: 'center'}}>
              <TextField
                value="1"
                slotProps={{
                  input: {
                    readOnly: true,
                    sx: {
                      textAlign: 'center',
                      width: '30px',
                      height: '30px',
                      padding: 0,
                    },
                  },
                }}
                sx={{
                  width: '30px',
                  '& .MuiInputBase-input': {
                    textAlign: 'center',
                    padding: '6px 0',
                    fontSize: '0.875rem',
                  },
                }}
              />
              <TextField
                value="2"
                slotProps={{
                  input: {
                    readOnly: true,
                    sx: {
                      textAlign: 'center',
                      width: '30px',
                      height: '30px',
                      padding: 0,
                    },
                  },
                }}
                sx={{
                  width: '30px',
                  '& .MuiInputBase-input': {
                    textAlign: 'center',
                    padding: '6px 0',
                    fontSize: '0.875rem',
                  },
                }}
              />
              <TextField
                value="3"
                slotProps={{
                  input: {
                    readOnly: true,
                    sx: {
                      textAlign: 'center',
                      width: '30px',
                      height: '30px',
                      padding: 0,
                    },
                  },
                }}
                sx={{
                  width: '30px',
                  '& .MuiInputBase-input': {
                    textAlign: 'center',
                    padding: '6px 0',
                    fontSize: '0.875rem',
                  },
                }}
              />
              <TextField
                value="4"
                slotProps={{
                  input: {
                    readOnly: true,
                    sx: {
                      textAlign: 'center',
                      width: '30px',
                      height: '30px',
                      padding: 0,
                    },
                  },
                }}
                sx={{
                  width: '30px',
                  '& .MuiInputBase-input': {
                    textAlign: 'center',
                    padding: '6px 0',
                    fontSize: '0.875rem',
                  },
                }}
              />
            </Box>
            <Button variant="contained" sx={{marginTop: 1, padding: 2.5}} fullWidth />
          </Box>
        </>
      );

    default:
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            py: 8,
            px: 6,
            bgcolor: 'background.paper',
            borderRadius: 1,
            zoom: 0.7,
          }}
        >
          <TextField
            placeholder="Email"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={16} />
                  </InputAdornment>
                ),
                readOnly: true,
              },
            }}
            fullWidth
          />
          <TextField
            placeholder="Password"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={16} />
                  </InputAdornment>
                ),
                readOnly: true,
              },
            }}
            fullWidth
          />
          <Button variant="contained" sx={{marginTop: 1, padding: 2.5}} fullWidth />
        </Box>
      );
  }
}

/**
 * Flow Card Component - Displays a single flow as a card
 */
export default function FlowCard({flow, onEdit, onDelete, onDuplicate, onPreview, onClick}: FlowCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (event: React.MouseEvent, action: (id: string) => void) => {
    event.stopPropagation();
    action(flow.id);
    handleClose();
  };

  const handleCardClick = () => {
    onClick(flow.id);
  };

  return (
    <Card
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          transform: 'translateY(-4px)',
          borderColor: 'primary.main',
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
        {/* Header */}
        <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2}}>
          <Box sx={{flex: 1, pr: 1}}>
            <Typography variant="h6" sx={{fontSize: '1.1rem', fontWeight: 600, mb: 0.5}}>
              {flow.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{mb: 1.5, lineHeight: 1.5}}>
              {flow.description}
            </Typography>
            {flow.template && (
              <Chip
                label={templateLabels[flow.template]}
                color={templateColors[flow.template]}
                size="small"
                sx={{fontWeight: 500}}
              />
            )}
          </Box>
          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <MoreVertical size={18} />
          </IconButton>
        </Box>

        {/* Flow Visualization */}
        <Box sx={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
          <FlowVisualization template={flow.template} />
        </Box>
      </CardContent>

      {/* Actions Menu */}
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={(e) => handleMenuItemClick(e, onEdit)}>
          <ListItemIcon>
            <Edit size={18} />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => handleMenuItemClick(e, onPreview)}>
          <ListItemIcon>
            <Eye size={18} />
          </ListItemIcon>
          <ListItemText>Preview</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => handleMenuItemClick(e, onDuplicate)}>
          <ListItemIcon>
            <Copy size={18} />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        <MenuItem onClick={(e) => handleMenuItemClick(e, onDelete)}>
          <ListItemIcon>
            <Trash2 size={18} />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
}
