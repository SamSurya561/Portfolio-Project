// seedProjects.js (browser-friendly; include after firebaseConfig.js is loaded)
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const sampleProjects = [
    {
        title: "E-commerce Rebrand",
        summary: "A full brand refresh and UI redesign for an online shop.",
        imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
        categories: ["Branding", "Graphic Design"],
        date: "2025-06-15",
        pills: ["Figma", "Logo", "Styleguide"]
    },
    {
        title: "Mobile App — Night Bites",
        summary: "UX-first food delivery app concept with micro-interactions.",
        imageUrl: "https://images.unsplash.com/photo-1524666041070-4b3f1b9f1a2d?w=1200&q=80",
        categories: ["UI/UX Design"],
        date: "2025-05-10",
        pills: ["Figma", "Prototype", "Reels"]
    },
    {
        title: "Corporate Website",
        summary: "Landing page and content templates for a SaaS product.",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80",
        categories: ["UI/UX Design", "Branding"],
        date: "2025-04-02",
        pills: ["HTML", "CSS", "Accessibility"]
    }
];

async function seed() {
    try {
        const colRef = collection(db, "projects");
        for (const p of sampleProjects) {
            await addDoc(colRef, p);
            console.log("Seeded:", p.title);
        }
        console.log("Seeding complete.");
    } catch (err) {
        console.error("Seeding error:", err);
    }
}

// Call seed() once (or run from a small page script)
seed();
