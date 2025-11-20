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
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
} from "@wso2/oxygen-ui";
import {
  BarChart,
  Calendar,
  DollarSign,
  FileText,
  LayoutGrid,
  Settings,
  UsersRound,
} from "@wso2/oxygen-ui-icons-react";
import { useContext, useMemo } from "react";
import SidebarContext from "./SidebarContext";

export default function MenuContent() {
  const { mini } = useContext(SidebarContext);

  const mainListItems = useMemo(
    () => [
      {
        id: "dashboard",
        text: "Dashboard",
        icon: <LayoutGrid size={16} />,
      },
      {
        id: "employees",
        text: "Employees",
        icon: <UsersRound size={16} />,
      },
      {
        id: "payroll",
        text: "Payroll",
        icon: <DollarSign size={16} />,
      },
      {
        id: "attendance",
        text: "Attendance",
        icon: <Calendar size={16} />,
      },
      {
        id: "reports",
        text: "Reports",
        icon: <BarChart size={16} />,
      },
      {
        id: "payslips",
        text: "Payslips",
        icon: <FileText size={16} />,
      },
      {
        id: "settings",
        text: "Settings",
        icon: <Settings size={16} />,
      },
    ],
    []
  );

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ display: "block" }}>
            <Tooltip title={mini ? item.text : ""} placement="right">
              <ListItemButton
                selected={item.id === "dashboard"}
                sx={{
                  minHeight: 38,
                  justifyContent: mini ? "center" : "initial",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: mini ? "auto" : 3,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    opacity: mini ? 0 : 1,
                    display: mini ? "none" : "block",
                  }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
