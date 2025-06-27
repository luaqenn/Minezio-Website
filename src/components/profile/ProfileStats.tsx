import React from 'react';
import { Coins, Archive, ShoppingBag, MessageSquareHeart } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { animate } from "framer-motion";

interface StatItemProps {
    icon: React.ElementType;
    value: number;
    label: string;
    color: string;
}

const StatItem: React.FC<StatItemProps> = ({ icon: Icon, value, label, color }) => {
    const [count, setCount] = React.useState(0);
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

    React.useEffect(() => {
        if (inView) {
            // @ts-ignore: animate is not typed for stop, but works at runtime
            const controls = animate(0, value, {
                duration: 2,
                ease: "circOut",
                onUpdate: (latest: number) => setCount(Math.round(latest)),
            });
            return () => {
                // @ts-ignore
                controls.stop();
            };
        }
    }, [inView, value]);

    return (
        <div ref={ref} className="flex-1 flex flex-col items-center justify-center p-4 text-center hover:bg-black/5 dark:hover:bg-gray-700/40 transition-colors rounded-lg">
            <Icon size={24} className="mb-2" style={{ color }} />
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                {count}
                {label === 'BAKİYE' && '₺'}
            </div>
            <div className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">{label}</div>
        </div>
    );
};

interface ProfileStatsProps {
    balance: number;
    chestCount: number;
    inventoryCount: number;
    supportCount: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ balance, chestCount, inventoryCount, supportCount }) => {
    const stats = [
        { label: 'BAKİYE', value: balance, icon: Coins, color: '#34d399' },
        { label: 'SANDIK', value: chestCount, icon: Archive, color: '#60a5fa' },
        { label: 'BEĞENİ', value: inventoryCount, icon: ShoppingBag, color: '#f472b6' },
        { label: 'DESTEK', value: supportCount, icon: MessageSquareHeart, color: '#a78bfa' },
    ];

    return (
        <div className="bg-white/5 p-3 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50 overflow-hidden mb-6">
            <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-white/10 dark:divide-gray-700/50">
                {stats.map((stat) => (
                    <StatItem key={stat.label} {...stat} />
                ))}
            </div>
        </div>
    );
};

export default ProfileStats;