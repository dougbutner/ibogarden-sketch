import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";

import { getDb } from "@/server/db/client";
import { communityWaitlist } from "@/server/db/schema/users";
import { joinWaitlist } from "@/server/services/waitlist.service";
import { cleanupWaitlistEmail } from "./fixtures/cleanup";

const TEST_WAITLIST_EMAIL = "test-waitlist@ibo.garden";

describe("community waitlist", () => {
  beforeEach(async () => {
    await cleanupWaitlistEmail(TEST_WAITLIST_EMAIL);
  });

  afterEach(async () => {
    await cleanupWaitlistEmail(TEST_WAITLIST_EMAIL);
  });

  it("joins a new email and returns alreadyExists on duplicate", async () => {
    const first = await joinWaitlist(TEST_WAITLIST_EMAIL, "vitest");
    expect(first.alreadyExists).toBe(false);
    expect(first.id).toBeGreaterThan(0);

    const db = getDb();
    const [row] = await db
      .select()
      .from(communityWaitlist)
      .where(eq(communityWaitlist.email, TEST_WAITLIST_EMAIL))
      .limit(1);
    expect(row?.source).toBe("vitest");

    const second = await joinWaitlist(TEST_WAITLIST_EMAIL, "vitest");
    expect(second.alreadyExists).toBe(true);
    expect(second.id).toBe(first.id);
  });
});
