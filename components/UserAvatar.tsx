'use client';

import { useUser } from '@/contexts/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export function UserAvatar() {
  const { user, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Don't show anything on the login/signup page
  if (pathname === '/auth') {
    return null;
  }

  if (!user) {
    return (
      <Link href="/auth">
        <Button variant="outline">Login or Sign Up</Button>
      </Link>
    );
  }

  // Generate DiceBear Identicon avatar URL
  const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(user.id)}`;

  return (
    <div className="mr-4"> {/* Add margin to the right */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="cursor-pointer">
            <AvatarImage src={avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
