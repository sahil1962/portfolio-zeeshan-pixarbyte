import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getJWTSecret } from './jwt-secret';

export async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getJWTSecret());
    return payload;
  } catch {
    return null;
  }
}
