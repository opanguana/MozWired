// File: app/page.tsx
"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Button } from "@/components/ui/button";

// Dynamically import HeroCard for performance
const HeroCard = dynamic(
	() => import("@/components/ui/card").then((mod) => mod.HeroCard),
	{
		loading: () => <div>Loading...</div>,
		ssr: false,
	}
);

/**
 * Main homepage component
 * - Displays hero sections and product cards
 * - Demonstrates optimized image and environment variable usage
 */
export default function HomePage() {
	// Product sections data
	const productSections = [
		[
			{
				title: "Data migration",
				description: "Migrate mail and files to Exchange Online, SharePoint, and OneDrive.",
			},
			{
				title: "Microsoft Intune",
				description: "Simplify app and device management across multiple devices.",
			},
		],
		[
			{
				title: "Microsoft Purview",
				description: "Powerful performance. Sleek design.",
			},
			{
				title: "Microsoft Entra",
				description: "Secure access for every identity with unified protection.",
			},
		],
	];

	// Card actions for product cards
	function CardActions() {
		return (
			<div className="flex gap-4 mt-4">
				<Button variant="primary">Learn more</Button>
				<Button variant="appleOutline">Buy</Button>
			</div>
		);
	}

	// Get API key from environment variable (for demo only)
	const apiKey = process.env.NEXT_PUBLIC_API_KEY;

	return (
		<main>
			{/* Optimized Image Example */}
			{/* <div className="flex justify-center my-8">
				<Image
					src="/vercel.svg"
					alt="Vercel Logo"
					width={200}
					height={60}
					priority
					className="rounded shadow"
				/>
			</div> */}
			{/* Show API Key from env for demonstration (remove in production) */}
			{apiKey && (
				<div className="text-xs text-gray-500 text-center my-2">
					API Key: {apiKey}
				</div>
			)}
			{/* Top Hero Section */}
			<HeroCard
				title="Structured Cabling"
				description="LANs, Transport Networks, Access Networks."
				variant="dark"
				className="mx-auto mt-9 mb-2.5 bg-gray-100/80 dark:bg-black"
			>
				<CardActions />
			</HeroCard>
			{/* Other hero sections */}
			<HeroCard
				title="Web Development"
				description="Modern, flexible, and scalable stack."
				className="mx-auto mt-2.5 mb-2.5"
			>
				<CardActions />
			</HeroCard>
			<HeroCard
				title="Adopt Microsoft solutions"
				description="Quickly and efficiently with MozWired."
				className="mx-auto mt-2.5 mb-2.5"
			>
				<CardActions />
			</HeroCard>
			{/* Product Sections */}
			{productSections.map((section, idx) => (
				<section
					key={idx}
					className="mx-2.5 grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-2.5 mb-2.5"
				>
					{section.map((card) => (
						<HeroCard
							key={card.title}
							title={card.title}
							description={card.description}
							className="rounded-none shadow-none border-none"
						>
							<CardActions />
						</HeroCard>
					))}
				</section>
			))}
		</main>
	);
}