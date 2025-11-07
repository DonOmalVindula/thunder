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

import {useState} from 'react';
import {useNavigate} from 'react-router';
import {Box} from '@wso2/oxygen-ui';
import {LoginTemplateType} from '../types/login-flow';
import type {LoginFlow} from '../types/login-flow';
import FlowCard from './FlowCard';

// Dummy data for flows
const DUMMY_FLOWS: LoginFlow[] = [
  {
    id: '1',
    name: 'Email & Password Login',
    description: 'Basic email and password authentication flow',
    template: LoginTemplateType.SIMPLE_LOGIN,
    nodes: [],
    edges: [],
    config: {
      successRedirectUrl: '/dashboard',
      cancelRedirectUrl: '/home',
    },
    createdAt: '2025-01-05T10:30:00Z',
    updatedAt: '2025-01-06T14:20:00Z',
  },
  {
    id: '2',
    name: 'Login with Google',
    description: 'Multi-provider social authentication',
    template: LoginTemplateType.SOCIAL_LOGIN,
    nodes: [],
    edges: [],
    config: {
      successRedirectUrl: '/dashboard',
    },
    createdAt: '2025-01-04T09:15:00Z',
    updatedAt: '2025-01-07T11:45:00Z',
  },
  {
    id: '3',
    name: 'Two-Factor Authentication',
    description: 'Password + OTP verification flow',
    template: LoginTemplateType.MULTI_FACTOR,
    nodes: [],
    edges: [],
    config: {
      successRedirectUrl: '/secure-area',
    },
    createdAt: '2025-01-02T08:45:00Z',
    updatedAt: '2025-01-07T09:10:00Z',
  },
];

/**
 * Flows List Component - Displays all login flows as cards
 */
export default function FlowsList() {
  const navigate = useNavigate();
  const [flows] = useState<LoginFlow[]>(DUMMY_FLOWS);

  const handleEdit = (id: string) => {
    const handler = async () => {
      await navigate(`/flows/login-builder?flowId=${id}`);
    };

    handler().catch(() => {
      // TODO: Handle navigation errors
    });
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    // eslint-disable-next-line no-console
    console.log('Deleting flow:', id);
  };

  const handleDuplicate = (id: string) => {
    // TODO: Implement duplicate functionality
    // eslint-disable-next-line no-console
    console.log('Duplicating flow:', id);
  };

  const handlePreview = (id: string) => {
    // TODO: Implement preview modal
    // eslint-disable-next-line no-console
    console.log('Previewing flow:', id);
  };

  const handleCardClick = (id: string) => {
    handleEdit(id);
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        gap: 3,
      }}
    >
      {flows.map((flow) => (
        <FlowCard
          key={flow.id}
          flow={flow}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          onPreview={handlePreview}
          onClick={handleCardClick}
        />
      ))}
    </Box>
  );
}
