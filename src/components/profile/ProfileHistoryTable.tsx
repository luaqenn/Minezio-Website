// components/profile/ProfileHistoryTimeline.tsx
import React from 'react';
import { Award, CreditCard, MessageCircle, ShoppingCart, Circle, History } from 'lucide-react';

// İkonları işlem türüne göre eşleştirelim
const eventIcons: { [key: string]: React.ReactNode } = {
    payment: <CreditCard className="h-5 w-5 text-green-500" />,
    purchase: <ShoppingCart className="h-5 w-5 text-blue-500" />,
    comment: <MessageCircle className="h-5 w-5 text-purple-500" />,
    achievement: <Award className="h-5 w-5 text-yellow-500" />,
    default: <Circle className="h-5 w-5 text-gray-500" />,
};

const eventColors: { [key: string]: string } = {
    payment: 'bg-green-500',
    purchase: 'bg-blue-500',
    comment: 'bg-purple-500',
    achievement: 'bg-yellow-500',
    default: 'bg-gray-500',
};

interface TimelineEvent {
    id: string | number;
    type: 'payment' | 'purchase' | 'comment' | 'achievement' | 'default';
    title: string;
    description?: string;
    timestamp: string;
}

interface ProfileHistoryTimelineProps {
    events: TimelineEvent[];
    emptyText?: string;
}

const ProfileHistoryTimeline: React.FC<ProfileHistoryTimelineProps> = ({ 
    events, 
    emptyText = 'Kayıt bulunamadı.' 
}) => {
    return (
        <div className="bg-white/5 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50 overflow-hidden mb-6">
            <div className="p-4 border-b border-white/10 dark:border-gray-700/50">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 flex items-center">
                    <History className="mr-2 h-5 w-5 text-green-500" />
                    Aktivite Geçmişi
                </h3>
            </div>
            
            <div className="p-4">
                {(!events || events.length === 0) ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                        <History className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p className="text-sm">{emptyText}</p>
                    </div>
                ) : (
                    <div className="relative">
                        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500/50 to-purple-500/50" />
                        <div className="space-y-6">
                            {events.map((event, index) => (
                                <div key={event.id} className="relative flex items-start gap-4 group">
                                    <div className={`absolute left-6 top-2 w-3 h-3 rounded-full ${eventColors[event.type] || eventColors.default} -translate-x-1/2 shadow-lg group-hover:scale-125 transition-transform duration-300`} />
                                    <div className="ml-12 flex-1 p-3 rounded-lg hover:bg-black/5 dark:hover:bg-gray-700/40 transition-colors">
                                        <div className="flex items-center gap-2 mb-1">
                                            {eventIcons[event.type] || eventIcons.default}
                                            <h4 className="font-medium text-gray-800 dark:text-gray-100">{event.title}</h4>
                                        </div>
                                        {event.description && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                {event.description}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                            {event.timestamp}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileHistoryTimeline;