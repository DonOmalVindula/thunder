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
  Avatar,
  ColorSchemeToggle,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@wso2/oxygen-ui";
import {
  Bell,
  User,
  Mail,
  Settings,
  LogOut,
} from "@wso2/oxygen-ui-icons-react";
import { useAsgardeo, SignOutButton } from "@asgardeo/react";
import { useState } from "react";

export default function Header() {
  const { user, signIn } = useAsgardeo();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    setProfileModalOpen(true);
    handleMenuClose();
  };

  const handleProfileModalClose = () => {
    setProfileModalOpen(false);
  };

  const username =
    (user?.username as string) || (user?.email as string) || "User";
  const getInitials = (name: string) => {
    const parts = name.split(/[@._\s]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Format user info for display
  const getUserInfoItems = () => {
    if (!user) return [];

    const excludeKeys = ["picture", "updated_at"];
    return Object.entries(user)
      .filter(([key]) => !excludeKeys.includes(key))
      .map(([key, value]) => ({
        label: key
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        value: String(value),
      }));
  };

  return (
    <Stack
      component="header"
      direction="row"
      sx={{
        width: "100%",
        height: "58px",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        borderBottom: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        position: "sticky",
        top: 0,
        zIndex: 1100,
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        Welcome, {username}
      </Typography>
      <Stack direction="row" sx={{ gap: 0.5, alignItems: "center" }}>
        <Tooltip title="Notifications">
          <IconButton aria-label="Open notifications" size="small">
            <Bell size={18} strokeWidth={1.5} />
          </IconButton>
        </Tooltip>
        <ColorSchemeToggle data-testid="theme-toggle" size="small" />
        <Tooltip title="Account">
          <IconButton
            onClick={handleMenuOpen}
            sx={{ p: 0.5, ml: 0.5 }}
            aria-controls={menuOpen ? "user-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? "true" : undefined}
          >
            <Avatar sx={{ width: 28, height: 28, fontSize: "0.875rem" }}>
              {getInitials(username)}
            </Avatar>
          </IconButton>
        </Tooltip>
        <Menu
          id="user-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          sx={{
            mt: 1,
            "& .MuiPaper-root": {
              minWidth: 240,
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {username}
            </Typography>
            {user?.email && (
              <Typography variant="caption" color="text.secondary">
                {String(user.email)}
              </Typography>
            )}
          </Box>
          <Divider />
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <User size={16} />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Mail size={16} />
            </ListItemIcon>
            <ListItemText>Messages</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Settings size={16} />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <SignOutButton>
            {({ signOut, isLoading }) => (
              <MenuItem
                onClick={async () => {
                  await signOut();
                  await signIn();
                }}
                disabled={isLoading}
              >
                <ListItemIcon>
                  <LogOut size={16} />
                </ListItemIcon>
                <ListItemText>Sign Out</ListItemText>
              </MenuItem>
            )}
          </SignOutButton>
        </Menu>
      </Stack>

      {/* Profile Modal */}
      <Dialog
        open={profileModalOpen}
        onClose={handleProfileModalClose}
        maxWidth="sm"
        fullWidth
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.9)",
            },
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ width: 56, height: 56, bgcolor: "primary.main" }}>
              {getInitials(username)}
            </Avatar>
            <Box>
              <Typography variant="h6">{username}</Typography>
              {user?.email && (
                <Typography variant="body2" color="text.secondary">
                  {String(user.email)}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              User Information
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {getUserInfoItems().map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    bgcolor: "action.hover",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 0.5, wordBreak: "break-word" }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProfileModalClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
