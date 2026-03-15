import {
    Binary, Braces,
    Calendar,
    CaseUpper, ClipboardList, Clock, Code2, DollarSign, File, FileText, Fingerprint, GitCompare, GraduationCap,
    Hash,
    Image,
    List,
    Percent,
    Receipt,
    RefreshCcw,
    Ruler,
    Server,
    ShieldCheck,
    Shuffle,
    Timer, TrendingUp, Type
} from "lucide-react";
export const setup = [
    {
        id: "developer",
        title: "Developer Tools",
        icon: <Code2 size={18} />,
        tools: [
            { title: "JSON Formatter", link: "/developer/json-formatter", icon: <Braces size={18} /> },
            { title: "Regex Tester", link: "/developer/regex-tester", icon: <Code2 size={18} /> },
            { title: "JWT Decoder", link: "/developer/jwt-decoder", icon: <ShieldCheck size={18} /> },
            { title: "Hash Generator", link: "/developer/hash-generator", icon: <Fingerprint size={18} /> },
            { title: "UUID Generator", link: "/developer/uuid", icon: <Hash size={18} /> },
            { title: "Timestamp Converter", link: "/developer/timestamp", icon: <Clock size={18} /> },
            { title: "Base64 Encode/Decode", link: "/developer/base64", icon: <Binary size={18} /> },
            { title: "API Request Tester", link: "/developer/api-tester", icon: <Server size={18} /> }
        ]
    },

    {
        id: "text",
        title: "Text Tools",
        icon: <Type size={18} />,
        tools: [
            { title: "Word Counter", link: "/text/word-counter", icon: <Type size={18} /> },
            { title: "Character Counter", link: "/text/character-counter", icon: <Type size={18} /> },
            { title: "Case Converter", link: "/text/case-converter", icon: <CaseUpper size={18} /> },
            { title: "Text Diff Checker", link: "/text/diff-checker", icon: <GitCompare size={18} /> },
            { title: "Remove Duplicate Lines", link: "/text/remove-duplicates", icon: <List size={18} /> },
            { title: "Random Text Generator", link: "/text/random-text", icon: <Shuffle size={18} /> }
        ]
    },

    {
        id: "converter",
        title: "Converters",
        icon: <RefreshCcw size={18} />,
        tools: [
            { title: "Base Converter", link: "/converter/base", icon: <Binary size={18} /> },
            { title: "Unit Converter", link: "/converter/unit", icon: <Ruler size={18} /> },
            { title: "Timezone Converter", link: "/converter/timezone", icon: <Clock size={18} /> },
            { title: "Date Difference", link: "/converter/date-diff", icon: <Calendar size={18} /> },
        ]
    },

    {
        id: "finance",
        title: "Finance",
        icon: <TrendingUp size={18} />,
        tools: [
            { title: "GST Calculator", link: "/finance/gst", icon: <Receipt size={18} /> },
            { title: "EMI Calculator", link: "/finance/emi", icon: <Percent size={18} /> },
            { title: "SIP Calculator", link: "/finance/sip", icon: <TrendingUp size={18} /> },
            { title: "ROI Calculator", link: "/finance/roi", icon: <TrendingUp size={18} /> },
            { title: "Compound Interest", link: "/finance/compound-interest", icon: <TrendingUp size={18} /> },
            { title: "Inflation Calculator", link: "/finance/inflation", icon: <TrendingUp size={18} /> }
        ]
    },

    {
        id: "student",
        title: "Student",
        icon: <GraduationCap size={18} />,
        tools: [
            { title: "GPA Calculator", link: "/student/gpa", icon: <GraduationCap size={18} /> },
            { title: "Percentage Calculator", link: "/student/percentage", icon: <Percent size={18} /> },
            { title: "Attendance Calculator", link: "/student/attendance", icon: <ClipboardList size={18} /> },
            { title: "Study Timer", link: "/student/pomodoro", icon: <Timer size={18} /> }
        ]
    },

    {
        id: "file",
        title: "File Tools",
        icon: <File size={18} />,
        tools: [
            { title: "Image Compressor", link: "/file/image-compressor", icon: <Image size={18} /> },
            { title: "Image Resizer", link: "/file/image-resizer", icon: <Image size={18} /> },
            { title: "PDF Merger", link: "/file/pdf-merge", icon: <FileText size={18} /> },
            { title: "PDF Splitter", link: "/file/pdf-split", icon: <FileText size={18} /> }
        ]
    },

    {
        id: "productivity",
        title: "Productivity",
        icon: <Timer size={18} />,
        tools: [
            { title: "Pomodoro Timer", link: "/productivity/pomodoro", icon: <Timer size={18} /> },
            { title: "Random Name Picker", link: "/productivity/random-name", icon: <Shuffle size={18} /> },
            { title: "Meeting Cost Calculator", link: "/productivity/meeting-cost", icon: <DollarSign size={18} /> }
        ]
    }
];
