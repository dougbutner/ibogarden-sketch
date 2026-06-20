import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";

import { getDb } from "@/server/db/client";
import { networkApplications } from "@/server/db/schema/partners";
import { communityWaitlist } from "@/server/db/schema/users";
import { submitNetworkApplication } from "@/server/services/network.service";
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

const TEST_NETWORK_EMAIL = "test-network-app@ibo.garden";

describe("network application", () => {
  beforeEach(async () => {
    const db = getDb();
    await db.delete(networkApplications).where(eq(networkApplications.email, TEST_NETWORK_EMAIL));
  });

  afterEach(async () => {
    const db = getDb();
    await db.delete(networkApplications).where(eq(networkApplications.email, TEST_NETWORK_EMAIL));
  });

  it("persists a pending application", async () => {
    const result = await submitNetworkApplication({
      organizationName: "Test Org",
      email: TEST_NETWORK_EMAIL,
      country: "USA",
      partnerTypeSlug: "facility",
      gabonFirstSourcing: true,
      southeastAfrica: false,
    });

    expect(result.ok).toBe(true);
    expect(result.id).toBeGreaterThan(0);

    const db = getDb();
    const [row] = await db
      .select()
      .from(networkApplications)
      .where(eq(networkApplications.email, TEST_NETWORK_EMAIL))
      .limit(1);
    expect(row?.status).toBe("pending");
    expect(row?.organizationName).toBe("Test Org");
  });
});
