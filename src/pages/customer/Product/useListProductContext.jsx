
import { useContext } from "react";
import { ListProductContext } from "./ListProductsContext";


export const useListProductContext = () => {
  const context = useContext(ListProductContext);
  if (!context) {
    throw new Error(
      "useListProductContext phải được sử dụng trong ListProductProvider"
    );
  }
  return context;
};
