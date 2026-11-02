export default function PageIntro({ eyebrow, title, description, action }) {
  return <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">{eyebrow}</p><h2 className="mt-2 text-[24px] font-bold tracking-[-.045em] text-navy sm:text-[28px]">{title}</h2>{description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>}</div>{action}</div>;
}
