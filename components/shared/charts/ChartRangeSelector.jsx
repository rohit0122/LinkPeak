import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setRange } from "@/store/slices/analyticsSlice";

export default function ChartRangeSelector({ plan, title, subtitle }) {
    const dispatch = useDispatch();
    const range = useSelector((state) => state.analytics.range);

    const limitDays = plan === "FREE" ? 7 : plan === "PRO" ? 90 : 9999;

    const RANGE_LABELS = {
        7: "7D",
        15: "15D",
        30: "1M",
        90: "3M",
        180: "6M",
        9999: "ALL",
    };
    const handleChartRangeChange = (rangeId) => {
        console.log('dfasdfsdfasfas===== ', rangeId)
        dispatch(setRange(rangeId));
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-sm opacity-60">{subtitle}</p>
            </div>
            <ul className="menu menu-horizontal bg-base-200">
                {Object.entries(RANGE_LABELS).map(([r, label]) => {
                    const isDisabled = limitDays !== 9999 && limitDays < Number(r);
                    return (
                        <li key={r}>
                            <button
                                data-tip={`${isDisabled ? "Upgrade plan to view more" : `${label} analytics`}`}
                                onClick={() => !isDisabled && handleChartRangeChange(Number(r))}
                                className={`btn btn-xs tooltip ${Number(r) === range ? "btn-primary" : "btn-ghost"} ${isDisabled ? "opacity-30 cursor-not-allowed" : ""}`}
                            >
                                {label}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    )
}