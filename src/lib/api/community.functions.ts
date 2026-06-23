import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  listCommunityMessages,
  messageAuthorLabel,
  postCommunityMessage,
} from "@/server/services/community.service";
import { requireWalletHolder } from "@/server/services/holder.service";

const walletAddressInput = z.object({
  address: z.string().min(32).max(44),
});

export const getCommunityMessages = createServerFn({ method: "POST" })
  .inputValidator(walletAddressInput)
  .handler(async ({ data }) => {
    const { userId } = await requireWalletHolder(data.address);

    const rows = await listCommunityMessages();
    return rows.map((row) => ({
      id: row.id,
      body: row.body,
      author: messageAuthorLabel(row),
      createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
      isMine: row.userAccountId === userId,
    }));
  });

export const sendCommunityMessage = createServerFn({ method: "POST" })
  .inputValidator(
    walletAddressInput.extend({
      body: z.string().min(1).max(2000),
    }),
  )
  .handler(async ({ data }) => {
    const { userId } = await requireWalletHolder(data.address);
    return postCommunityMessage(userId, data.body);
  });
