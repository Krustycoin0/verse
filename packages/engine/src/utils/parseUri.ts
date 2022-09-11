export enum UriType {
  DataUri = "data",
  IPFS = "ipfs",
  Url = "url",
  RelativePath = "relative",
}

export function parseUri(uri: string) {
  const isData = uri.startsWith("data:");
  const isIPFS = uri.startsWith("ipfs://");
  const isUrl = uri.startsWith("http://") || uri.startsWith("https://");

  if (isData) {
    return UriType.DataUri;
  } else if (isIPFS) {
    return UriType.IPFS;
  } else if (isUrl) {
    return UriType.Url;
  } else {
    // Assume relative path
    return UriType.RelativePath;
  }
}