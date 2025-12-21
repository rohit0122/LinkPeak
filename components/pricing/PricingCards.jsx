import Link from "next/link";
import { PLANS } from "@/lib/roles";
import { HiCheck } from "react-icons/hi2";

export default function PricingCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
            {Object.values(PLANS).map((plan) => (
                <div
                    key={plan.role}
                    className={`card bg-base-100 shadow-xl border ${plan.label === 'Pro' ? 'border-primary' : 'border-base-200'}`}
                >
                    <div className="card-body">
                        <h2 className="card-title text-2xl justify-center">{plan.label}</h2>
                        <div className="text-center my-4">
                            <span className="text-4xl font-bold">${plan.price}</span>
                            <span className="text-base-content/60">/mo</span>
                        </div>
                        <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <HiCheck className="text-success" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="card-actions justify-center">
                            <Link
                                href={`/register?role=${plan.role}`}
                                className={`btn ${plan.label === 'Pro' ? 'btn-primary' : 'btn-outline'} w-full`}
                            >
                                Choose {plan.label}
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
