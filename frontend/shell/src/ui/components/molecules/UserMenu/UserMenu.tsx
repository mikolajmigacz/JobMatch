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

  const initials = user.firstName
    ? `${user.firstName[0]}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U';

  const rawLogoUrl =
    'companyLogoUrl' in user ? (user as { companyLogoUrl?: string | null }).companyLogoUrl : null;
  const s3BaseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL ?? '';
  const logoUrl = rawLogoUrl?.startsWith('s3://')
    ? rawLogoUrl.replace(/^s3:\/\//, `${s3BaseUrl}/`)
    : rawLogoUrl;

  const profileHref = user.role === 'employer' ? '/employer/profile' : '/job-seeker/profile';

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <MenuContainer ref={menuRef}>
      <MenuButton onClick={() => setOpen(!open)}>
        <Avatar>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={
                user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Company logo'
              }
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          ) : (
            initials
          )}
        </Avatar>
        <span>{user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User'}</span>
      </MenuButton>

      <DropdownMenu $open={open}>
        <UserInfo>
          <div>{user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : ''}</div>
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
