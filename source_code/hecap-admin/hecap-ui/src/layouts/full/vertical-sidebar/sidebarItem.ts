import {
    ApertureIcon,
    CopyIcon,
    LayoutDashboardIcon, LoginIcon, MoodHappyIcon, TypographyIcon, UserPlusIcon
} from 'vue-tabler-icons';

export interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
}

const sidebarItem: menu[] = [
    { header: 'Home' },
    {
        title: 'Dashboard',
        icon: LayoutDashboardIcon,
        disabled: true,
        to: '/'
    },
    { header: 'Survey cohorts' },
    {
        title: 'Qualtrics',
        icon: TypographyIcon,
        to: '/ui/qualtrics'
    },
    {
        title: 'C24',
        icon: CopyIcon,
        to: '/ui/c24'
    },
    // { header: 'Survey Results' },
    // {
    //     title: 'HECAP Public Survey',
    //     icon: TypographyIcon,
    //     to: '/ui/typography'
    // },
    // {
    //     title: 'Qualtrics Survey',
    //     icon: CopyIcon,
    //     to: '/ui/qualitricssurvey'
    // },
    
    { header: 'Administration' },
    {
        title: 'Cohort Management',
        icon: MoodHappyIcon,
        disabled: true,
        to: '/ui/shadow'
    },
    // {
    //     title: 'Device Management',
    //     icon: MoodHappyIcon,
    //     to: '/icons'
    // },
    {
        title: 'User Management',
        icon: ApertureIcon,
        disabled: true,
        to: '/user'
    },
    // { header: 'auth' },
    // {
    //     title: 'Logout',
    //     icon: LoginIcon,
    //     to: '/auth/login'
    // }
];

export default sidebarItem;
