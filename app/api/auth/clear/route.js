import { NextResponse } from "next/server";

export async function GET(request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  const cookiesToClear = [
    "authjs.session-token",
    "next-auth.session-token",
    "authjs.csrf-token",
    "next-auth.csrf-token",
    "authjs.callback-url",
    "next-auth.callback-url",
  ];

  // Clear common and chunked cookie variants
  for (let i = 0; i < 10; i++) {
    cookiesToClear.push(`authjs.session-token.${i}`);
    cookiesToClear.push(`next-auth.session-token.${i}`);
    cookiesToClear.push(`__Secure-authjs.session-token.${i}`);
    cookiesToClear.push(`__Secure-next-auth.session-token.${i}`);
  }

  cookiesToClear.forEach((name) => {
    response.cookies.set(name, "", { maxAge: 0, path: "/" });
  });

  return response;
}
