import ReactPlayer from "react-player";

type Props = {
  url: string;
  type: "image" | "video" | "url";
};

const MediaPreview = ({ url, type }: Props) => {
  if (type === "image" || type === "url") {
    return (
      <img
        src={url}
        style={{
          maxHeight: "225px",
          width: "100%",
          objectFit: "cover",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
        alt="Preview"
      />
    );
  }

  if (type === "video") {
    return <ReactPlayer url={url} controls width="100%" height="225px" />;
  }

  return <></>;
};

export default MediaPreview;
