import { createContext, useState } from "react";
import PropTypes from "prop-types";


export const ListProductContext = createContext(null);
export const ListProductProvider = ({ children }) => {
  const [products, setProducts] = useState();

  return (
    <ListProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ListProductContext.Provider>
  );
};

ListProductProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
