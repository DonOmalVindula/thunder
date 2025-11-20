/*
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import {
  Drawer,
  drawerClasses,
  Box,
  Divider,
  Typography,
  IconButton,
  useTheme,
} from "@wso2/oxygen-ui";
import { Menu as MenuIcon } from "@wso2/oxygen-ui-icons-react";
import { useState, useEffect, useMemo } from "react";
import MenuContent from "./MenuContent";
import SidebarContext from "./SidebarContext";
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from "./constants";

export interface SideMenuProps {
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  disableCollapsible?: boolean;
}

export default function SideMenu({
  expanded: controlledExpanded,
  onExpandedChange,
  disableCollapsible = false,
}: SideMenuProps = {}) {
  const theme = useTheme();
  const [internalExpanded, setInternalExpanded] = useState(true);
  const expanded = controlledExpanded ?? internalExpanded;

  const [isFullyExpanded, setIsFullyExpanded] = useState(expanded);
  const [isFullyCollapsed, setIsFullyCollapsed] = useState(!expanded);

  useEffect(() => {
    if (expanded) {
      const drawerWidthTransitionTimeout = setTimeout(() => {
        setIsFullyExpanded(true);
      }, theme.transitions.duration.enteringScreen);

      return () => clearTimeout(drawerWidthTransitionTimeout);
    }

    setIsFullyExpanded(false);

    return () => {};
  }, [expanded, theme.transitions.duration.enteringScreen]);

  useEffect(() => {
    if (!expanded) {
      const drawerWidthTransitionTimeout = setTimeout(() => {
        setIsFullyCollapsed(true);
      }, theme.transitions.duration.leavingScreen);

      return () => clearTimeout(drawerWidthTransitionTimeout);
    }

    setIsFullyCollapsed(false);

    return () => {};
  }, [expanded, theme.transitions.duration.leavingScreen]);

  const mini = !disableCollapsible && !expanded;

  const handleToggle = () => {
    const newExpanded = !expanded;
    if (onExpandedChange) {
      onExpandedChange(newExpanded);
    } else {
      setInternalExpanded(newExpanded);
    }
  };

  const sidebarContextValue = useMemo(
    () => ({
      mini,
      fullyExpanded: isFullyExpanded,
      fullyCollapsed: isFullyCollapsed,
      hasDrawerTransitions: true,
    }),
    [mini, isFullyExpanded, isFullyCollapsed]
  );

  const drawerWidth = mini ? MINI_DRAWER_WIDTH : DRAWER_WIDTH;

  return (
    <SidebarContext.Provider value={sidebarContextValue}>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          width: drawerWidth,
          flexShrink: 0,
          boxSizing: "border-box",
          whiteSpace: "nowrap",
          transition: (t) =>
            t.transitions.create("width", {
              easing: t.transitions.easing.sharp,
              duration: expanded
                ? t.transitions.duration.enteringScreen
                : t.transitions.duration.leavingScreen,
            }),
          [`& .${drawerClasses.paper}`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            overflowX: "hidden",
            borderRadius: "0 !important",
            transition: (t) =>
              t.transitions.create("width", {
                easing: t.transitions.easing.sharp,
                duration: expanded
                  ? t.transitions.duration.enteringScreen
                  : t.transitions.duration.leavingScreen,
              }),
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            mt: "calc(var(--template-frame-height, 0px) + 4px)",
            py: 1.5,
            px: 2,
            justifyContent: mini ? "center" : "flex-start",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <IconButton
            onClick={handleToggle}
            size="small"
            aria-label="Expand/Collapse sidebar"
          >
            <MenuIcon size={20} />
          </IconButton>
          {!mini && (
            <Typography
              variant="subtitle1"
              sx={{ ml: 1, alignSelf: "center", fontWeight: 400 }}
            >
              ⚡️ Payroll
            </Typography>
          )}
        </Box>
        <Divider />
        <Box
          sx={{
            overflow: "auto",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            scrollbarGutter: mini ? "stable" : "auto",
            overflowX: "hidden",
          }}
        >
          <MenuContent />
        </Box>
      </Drawer>
    </SidebarContext.Provider>
  );
}
