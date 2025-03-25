import { IonText } from "@ionic/react";
import { useAuthContext } from "../context/AuthContext";
import TagList from "./TagList";

type Props = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

const DeviceWrapper = ({ children, ...props }: Props) => {
  const { device } = useAuthContext();

  if (device?.platform === "web") {
    return (
      <div className="flex">
        <div
          className="w-3 p-4"
          style={{ height: "78.9vh", overflowY: "scroll" }}
        >
          <TagList view="list" onClickTag={() => {}} selectedTags={[]} />
        </div>
        <div
          {...props}
          className="w-4"
          style={{ height: "78.9vh", overflowY: "scroll" }}
        >
          {children}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DeviceWrapper;
