export function getPathwayIcon(name: string) {
  switch (name.toLowerCase()) {
    case "nodejs":
      return "/images/nodejs.jpeg";
    case "python":
      return "/images/python.jpeg";
    default:
      return "/logo.svg";
  }
}
