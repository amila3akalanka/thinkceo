import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  BookOpen,
  Brain,
  Briefcase,
  Camera,
  CircleCheck,
  ChevronRight,
  Cloud,
  Coffee,
  Coins,
  Compass,
  Cpu,
  Crown,
  CupSoda,
  Dice5,
  Film,
  Flame,
  Gauge,
  HeartHandshake,
  History,
  House,
  LifeBuoy,
  Lightbulb,
  LoaderCircle,
  LogIn,
  LogOut,
  Mail,
  Map as MapIcon,
  Music,
  Package,
  Pill,
  Pizza,
  Plane,
  Play,
  Rocket,
  RotateCcw,
  Shield,
  Sparkles,
  Star,
  Tag,
  Target,
  TrendingUp,
  Trophy,
  Truck,
  User,
  Wallet,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  blocks: Blocks,
  book: BookOpen,
  brain: Brain,
  briefcase: Briefcase,
  camera: Camera,
  check: CircleCheck,
  chevron: ChevronRight,
  cloud: Cloud,
  coffee: Coffee,
  coins: Coins,
  compass: Compass,
  cpu: Cpu,
  crown: Crown,
  dice: Dice5,
  film: Film,
  flame: Flame,
  gauge: Gauge,
  heart: HeartHandshake,
  history: History,
  house: House,
  lifebuoy: LifeBuoy,
  lightbulb: Lightbulb,
  loader: LoaderCircle,
  login: LogIn,
  logout: LogOut,
  mail: Mail,
  map: MapIcon,
  music: Music,
  package: Package,
  pill: Pill,
  pizza: Pizza,
  plane: Plane,
  play: Play,
  rocket: Rocket,
  retry: RotateCcw,
  shield: Shield,
  soda: CupSoda,
  sparkles: Sparkles,
  star: Star,
  tag: Tag,
  target: Target,
  trending: TrendingUp,
  trophy: Trophy,
  truck: Truck,
  user: User,
  wallet: Wallet,
  zap: Zap,
};

export function Icon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const Component = ICONS[name] ?? Sparkles;
  return <Component className={className} aria-hidden />;
}

const TONES = {
  violet: "bg-linear-to-br from-violet-400 to-violet-600 text-white shadow-md shadow-violet-300/60",
  orange: "bg-linear-to-br from-orange-300 to-orange-500 text-white shadow-md shadow-orange-300/60",
  soft: "bg-violet-100 text-violet-600",
  softOrange: "bg-orange-100 text-orange-600",
  green: "bg-emerald-100 text-emerald-600",
} as const;

const SIZES = {
  sm: ["h-9 w-9 rounded-xl", "h-5 w-5"],
  md: ["h-12 w-12 rounded-2xl", "h-6 w-6"],
  lg: ["h-20 w-20 rounded-3xl", "h-10 w-10"],
} as const;

export function IconBadge({
  name,
  tone = "soft",
  size = "md",
}: {
  name: string;
  tone?: keyof typeof TONES;
  size?: keyof typeof SIZES;
}) {
  const [box, icon] = SIZES[size];
  return (
    <span className={`grid shrink-0 place-items-center ${box} ${TONES[tone]}`}>
      <Icon name={name} className={icon} />
    </span>
  );
}
