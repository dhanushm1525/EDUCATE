export interface Category {
    title: string;
    courses: string;
    icon: string;
    bgColor: string;
    iconColor: string;
}


export interface TrendingCourse {
    id: number;
    badge: string;
    badgeBg: string;
    badgeColor: string;
    title: string;
    instructor: string;
    rating: string;
    reviews: string;
    price: string;
    students: string;
    image: string;
}


export interface QaPost {
    title: string;
    content: string;
    author: string;
    initials: string;
    comments: number;
    likes: number;
    avatarBg: string;
}