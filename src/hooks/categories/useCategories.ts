import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../../api/categories.api";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.list,
  });
};
