import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST(req: NextRequest) {
try {
const body = await req.json();

const apiRes = await api.post('auth/register', body);


const cookieStore = await cookies();
const setCookie = apiRes.headers['set-cookie'];

if (setCookie) {
const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

for (const cookieStr of cookieArray) {
const parsed = parseSetCookie(cookieStr);

if (!parsed) continue;

const options = {
expires: parsed.expires,
path: parsed.path,
maxAge: parsed.maxAge,
httpOnly: parsed.httpOnly,
secure: parsed.secure,
sameSite: parsed.sameSite,
};

if (parsed.name === 'accessToken' && parsed.value) {
  cookieStore.set('accessToken', parsed.value, options);
}

if (parsed.name === 'refreshToken' && parsed.value) {
  cookieStore.set('refreshToken', parsed.value, options);
}
}

return NextResponse.json(apiRes.data, { status: apiRes.status });
}

return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
} catch (error) {
if (isAxiosError(error)) {
logErrorResponse(error.response?.data);

return NextResponse.json(
{ error: error.message, response: error.response?.data },
{ status: error.response?.status ?? 500 }
);
}

logErrorResponse({ message: (error as Error).message });

return NextResponse.json(
{ error: 'Internal Server Error' },
{ status: 500 }
);
}
}
