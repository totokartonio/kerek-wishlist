import { useQuery } from "@tanstack/react-query";
import { getHasPassword } from "../../api/users";

const useHasPassword = () => {
  return useQuery({
    queryKey: ["hasPassword"],
    queryFn: getHasPassword,
  });
};

export { useHasPassword };
