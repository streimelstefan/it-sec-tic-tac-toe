import { SetMetadata } from '@nestjs/common';

export const NEEDS_ADMIN_KEY = 'needsAdmin';
export const Admin = () => SetMetadata(NEEDS_ADMIN_KEY, true);
