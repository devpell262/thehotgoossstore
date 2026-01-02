import * as React from "react";

const useUser = () => {
  // Custom admin login - no AuthJS needed
  const [user, setUser] = React.useState(null);

  return {
    user: null,
    data: null,
    loading: false,
    refetch: () => {},
  };
};

export { useUser };

export default useUser;
