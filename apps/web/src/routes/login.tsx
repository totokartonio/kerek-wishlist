import { createFileRoute, redirect } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import Login from "../components/Login";

const searchSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: zodValidator(searchSchema),
  beforeLoad: ({ context }) => {
    if (context.session) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: Login,
});
