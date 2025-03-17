import ReactPlayer from "react-player";

type Props = {
  url: string;
  type: "image" | "video" | "url";
  contentType?: string;
};

const MediaPreview = ({ url, type, contentType }: Props) => {
  if (contentType === "image") {
    // Set full size image
    return (
      <img
        src={url}
        style={{
          width: "100%",
        }}
        alt="Preview"
      />
    );
  }

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
    return (
      <ReactPlayer
        url={url}
        controls
        width="100%"
        height="225px"
        config={{
          youtube: {
            playerVars: { showinfo: 1 },
          },
        }}
      />
    );
  }

  return <></>;
};

export default MediaPreview;
