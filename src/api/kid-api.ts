import { API_URL } from "@/lib/constants";
import type { Kid } from "@/types";

//모든 아이 조회
export async function fetchKids(): Promise<Kid[]> {
  const response = await fetch(`${API_URL}/kids`);

  if (!response.ok) throw new Error("아이 목록 조회 실패");

  return await response.json();
}

//생성
export async function createKid(request: Omit<Kid, "id">): Promise<Kid> {
  const response = await fetch(`${API_URL}/kids`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) throw new Error("아이 생성 실패");

  return await response.json();
}

//이름 수정
export async function updateKidNameById({
  id,
  name,
}: Omit<Kid, "bookCount">): Promise<void> {
  const response = await fetch(`${API_URL}/kids/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error("아이 수정 실패 id:" + id);
}

//수정
export async function updateKid(
  request: Partial<Kid> & Pick<Kid, "id">,
): Promise<void> {
  const { id, ...updates } = request;

  const response = await fetch(`${API_URL}/kids/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("아이 수정 실패 id:" + id);
  }
}

//삭제
export async function deleteKidById(id: Kid["id"]): Promise<void> {
  const response = await fetch(`${API_URL}/kids/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("아이 삭제 실패 id:" + id);
}
