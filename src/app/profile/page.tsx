"use client";
import React, { useContext, useEffect, useState } from "react";
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
import { User } from "@/lib/types/user";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Loading from "@/components/loading";
import NotFound from "@/components/not-found";

const ProfilePage = () => {
    const { user: authUser } = useContext(AuthContext);
    const { website } = useContext(WebsiteContext);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const websiteId = website?.id;
    const userService = useUserService();

    useEffect(() => {
        const fetchUser = async () => {
            if (!authUser || !websiteId) return;
            try {
                const fetched = await userService.getUserById(authUser.id);
                setUser(fetched);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [authUser, websiteId]);

    if (loading) return (
        <Loading show={true} message="Kullanıcı yükleniyor.."/>
    );
    if (!user) return (
        <NotFound navigateTo={"/"} backToText={"Anasayfa'ya Dön!"} header="Aradığınız kullanıcıya ulaşamadık"></NotFound>
    );

    const stats = {
        balance: user.balance,
        chestCount: user.chest?.length || 0,
        inventoryCount: 0,
        supportCount: 0,
    };

    const info = {
        user: {
            email: user.email,
            createdAt: new Date(user.createdAt).toLocaleDateString(),
        },
        lastLogin: "-",
        socialLinks: {},
    };

    // Dummy tabs ve history yerine gerçek veriler eklenebilir
    const tabs = [
        { label: "Beğeniler", count: 0, content: <div>Herhangi bir beğeni işlemi bulunamadı!</div> },
        { label: "Yorumlar", count: 0, content: <div>Yorumlarınız burada listelenecek.</div> },
        { label: "Yıldızlı Ürünler", count: 0, content: <div>Yıldızlı ürünleriniz burada listelenecek.</div> },
    ];

    const historyEvents = user.historyEvents || [];

    const handleReport = async () => {
        withReactContent(Swal).fire({
            title: "Raporlama Hatası!",
            text: "Kendinizi raporlayamazsınzı!",
            icon: "error",
            timer: 2000
        })
    };

    return (
        <div className="max-w-5xl mx-auto py-10 px-4 flex flex-col gap-8">
            <ProfileHeader user={user} currentUser={user} onReport={handleReport}/>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                    <ProfileStats {...stats} />
                    <Wall currentUser={user} profileUser={user} initialMessages={[]} />
                    <ProfileTabs tabs={tabs} />
                    <ProfileHistoryTimeline events={historyEvents} />
                </div>
                <div className="w-full md:w-80 flex flex-col gap-6">
                    <ProfileInfoCard {...info} />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
