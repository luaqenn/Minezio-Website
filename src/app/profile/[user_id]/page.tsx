"use client";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AuthContext } from "@/lib/context/auth.context";
import { WebsiteContext } from "@/lib/context/website.context";
import { useUserService } from "@/lib/services/user.service";
import { useReportService } from "@/lib/services/report.service";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileInfoCard from "@/components/profile/ProfileInfoCard";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileHistoryTimeline from "@/components/profile/ProfileHistoryTable";
import ProfileModerationPanel from "@/components/profile/ProfileModerationPanel";
import Wall from "@/components/profile/Wall";
import UserActionModal from "@/components/profile/UserActionModal";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { User } from "@/lib/types/user";

const UserProfilePage = () => {
    const { user: currentUser } = useContext(AuthContext);
    const { website } = useContext(WebsiteContext);
    const params = useParams();
    const websiteId = website?.id;
    const userService = useUserService();
    const reportService = useReportService();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [banModalOpen, setBanModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            if (!params?.user_id || !websiteId) return;
            try {
                const fetched = await userService.getUserById(params.user_id as string);
                setUser(fetched);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [params?.user_id, websiteId]);

    if (loading) return <div className="text-center text-white py-20">Yükleniyor...</div>;
    if (!user) return <div className="text-center text-red-400 py-20">Kullanıcı bulunamadı.</div>;

    const stats = {
        balance: user.balance,
        chestCount: user.chest?.length || 0,
        inventoryCount: user.inventory?.length || 0,
        supportCount: user.supportCount || 0,
    };

    const info = {
        user: {
            email: user.email,
            createdAt: new Date(user.createdAt).toLocaleDateString(),
        },
        lastLogin: user.lastLogin || "-",
        socialLinks: user.socialLinks || {},
    };

    const tabs = [
        { label: "Beğeniler", count: user.likes?.length || 0, content: <div>Herhangi bir beğeni işlemi bulunamadı!</div> },
        { label: "Yorumlar", count: user.comments?.length || 0, content: <div>Yorumlar burada listelenecek.</div> },
        { label: "Yıldızlı Ürünler", count: user.favorites?.length || 0, content: <div>Yıldızlı ürünler burada listelenecek.</div> },
    ];

    const historyEvents = user.historyEvents || [];

    // Ban ve report işlemleri
    const handleReport = () => setReportModalOpen(true);
    const handleBan = () => setBanModalOpen(true);

    const handleReportSubmit = async ({ type, reason }: { type: string; reason: string }) => {
        if (!currentUser || !websiteId) return;
        setModalLoading(true);
        try {
            await reportService.createReport(user.id, { reason, reportType: type });
            setReportModalOpen(false);
            withReactContent(Swal).fire({
                title: "Raporlandı!",
                text: "Kullanıcı başarıyla raporlandı.",
                icon: "success",
                timer: 2000
            });
        } catch (e: any) {
            withReactContent(Swal).fire({
                title: "Hata!",
                text: e.message || "Rapor işlemi başarısız oldu.",
                icon: "error",
                timer: 2000
            });
        } finally {
            setModalLoading(false);
        }
    };

    const handleBanSubmit = async ({ banReason }: { banReason: string }) => {
        if (!currentUser || !websiteId) return;
        setModalLoading(true);
        try {
            await userService.banUser(user.id, banReason);
            setBanModalOpen(false);
            withReactContent(Swal).fire({
                title: "Banlandı!",
                text: "Kullanıcı başarıyla banlandı.",
                icon: "success",
                timer: 2000
            });
        } catch (e: any) {
            withReactContent(Swal).fire({
                title: "Hata!",
                text: e.message || "Ban işlemi başarısız oldu.",
                icon: "error",
                timer: 2000
            });
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 flex flex-col gap-8">
            <ProfileHeader
                user={user}
                currentUser={currentUser}
                onReport={handleReport}
                onBan={handleBan}
            />
            <UserActionModal
                open={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                onSubmit={handleReportSubmit}
                action="report"
                loading={modalLoading}
            />
            <UserActionModal
                open={banModalOpen}
                onClose={() => setBanModalOpen(false)}
                onSubmit={handleBanSubmit}
                action="ban"
                loading={modalLoading}
            />
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <ProfileStats {...stats} />
                    <Wall currentUser={currentUser} profileUser={user} initialMessages={user.wall || []} />
                    <ProfileTabs tabs={tabs} />
                    <ProfileHistoryTimeline events={historyEvents} />
                </div>
                <div className="w-full md:w-80 flex flex-col gap-6">
                    <ProfileInfoCard {...info} />
                    <ProfileModerationPanel
                        currentUser={currentUser}
                        user={user}
                        onReport={handleReport}
                        onBan={handleBan}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserProfilePage;
