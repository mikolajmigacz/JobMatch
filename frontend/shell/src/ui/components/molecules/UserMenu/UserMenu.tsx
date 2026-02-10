'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth.context';
import {
  MenuContainer,
  MenuButton,
  Avatar,
  DropdownMenu,
  MenuItem,
  LogoutButton,
  UserInfo,
  Email,
} from './UserMenu.styles';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!user) return null;

  const initials = user.name
    ? `${user.name[0]}${user.name.split(' ')[1]?.[0] || ''}`.toUpperCase()
    : 'U';

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <MenuContainer ref={menuRef}>
      <MenuButton onClick={() => setOpen(!open)}>
        <Avatar>{initials}</Avatar>
        <span>{user.name || 'User'}</span>
      </MenuButton>

      <DropdownMenu $open={open}>
        <UserInfo>
          <div>{user.name}</div>
          <Email>{user.email}</Email>
        </UserInfo>

        <Link href="/profile" passHref legacyBehavior>
          <MenuItem>My Profile</MenuItem>
        </Link>
        <Link href="/settings" passHref legacyBehavior>
          <MenuItem>Settings</MenuItem>
        </Link>

        <LogoutButton onClick={handleLogout}>Sign Out</LogoutButton>
      </DropdownMenu>
    </MenuContainer>
  );
}
