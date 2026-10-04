import { cx } from "@/lib/utils";

export function Card({ className, children }) {
  return <div className={cx("surface-card", className)}>{children}</div>;
}
