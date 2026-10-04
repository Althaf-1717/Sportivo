import Link from "next/link";
import { cx } from "@/lib/utils";

export function Button({ href, variant = "primary", className, children, ...props }) {
  const classes = cx(variant === "primary" ? "btn-primary" : "btn-secondary", className);
  if (href) return <Link href={href} className={classes} {...props}>{children}</Link>;
  return <button className={classes} {...props}>{children}</button>;
}
