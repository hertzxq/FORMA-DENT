/** Keep public assets and navigation inside the deployed repository path. */
export function siteUrl(path = "") {
  return import.meta.env.BASE_URL + path.replace(/^\/+/, "");
}
export function isHomePath(pathname: string) {
  return (
    pathname.replace(/\/$/, "") === import.meta.env.BASE_URL.replace(/\/$/, "")
  );
}
