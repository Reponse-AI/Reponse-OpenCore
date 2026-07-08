"use client";

import { useMutation } from "@tanstack/react-query";
import { createTicket } from "@/lib/tickets";
import type { CreateTicketData } from "@/types/storefront";

export function useSupportTicket() {
  return useMutation({
    mutationFn: async (data: CreateTicketData) => {
      const result = await createTicket(data);
      if (!result.success) {
        throw new Error(result.error || "Failed to create ticket");
      }
      return result;
    },
  });
}
