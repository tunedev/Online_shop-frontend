import { useQuery } from "@apollo/react-hooks";
import { CURRENT_USER_QUERY } from "./User";
import Signin from "./Signin";

const PleaseSignIn = ({ children }) => {
  const { loading, data } = useQuery(CURRENT_USER_QUERY);
  if (loading) return <p>Loading ...</p>;
  if (!data || !data.me) return <Signin />;
  return <div>{children}</div>;
};

export default PleaseSignIn;
