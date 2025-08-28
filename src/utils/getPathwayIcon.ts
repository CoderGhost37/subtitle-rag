export function getPathwayIcon(name: string) {
  switch (name.toLowerCase()) {
    case "nodejs":
      return "/images/nodejs.png";
    case "python":
      return "/images/python.png";
    default:
      return "/logo.svg";
  }
}
