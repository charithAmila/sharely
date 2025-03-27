import { useAuthContext } from "../context/AuthContext";
import Subscription from "./Subscription";

const ProConnect = () => {
  const { updateUser } = useAuthContext();

  const onClickSkip = async () => {
    try {
      await updateUser({ userType: "FREE" });
    } catch (error) {
      console.log("+++++ error", error);
    }
  };

  return <Subscription onClickSkip={onClickSkip} />;
};

export default ProConnect;
