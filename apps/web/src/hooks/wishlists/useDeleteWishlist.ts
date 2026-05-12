import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWishlist } from "../../api/wishlists";

export const useDeleteWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteWishlist(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["wishlists"] });
    },
  });
};
