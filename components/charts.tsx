'use client';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	ResponsiveContainer,
	PieChart,
	Pie,
	Legend,
	Tooltip,
} from 'recharts';

interface ChartsProps {
	data: {
		salesData?: { month: string; totalSales: number }[];
		productsPerCategory?: { name: string; value: number }[];
	};
}

const Charts = ({ data: { salesData, productsPerCategory } }: ChartsProps) => {
	if (salesData) {
		return (
			<ResponsiveContainer width='100%' height={350}>
				<BarChart data={salesData}>
					<XAxis
						dataKey='month'
						stroke='#888888'
						fontSize={12}
						tickLine={false}
						axisLine={false}
					/>
					<YAxis
						stroke='#888888'
						fontSize={12}
						tickLine={false}
						axisLine={false}
						tickFormatter={value => `$${value}`}
					/>
					<Bar
						dataKey='totalSales'
						fill='currentColor'
						radius={[4, 4, 0, 0]}
						className='fill-primary'
					/>
				</BarChart>
			</ResponsiveContainer>
		);
	}

	if (productsPerCategory) {
		return (
			<ResponsiveContainer width='100%' height={350}>
				<PieChart width={730} height={250}>
					<Pie
						data={productsPerCategory}
						dataKey='value'
						nameKey='name'
						cx='50%'
						cy='50%'
						fill='#000'
						label
					/>
					<Tooltip />
				</PieChart>
			</ResponsiveContainer>
		);
	}
};

export default Charts;
