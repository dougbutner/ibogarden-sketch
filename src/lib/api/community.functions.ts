import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { z } from "zod";

import {
  listCommunityMessages,
  messageAuthorLabel,
  postCommunityMessage,
} from "@/server/services/community.service";
import { getUserSessionConfig, type UserSessionData } from "@/server/lib/session";

export const getCommunityMessages = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<UserSessionData>(getUserSessionConfig());
  if (!session.data?.isHolder || !session.data.userId) {
    throw new Error("Holder access required");
  }

  const rows = await listCommunityMessages();
  return rows.map((row) => ({
    id: row.id,
    body: row.body,
    author: messageAuthorLabel(row),
    createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
    isMine: row.userAccountId === session.data!.userId,
  }));
});

export const sendCommunityMessage = createServerFn({ method: "POST" })
  .inputValidator(z.object({ body: z.string().min(1).max(2000) }))
  .handler(async ({ data }) => {
    const session = await useSession<UserSessionData>(getUserSessionConfig());
    if (!session.data?.isHolder || !session.data.userId) {
      throw new Error("Holder access required");
    }

    const result = await postCommunityMessage(session.data.userId, data.body);
    return result;
  });
