import {
  Cable,
  CloudCog,
  Code2,
  Database,
  Headphones,
  KeyRound,
  Laptop,
  Network,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';

const visuals: Record<string, { Icon: LucideIcon; secondary: LucideIcon; colors: string }> = {
  migration: { Icon: Database, secondary: CloudCog, colors: 'from-amber-300 to-orange-500' },
  devices: { Icon: Smartphone, secondary: Laptop, colors: 'from-cyan-300 to-blue-500' },
  security: { Icon: ShieldCheck, secondary: KeyRound, colors: 'from-lime-300 to-emerald-500' },
  networks: { Icon: Network, secondary: Cable, colors: 'from-fuchsia-300 to-purple-600' },
  cloud: { Icon: CloudCog, secondary: Database, colors: 'from-sky-300 to-indigo-500' },
  web: { Icon: Code2, secondary: Laptop, colors: 'from-rose-300 to-red-500' },
  support: { Icon: Headphones, secondary: ShieldCheck, colors: 'from-teal-300 to-cyan-600' },
  endpoint: { Icon: Laptop, secondary: Smartphone, colors: 'from-yellow-200 to-lime-500' },
};

export function ServiceVisual({ kind, label }: { kind: string; label: string }) {
  const { Icon, secondary, colors } = visuals[kind] ?? visuals.cloud;
  const Secondary = secondary;

  return (
    <div
      className={`relative mt-auto h-48 overflow-hidden rounded-[1.35rem] bg-gradient-to-br ${colors}`}
      role="img"
      aria-label={`${label} abstract placeholder illustration`}
    >
      <div className="absolute -bottom-10 -right-8 size-44 rotate-[-10deg] rounded-[2rem] border-[10px] border-white/85 bg-black/90 shadow-2xl">
        <Icon className="m-auto h-full w-20 text-white" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <div className="absolute bottom-5 left-5 grid size-24 rotate-6 place-items-center rounded-full border-8 border-black bg-white shadow-xl">
        <Secondary className="size-11 text-black" strokeWidth={1.8} aria-hidden="true" />
      </div>
      <span className="absolute left-5 top-5 rounded-full bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
        Concept
      </span>
    </div>
  );
}
