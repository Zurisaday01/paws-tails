import { Calendar, User } from 'lucide-react';
import Rating from '../product/rating';
import { formatDateTime } from '@/lib/utils';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { deleteReview } from '@/lib/actions/review.actions';
import ReviewsActions from './reviews-actions';
import { toast } from '@/hooks/use-toast';

interface ReviewCardProps {
	review: Review;
	userId: string;
	reload: () => void;
}

const ReviewCard = ({ review, userId, reload }: ReviewCardProps) => {
	const handleDelete = async () => {
		try {
			const res = await deleteReview({ reviewId: review.id });
			if (res.success) {
				toast({ title: res.message });
			}

			reload();
		} catch (error) {
			console.error(error);
			toast({ title: 'An error occurred', variant: 'destructive' });
		}
	};

	return (
		<Card key={review.id}>
			<CardHeader>
				<div className='flex justify-between items-center'>
					<CardTitle>{review.title}</CardTitle>
					{review.userId === userId && (
						<ReviewsActions
							review={review}
							onDelete={handleDelete}
							reload={reload}
						/>
					)}
				</div>
				<CardDescription>{review.description}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex space-x-4 text-sm text-muted-foreground'>
					<Rating value={review.rating} />
					<div className='flex items-center'>
						<User className='mr-1 h-3 w-3' />
						{review.user ? review.user.name : 'User'}
					</div>
					<div className='flex items-center'>
						<Calendar className='mr-1 h-3 w-3' />
						{formatDateTime(review.createdAt).dateTime}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
export default ReviewCard;
