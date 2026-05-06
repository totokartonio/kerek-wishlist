import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAvatar } from "../../api/users";
import { useSession } from "../../lib/auth-client";

export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (avatar: string) => updateAvatar(avatar),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", session?.user.id],
      });
    },
  });
};
