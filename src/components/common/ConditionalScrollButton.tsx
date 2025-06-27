'use client';

import { usePathname } from "next/navigation";
import ScrollToggleButton from "@/components/ui/ScrollToggleButton";

export default function ConditionalScrollButton() {
    const pathname = usePathname();

    const shouldshow = ['/profile', '/projects', '/articles'].includes(pathname);

    return shouldshow ? <ScrollToggleButton/> : null;
}
