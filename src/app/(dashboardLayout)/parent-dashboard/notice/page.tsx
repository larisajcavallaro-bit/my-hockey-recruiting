// components/Notice.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Megaphone, Calendar, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NoticeItem {
    id: number;
    title: string;
    message: string;
    sender: string;
    timestamp: Date;
    isNew?: boolean;
    type: "assignment" | "video" | "schedule" | "feedback";
}

const noticesData: NoticeItem[] = [
    {
        id: 1,
        title: "New assignment posted",
        message: "English Grammar - Practice Test 3 has been assigned",
        sender: "Ms. Johnson",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        isNew: true,
        type: "assignment",
    },
    {
        id: 2,
        title: "New class video uploaded",
        message: "Advanced Topics - Lesson 5 is now available",
        sender: "Dr. Williams",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        type: "video",
    },
    {
        id: 3,
        title: "Class schedule update",
        message: "Next week's session will be held on Wednesday instead of Tuesday",
        sender: "Ms. Johnson",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        type: "schedule",
    },
    {
        id: 4,
        title: "Teacher feedback received",
        message: "Great work on your last test! Keep up the excellent progress.",
        sender: "Mr. Smith",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        isNew: true,
        type: "feedback",
    },
];

const getIcon = (type: NoticeItem["type"]) => {
    switch (type) {
        case "assignment":
            return <Megaphone className="w-5 h-5" />;
        case "video":
            return <Bell className="w-5 h-5" />;
        case "schedule":
            return <Calendar className="w-5 h-5" />;
        case "feedback":
            return <MessageCircle className="w-5 h-5" />;
        default:
            return <Bell className="w-5 h-5" />;
    }
};

export default function Notice() {
    return (
        <div className="w-full mx-auto space-y-8 p-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-foreground">Notice & Announcements</h1>
                <p className="text-base text-foreground">Stay updated with your classes</p>
            </div>

            <div className="space-y-4">
                {noticesData.map((notice) => (
                    <Card
                        key={notice.id}
                        className={`transition-all hover:shadow-md border ${notice.isNew ? "border bg" : "border"
                            }`}
                    >
                        <CardContent className="p-6">
                            <div className="flex gap-4">
                                {/* Icon */}
                                {/* Icon - Perfectly Centered */}
                                <div className="p-3 bg-primary rounded-xl flex items-center justify-center">
                                    <div className="w-5 h-5 text-foreground">
                                        {getIcon(notice.type)}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-base font-medium text-foreground">
                                                    {notice.title}
                                                </h3>
                                                {notice.isNew && (
                                                    <Badge className="bg text-foreground hover:bg">
                                                        New
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="mt-1 text-sm text-foreground font-medium">
                                                {notice.message}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-foreground">
                                            From: <span className="font-medium">{notice.sender}</span>
                                        </span>
                                        <span className="text-foreground">
                                            {formatDistanceToNow(notice.timestamp, { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Optional: Load more or empty state */}
            {noticesData.length === 0 && (
                <Card className="border-dashed border-2 ">
                    <CardContent className="py-12 text-center text-foreground">
                        <Bell className="w-12 h-12 mx-auto mb-4 text-foreground" />
                        <p>No notices yet. Check back later!</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}