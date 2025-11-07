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

import type {Node, Edge} from '@xyflow/react';

/**
 * Login component types available in the builder
 */
export enum LoginComponentType {
  // Identity & Credentials
  EMAIL_INPUT = 'email-input',
  USERNAME_INPUT = 'username-input',
  PASSWORD_INPUT = 'password-input',
  PHONE_INPUT = 'phone-input',
  OTP_INPUT = 'otp-input',

  // Authentication Methods
  GOOGLE_BUTTON = 'google-button',
  FACEBOOK_BUTTON = 'facebook-button',
  GITHUB_BUTTON = 'github-button',
  MICROSOFT_BUTTON = 'microsoft-button',
  SSO_BUTTON = 'sso-button',

  // Actions & Navigation
  SUBMIT_BUTTON = 'submit-button',
  FORGOT_PASSWORD_LINK = 'forgot-password-link',
  SIGNUP_LINK = 'signup-link',
  REMEMBER_ME_CHECKBOX = 'remember-me-checkbox',
  TRUST_DEVICE_CHECKBOX = 'trust-device-checkbox',
}

/**
 * Login template types
 */
export enum LoginTemplateType {
  SIMPLE_LOGIN = 'simple-login',
  SOCIAL_LOGIN = 'social-login',
  ENTERPRISE_SSO = 'enterprise-sso',
  MULTI_FACTOR = 'multi-factor',
  PASSWORDLESS = 'passwordless',
}

/**
 * Component configuration interface
 */
export interface ComponentConfig {
  label?: string;
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    customMessage?: string;
  };
}

/**
 * Login flow node data
 */
export interface LoginFlowNodeData {
  type: LoginComponentType;
  label: string;
  config?: ComponentConfig;
  icon?: string;
}

/**
 * Login flow node
 */
export type LoginFlowNode = Node<LoginFlowNodeData>;

/**
 * Login flow edge
 */
export type LoginFlowEdge = Edge;

/**
 * Login flow definition
 */
export interface LoginFlow {
  id: string;
  name: string;
  description?: string;
  template?: LoginTemplateType;
  nodes: LoginFlowNode[];
  edges: LoginFlowEdge[];
  config: {
    successRedirectUrl?: string;
    cancelRedirectUrl?: string;
    theme?: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Editor mode
 */
export enum EditorMode {
  EDIT = 'edit',
  PREVIEW = 'preview',
}

/**
 * Component library item
 */
export interface ComponentLibraryItem {
  type: LoginComponentType;
  label: string;
  description: string;
  icon: string;
  category: 'identity' | 'social' | 'actions';
  defaultConfig?: ComponentConfig;
}

/**
 * Login template definition
 */
export interface LoginTemplate {
  type: LoginTemplateType;
  name: string;
  description: string;
  thumbnail?: string;
  nodes: LoginFlowNode[];
  edges: LoginFlowEdge[];
}
