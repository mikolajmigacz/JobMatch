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
  const [imgError, setImgError] = useState(false);
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

  const logoUrl =
    'companyLogoUrl' in user
      ? ((user as { companyLogoUrl?: string | null }).companyLogoUrl ?? null)
      : null;

  const profileHref = user.role === 'employer' ? '/employer/profile' : '/job-seeker/profile';

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <MenuContainer ref={menuRef}>
      <MenuButton onClick={() => setOpen(!open)}>
        <Avatar>
          {logoUrl && !imgError ? (
            <img
              src={logoUrl}
              alt={user.name || 'Company logo'}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              onError={() => setImgError(true)}
            />
          ) : (
            initials
          )}
        </Avatar>
        <span>{user.name || 'User'}</span>
      </MenuButton>

      <DropdownMenu $open={open}>
        <UserInfo>
          <div>{user.name}</div>
          <Email>{user.email}</Email>
        </UserInfo>

        <Link href={profileHref} passHref legacyBehavior>
          <MenuItem>My Profile</MenuItem>
        </Link>

        <LogoutButton onClick={handleLogout}>Sign Out</LogoutButton>
      </DropdownMenu>
    </MenuContainer>
  );
}
