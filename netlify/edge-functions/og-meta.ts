import type { Config, Context } from "@netlify/edge-functions";

const SITE_URL = Netlify.env.get("VITE_DOMAIN_URL");
const SUPABASE_URL = Netlify.env.get("VITE_SUPABASE_URL");

if (!SITE_URL || !SUPABASE_URL) {
  throw new Error("Missing OG environment variables");
}

type ClassroomResponse = {
  name: string;
};

// HTML 속성에 문자열을 안전하게 삽입
function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return value.replace(/[&<>"']/g, (char) => entities[char]);
}

export default async function handler(
  request: Request,
  context: Context,
): Promise<Response> {
  const url = new URL(request.url);

  // 메인 페이지는 이번 단계에서 제외
  if (url.pathname === "/") {
    return context.next();
  }

  const publicId = url.pathname.split("/")[2];

  if (!publicId) {
    return context.next();
  }

  // 1. Supabase에서 반 이름 조회
  const apiUrl = new URL(`${SUPABASE_URL}/functions/v1/get-og-classroom`);

  apiUrl.searchParams.set("publicId", publicId);

  let classroomName: string;

  try {
    const result = await fetch(apiUrl);

    if (!result.ok) {
      return context.next();
    }

    const data = (await result.json()) as ClassroomResponse;

    if (!data.name || typeof data.name !== "string") {
      return context.next();
    }

    classroomName = data.name;
  } catch (error) {
    console.error("OG classroom lookup failed:", error);
    return context.next();
  }

  // 2. OG 데이터 생성
  const title = `${classroomName} 독서장`;

  const description = `${classroomName} 아이들의 독서 생활을 공유해 주세요.`;

  const imageUrl = new URL(`${SUPABASE_URL}/functions/v1/og-image`);

  imageUrl.searchParams.set("publicId", publicId);

  const pageUrl = `${SITE_URL}/classroom/${publicId}`;

  const ogTags = `
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${escapeHtml(imageUrl.toString())}" />
    <meta property="og:url" content="${escapeHtml(pageUrl)}" />
  `;

  // 3. 기존 React HTML 가져오기
  const response = await context.next();

  if (
    !response.ok ||
    !response.headers.get("content-type")?.includes("text/html")
  ) {
    return response;
  }

  const html = await response.text();

  // 4. 기존 OG 태그 중 중복되는 항목 제거
  const cleanedHtml = html.replace(
    /<meta\b[^>]*\bproperty\s*=\s*["']og:(?:type|title|description|image|url)["'][^>]*>\s*/gi,
    "",
  );

  // 5. </head> 바로 앞에 새로운 OG 태그 삽입
  const updatedHtml = cleanedHtml.replace(/<\/head>/i, `${ogTags}\n</head>`);

  const headers = new Headers(response.headers);

  // HTML 본문이 변경되었으므로 기존 크기 및 ETag 제거
  headers.delete("content-length");
  headers.delete("etag");

  return new Response(updatedHtml, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export const config: Config = {
  path: ["/", "/classroom/:publicId"],
  method: ["GET"],
};
