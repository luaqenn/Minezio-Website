import React from 'react';
import { Button } from '../ui/button';
import { Calendar, Clock, Mail, Copy, Check, User, Share2 } from 'lucide-react';
import { FaDiscord, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import Link from 'next/link';

interface ProfileInfoCardProps {
    user: { email: string; createdAt: string };
    lastLogin?: string;
    socialLinks?: { [key: string]: string };
}

const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({ user, lastLogin, socialLinks }) => {
    const [isCopied, setIsCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(user.email);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const socialIcons = {
        discord: { icon: FaDiscord, color: "#5865F2" },
        instagram: { icon: FaInstagram, color: "#E4405F" },
        twitter: { icon: FaTwitter, color: "#1DA1F2" },
        youtube: { icon: FaYoutube, color: "#FF0000" }
    };

    return (
        <div className="bg-white/5 dark:bg-gray-800/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/10 dark:border-gray-700/50 overflow-hidden">
            <div className="p-4 border-b border-white/10 dark:border-gray-700/50">
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 flex items-center">
                    <User className="mr-2 h-5 w-5 text-blue-500" />
                    Hesap Bilgileri
                </h3>
            </div>

            <div className="p-4 space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 dark:hover:bg-gray-700/40 transition-colors">
                    <Calendar size={18} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{user.createdAt}</span>
                </div>

                {lastLogin && (
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 dark:hover:bg-gray-700/40 transition-colors">
                        <Clock size={18} className="text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{lastLogin}</span>
                    </div>
                )}

                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/5 dark:hover:bg-gray-700/40 transition-colors">
                    <Mail size={18} className="text-gray-500 dark:text-gray-400" />
                    <span className="flex-1 font-mono text-sm text-gray-700 dark:text-gray-300 truncate">
                        {user.email}
                    </span>
                    <Button
                        onClick={handleCopy}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:bg-blue-500/10 text-gray-500 hover:text-blue-500"
                    >
                        {isCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </Button>
                </div>

                {socialLinks && Object.keys(socialLinks).length > 0 && (
                    <div className="pt-4 border-t border-white/10 dark:border-gray-700/50">
                        <div className="flex items-center gap-2 mb-3">
                            <Share2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">Sosyal Medya</h4>
                        </div>
                        <div className="flex gap-4">
                            {Object.entries(socialLinks).map(([key, href]) => {
                                const social = socialIcons[key as keyof typeof socialIcons];
                                if (!social) return null;

                                return (
                                    <Link
                                        key={key}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-2xl hover:scale-110 transition-all duration-300 p-2 rounded-lg hover:bg-black/5 dark:hover:bg-gray-700/40"
                                        style={{ color: social.color }}
                                    >
                                        {React.createElement(social.icon)}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileInfoCard;