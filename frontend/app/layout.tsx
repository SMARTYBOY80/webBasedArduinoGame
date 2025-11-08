import localFont from "next/font/local";
import "./globals.css";

const openDyslexic = localFont({
    src: [
        { path: "../public/fonts/OpenDyslexic/OpenDyslexic-Regular.otf", weight: "400", style: "normal" },
        { path: "../public/fonts/OpenDyslexic/OpenDyslexic-Bold.otf", weight: "700", style: "bold" },
        { path: "../public/fonts/OpenDyslexic/OpenDyslexic-Italic.otf", weight: "400", style: "italic" },
    ],
    variable: "--font-open-dyslexic",
});

export const metadata = {
    title: "Flappy Bird",
    description: "Flappy Bird game controlled by Arduino",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${openDyslexic.variable} antialiased`}>
            {children}
            </body>
        </html>
    );
}
