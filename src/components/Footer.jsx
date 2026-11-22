import { Leaf, ShieldCheck, Sprout, Globe, QrCode, ChartNoAxesCombined } from "lucide-react"; // 4 icons
import { Link } from "react-router-dom";

const items = [
  { icon: Leaf, text: "Detect Diseases Early" },
  { icon: ShieldCheck, text: "Protect Your Crops" },
  { icon: Sprout, text: "Increase Yield" },
  { icon: Globe, text: "Support Sustainable Farming" },
];

export default function Footer() {
  return (
    <footer className="mt-8 bg-green-100/85 text-green-950 backdrop-blur-md dark:bg-green-950/85 dark:text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        {items.map(({ icon: Icon, text }) => ( // loop over the 4 items
          <div key={text} className="flex items-center gap-2 text-sm">
            <Icon size={22} className="text-green-700 dark:text-green-300" />
            <span>{text}</span>
          </div>
        ))}
        <Link
          to="/qr"
          className="inline-flex items-center gap-2 text-sm font-semibold text-green-800 hover:text-green-950 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 dark:text-green-300 dark:hover:text-green-100"
        >
          <QrCode size={18} aria-hidden="true" />
          Open on phone
        </Link>
        <Link
          to="/metrics"
          className="inline-flex items-center gap-2 text-sm font-semibold text-green-800 hover:text-green-950 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700 dark:text-green-300 dark:hover:text-green-100"
        >
          <ChartNoAxesCombined size={18} aria-hidden="true" />
          Model Performance
        </Link>
        <p className="italic text-green-800 dark:text-green-200">Grow Green, Grow Together</p>
      </div>
    </footer>
  );
}