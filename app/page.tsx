// File: app/page.tsx
import { Button } from "@/components/ui/button";
import { HeroCard } from "@/components/ui/card";

export default function HomePage() {
	// Product sections data
	const productSections = [
		[
			{
				title: "AirPods Pro 3",
				description: "The world's best in-ear Active Noise Cancellation.",
			},
			{
				title: "Apple Watch",
				description: "The ultimate way to watch your health.",
			},
		],
		[
			{
				title: "MacBook Pro",
				description: "Powerful performance. Sleek design.",
			},
			{
				title: "iPad Pro",
				description: "Your next computer is not a computer.",
			},
		],
	];

	// Apple-style card actions
	function CardActions() {
		return (
			<div className="flex gap-4 mt-4">
				<Button variant="primary">Learn more</Button>
				<Button variant="appleOutline">Buy</Button>
			</div>
		);
	}

	return (
		<main>
			{/* Top Hero */}
			<HeroCard
				title="Structured Cabling"
				description="Modern Stack. So strong. So light. So Pro."
				variant="dark"
				className=""
			>
				<CardActions />
			</HeroCard>

			{/* Other hero sections */}
			<HeroCard
				title="Web Development"
				description="UTP and STP. So strong. So light. So Pro."
				className="mx-auto mt-2.5 mb-2.5 bg-gray-100/80"
			>
				<CardActions />
			</HeroCard>

			<HeroCard
				title="Interior Design"
				description="UTP and STP. So strong. So light. So Pro."
				className="mx-auto mt-2.5 mb-2.5 bg-gray-100/80"
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